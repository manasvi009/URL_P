import os
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split

THIS_DIR = Path(__file__).resolve().parent
BACKEND_DIR = THIS_DIR.parent.parent / "backend"
sys.path.append(str(BACKEND_DIR))

from app.feature_extractor import extract_features_df  # noqa: E402


def load_data() -> pd.DataFrame:
    dataset_path = Path(
        os.getenv(
            "DATASET_PATH",
            str(THIS_DIR.parent / "datasets" / "phishing_url_dataset_unique.csv"),
        )
    )
    if not dataset_path.exists():
        raise FileNotFoundError(f"Dataset not found: {dataset_path}")

    df = pd.read_csv(dataset_path)[["url", "label"]].dropna()
    df["label"] = df["label"].astype(int)
    df = df[df["label"].isin([0, 1])].drop_duplicates(subset=["url"])
    return df


def main() -> None:
    df = load_data()
    print("Loaded:", len(df), "rows")
    print("Class counts:", df["label"].value_counts().to_dict())

    print("Extracting features...")
    X = pd.DataFrame(extract_features_df(df["url"].tolist())).replace([np.inf, -np.inf], np.nan).fillna(0)
    y = df["label"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=600,
        max_depth=None,
        min_samples_leaf=2,
        class_weight="balanced_subsample",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    proba = model.predict_proba(X_test)[:, 1]
    pred = (proba >= 0.5).astype(int)

    print("\n=== Classification Report ===")
    print(classification_report(y_test, pred, digits=4))
    print("\n=== Confusion Matrix ===")
    print(confusion_matrix(y_test, pred))
    print("\nROC-AUC:", round(roc_auc_score(y_test, proba), 6))

    models_dir = BACKEND_DIR / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, models_dir / "phishing_model_v6.pkl")
    joblib.dump(list(X.columns), models_dir / "feature_columns_v6.pkl")

    print("\nSaved:")
    print(models_dir / "phishing_model_v6.pkl")
    print(models_dir / "feature_columns_v6.pkl")


if __name__ == "__main__":
    main()
