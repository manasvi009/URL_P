import React from 'react';
import { Link } from 'react-router-dom';
import useScanLimit from '../hooks/useScanLimit';
import FuturisticHero from '../components/FuturisticHero';
import '../App.css';

const LandingPage = () => {
  const { getRemainingScans, isLoggedIn } = useScanLimit();
  
  return (
    <div className="landing-page">
      <FuturisticHero />
      
      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Advanced Security Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Real-time Protection</h3>
              <p>Continuous monitoring and analysis of URLs to detect threats instantly</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI-Powered Detection</h3>
              <p>Machine learning algorithms that evolve to counter new phishing techniques</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Analytics</h3>
              <p>Comprehensive reports and insights on detected threats and trends</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Secure Your Digital Assets?</h2>
          <p>Join thousands of organizations protected by our advanced cybersecurity platform</p>
          {!isLoggedIn && (
            <p className="text-xl text-cyan-300 mt-4">
              Get <span className="font-bold text-cyan-400">{getRemainingScans()}</span> free scans before signing up!
            </p>
          )}
          <div className="cta-buttons">
            <Link to="/login" className="btn-primary">Get Started</Link>
            <Link to="/register" className="btn-secondary">Try Demo</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;