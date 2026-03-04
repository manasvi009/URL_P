# backend/app/model_service.py

from __future__ import annotations

import re
from pathlib import Path
from typing import Dict, Tuple, Any, Optional
from urllib.parse import urlparse

import joblib
import numpy as np
import pandas as pd
import tldextract

from app.feature_extractor import extract_features


BASE_DIR = Path(__file__).resolve().parents[1]  # backend/
MODELS_DIR = BASE_DIR / "models"

_MODEL: Any = None
_FEATURE_COLUMNS: Optional[list] = None
_SCALER = None


TRUSTED_DOMAINS = {
    "google.com", "www.google.com", "youtube.com", "www.youtube.com",
    "github.com", "www.github.com", "amazon.com", "www.amazon.com",
    "ebay.com", "www.ebay.com", "stackoverflow.com", "www.stackoverflow.com",
    "facebook.com", "www.facebook.com", "twitter.com", "www.twitter.com",
    "linkedin.com", "www.linkedin.com", "reddit.com", "www.reddit.com",
    "wikipedia.org", "www.wikipedia.org", "apple.com", "www.apple.com",
    "microsoft.com", "www.microsoft.com", "adobe.com", "www.adobe.com",
    "oracle.com", "www.oracle.com", "docs.oracle.com", "www.docs.oracle.com",
    "nytimes.com", "www.nytimes.com", "cnn.com", "www.cnn.com",
    "bbc.com", "www.bbc.com", "amazonaws.com", "www.amazonaws.com",
    "cloudflare.com", "www.cloudflare.com",
}
TRUSTED_REGISTRABLE_DOMAINS = {d[4:] if d.startswith("www.") else d for d in TRUSTED_DOMAINS}

BRAND_DOMAINS = {
    "google", "youtube", "github", "amazon", "paypal", "apple", "microsoft",
    "facebook", "instagram", "whatsapp", "linkedin", "twitter", "reddit",
    "netflix", "adobe", "bankofamerica", "chase", "wellsfargo", "citibank",
}


def _heuristic_adjustment(url: str, feats: Dict[str, Any]) -> Tuple[float, list]:
    """
    Return a probability adjustment and explanation reasons.
    Positive values increase phishing risk; negative values reduce it.
    """
    norm = _normalize_url(url)
    parsed = urlparse(norm)
    host = (parsed.netloc or "").split("@")[-1].split(":")[0].lower()
    ext = tldextract.extract(host)
    registrable = ".".join(x for x in [ext.domain, ext.suffix] if x)

    adjustment = 0.0
    reasons = []

    if feats.get("has_ip", 0) == 1 or feats.get("has_hex_ip", 0) == 1:
        adjustment += 0.25
        reasons.append("ip_host")
    if feats.get("has_at_symbol", 0) == 1:
        adjustment += 0.20
        reasons.append("at_symbol")
    if feats.get("has_punycode", 0) == 1:
        adjustment += 0.15
        reasons.append("punycode")
    if feats.get("double_slash_after_scheme", 0) == 1:
        adjustment += 0.10
        reasons.append("double_slash_after_scheme")
    if feats.get("is_suspicious_tld", 0) == 1:
        adjustment += 0.12
        reasons.append("suspicious_tld")
    if feats.get("http_count", 0) >= 2 or feats.get("has_http_in_path", 0) == 1:
        adjustment += 0.10
        reasons.append("embedded_http")
    if feats.get("sensitive_token_hits", 0) >= 2:
        adjustment += 0.12
        reasons.append("sensitive_tokens")
    if feats.get("host_has_hyphen", 0) == 1 and feats.get("brand_word_hits", 0) >= 2:
        adjustment += 0.18
        reasons.append("hyphen_plus_brand_bait")
    if feats.get("is_shortener", 0) == 1 and feats.get("sensitive_token_hits", 0) >= 1:
        adjustment += 0.10
        reasons.append("shortener_with_sensitive_path")

    # Brand impersonation signal: brand appears in host, but registered domain is different.
    for brand in BRAND_DOMAINS:
        if brand in host and brand not in (ext.domain or ""):
            adjustment += 0.35
            reasons.append(f"brand_impersonation:{brand}")
            break

    # Keep post-model adjustment bounded.
    adjustment = max(-0.25, min(0.45, adjustment))
    return adjustment, reasons


def _normalize_url(url: str) -> str:
    """
    Make URL parse-friendly for consistent feature extraction:
    - strip spaces
    - add http:// if scheme missing
    """
    url = (url or "").strip()
    if not url:
        return ""
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", url):
        url = "http://" + url
    return url


def _load_artifacts() -> Tuple[Any, list, Any]:
    """
    Load model, feature columns and scaler. Cached in memory after first call.
    """
    global _MODEL, _FEATURE_COLUMNS, _SCALER

    if _MODEL is None or _FEATURE_COLUMNS is None:
        # Prefer v6 first, then fallback to older artifacts.
        model_path = MODELS_DIR / "phishing_model_v6.pkl"
        cols_path = MODELS_DIR / "feature_columns_v6.pkl"
        scaler_path = None

        if not model_path.exists():
            model_path = MODELS_DIR / "phishing_model_v5.pkl"
            cols_path = MODELS_DIR / "feature_columns_v5.pkl"
            scaler_path = MODELS_DIR / "feature_scaler_v5.pkl"

        if not model_path.exists():
            model_path = MODELS_DIR / "phishing_model_v4.pkl"
            cols_path = MODELS_DIR / "feature_columns_v4.pkl"
            scaler_path = MODELS_DIR / "feature_scaler.pkl"

        if not model_path.exists():
            raise FileNotFoundError(
                f"Model not found at {model_path}. Run: python training/train_v5.py"
            )
        if not cols_path.exists():
            raise FileNotFoundError(
                f"Feature columns file not found at {cols_path}. Run: python training/train_v5.py"
            )

        _MODEL = joblib.load(model_path)
        _FEATURE_COLUMNS = joblib.load(cols_path)
        
        # Load scaler if it exists for chosen model version.
        if scaler_path is not None and scaler_path.exists():
            _SCALER = joblib.load(scaler_path)
        else:
            _SCALER = None

    return _MODEL, _FEATURE_COLUMNS, _SCALER


def _build_feature_row(url: str, feature_columns: list) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Extract features and return a 1-row dataframe in the exact training column order.
    """
    url = _normalize_url(url)
    feats = extract_features(url)

    X = pd.DataFrame([feats])

    # Ensure all expected columns exist
    for col in feature_columns:
        if col not in X.columns:
            X[col] = 0

    # Exact order + sanitize numeric values
    X = X[feature_columns].replace([np.inf, -np.inf], np.nan).fillna(0)

    # Ensure numeric dtype for safety
    for c in X.columns:
        if X[c].dtype == "object":
            X[c] = pd.to_numeric(X[c], errors="coerce").fillna(0)

    return X, feats


def _top_feature_hints(model: Any, feature_columns: list, X: pd.DataFrame, top_k: int = 8):
    """
    Approximate "why" using feature_importances_ (XGBoost/RandomForest) × feature value.
    Not perfect, but very useful for debugging.
    """
    # Check if the model has feature_importances_ attribute
    if hasattr(model, "feature_importances_"):
        importances = np.array(model.feature_importances_, dtype=float)
        if importances.shape[0] != len(feature_columns):
            return []

        vals = X.iloc[0].to_numpy(dtype=float)
        scores = importances * np.abs(vals)

        idx = np.argsort(scores)[::-1][:top_k]
        out = []
        for i in idx:
            out.append(
                {
                    "feature": feature_columns[i],
                    "value": float(vals[i]),
                    "importance": float(importances[i]),
                    "score": float(scores[i]),
                }
            )
        return out
    # If no feature_importances_ attribute, return empty list
    return []


def predict_url(
    url: str,
    threshold: float = 0.85,
    debug: bool = False,
) -> Dict[str, Any]:
    """
    Predict if a URL is phishing using the trained model.

    Returns:
      {
        "risk_score": float (0..1),
        "prediction": int (1 phishing, 0 legitimate),
        "label": str,
        "features": dict,
        "debug": {...}   # only when debug=True
      }
    """
    if not url or not str(url).strip():
        return {
            "risk_score": 0.0,
            "prediction": 0,
            "label": "legitimate",
            "features": {},
        }

    model, feature_columns, scaler = _load_artifacts()

    X, feats = _build_feature_row(url, feature_columns)

    # Apply scaling if scaler exists
    if scaler is not None:
        X_scaled = scaler.transform(X)
        # Predict probability of phishing
        raw_proba = float(model.predict_proba(X_scaled)[:, 1][0])
    else:
        # Predict probability of phishing
        raw_proba = float(model.predict_proba(X)[:, 1][0])

    # Clamp to valid range (safety)
    raw_proba = max(0.0, min(1.0, raw_proba))
    
    heuristic_adj, heuristic_reasons = _heuristic_adjustment(url, feats)
    adjusted_proba = max(0.0, min(1.0, raw_proba + heuristic_adj))

    # Trusted-domain override (exact registrable domain match only).
    norm = _normalize_url(url)
    parsed = urlparse(norm)
    host = (parsed.netloc or "").split("@")[-1].split(":")[0].lower()
    ext = tldextract.extract(host)
    registrable = ".".join(x for x in [ext.domain, ext.suffix] if x)
    has_brand_impersonation = any(r.startswith("brand_impersonation:") for r in heuristic_reasons)
    strong_suspicious = (
        feats.get("has_ip", 0) == 1
        or feats.get("has_hex_ip", 0) == 1
        or feats.get("has_at_symbol", 0) == 1
        or feats.get("has_punycode", 0) == 1
        or feats.get("is_suspicious_tld", 0) == 1
        or has_brand_impersonation
    )
    if registrable in TRUSTED_REGISTRABLE_DOMAINS and not strong_suspicious:
        adjusted_proba = min(adjusted_proba, 0.15)
        heuristic_reasons.append("trusted_domain_override")
    else:
        # Conservative benign-profile reduction for non-trusted domains.
        tld = (ext.suffix or "").split(".")[-1].lower() if ext.suffix else ""
        common_tld = tld in {"com", "org", "net", "edu", "gov", "io", "co", "in"}
        benign_profile = (
            common_tld
            and feats.get("is_https", 0) == 1
            and feats.get("is_valid_url", 0) == 1
            and feats.get("has_ip", 0) == 0
            and feats.get("has_hex_ip", 0) == 0
            and feats.get("has_at_symbol", 0) == 0
            and feats.get("has_punycode", 0) == 0
            and feats.get("is_suspicious_tld", 0) == 0
            and feats.get("double_slash_after_scheme", 0) == 0
            and feats.get("is_shortener", 0) == 0
            and feats.get("host_has_hyphen", 0) == 0
            and feats.get("brand_word_hits", 0) == 0
            and feats.get("sensitive_token_hits", 0) == 0
        )
        if benign_profile:
            adjusted_proba = max(0.0, adjusted_proba - 0.18)
            heuristic_reasons.append("benign_profile_adjustment")

    pred = 1 if adjusted_proba >= threshold else 0

    resp: Dict[str, Any] = {
        "risk_score": round(adjusted_proba, 6),
        "prediction": pred,
        "label": "phishing" if pred == 1 else "legitimate",
        "features": feats,
    }

    if debug:
        resp["debug"] = {
            "normalized_url": _normalize_url(url),
            "threshold": threshold,
            "raw_probability": round(raw_proba, 6),
            "heuristic_adjustment": round(heuristic_adj, 6),
            "adjusted_probability": round(adjusted_proba, 6),
            "heuristic_reasons": heuristic_reasons,
            "top_feature_hints": _top_feature_hints(model, feature_columns, X),
            "feature_row_preview": X.iloc[0].to_dict(),
        }

    return resp
