"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail, AlertCircle, Loader2, HardHat } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router   = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      {/* Animated background grid */}
      <div className="login-bg-grid" />

      {/* Left panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">
            <HardHat size={28} />
          </div>
          <span className="login-brand-name">CPMS</span>
        </div>

        <div className="login-hero">
          <div className="login-hero-tag">
            <div className="dot-active" style={{ width: 8, height: 8 }} />
            Construction Management Platform
          </div>
          <h1 className="login-hero-title">
            Command Center for
            <br />
            <span className="login-hero-accent">Every Build.</span>
          </h1>
          <p className="login-hero-desc">
            Manage vendors, procurement, materials, site operations, and your entire
            construction supply chain — all in one powerful platform.
          </p>
        </div>

        <div className="login-stats">
          {[
            { value: "6+",   label: "Active Vendors" },
            { value: "12+",  label: "Materials Tracked" },
            { value: "3",    label: "Live Projects" },
          ].map((s) => (
            <div key={s.label} className="login-stat">
              <div className="login-stat-value">{s.value}</div>
              <div className="login-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Decorative modules */}
        <div className="login-modules">
          {["Vendor Management", "Procurement Engine", "GRN Tracking", "Site Inventory", "Labour Logs", "Reports"].map((m) => (
            <span key={m} className="login-module-tag">{m}</span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-logo-sm">
              <Building2 size={20} />
            </div>
            <h2>Sign in to CPMS</h2>
            <p>Enter your credentials to access the management dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-xl"
              style={{ width: "100%", marginTop: 8 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Authenticating…
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>

            <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <Link href="/signup" style={{ color: "var(--brand-primary)", fontWeight: 600, textDecoration: "none" }}>
                Sign Up
              </Link>
            </div>
          </form>
        </div>

        <p className="login-footer">
          © 2024 CPMS · Construction Procurement & Management System
        </p>
      </div>

      <style>{`
        .login-shell {
          min-height: 100vh;
          display: flex;
          background: var(--bg-base);
          position: relative;
          overflow: hidden;
        }

        .login-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(208, 83, 43, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(208, 83, 43, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Left */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 56px;
          position: relative;
          border-right: 1px solid var(--bg-border);
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .login-logo {
          width: 44px;
          height: 44px;
          background: var(--brand-amber);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
        }

        .login-brand-name {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .login-hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
          max-width: 500px;
        }

        .login-hero-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--brand-amber);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .login-hero-title {
          font-size: 48px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.15;
          letter-spacing: -1.5px;
        }

        .login-hero-accent {
          background: linear-gradient(135deg, var(--brand-amber), var(--brand-amber-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .login-hero-desc {
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.7;
          max-width: 420px;
        }

        .login-stats {
          display: flex;
          gap: 32px;
          padding: 20px 0;
          border-top: 1px solid var(--bg-border);
          border-bottom: 1px solid var(--bg-border);
          margin-bottom: 24px;
        }

        .login-stat-value {
          font-size: 24px;
          font-weight: 800;
          color: var(--brand-amber);
        }

        .login-stat-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-top: 2px;
        }

        .login-modules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .login-module-tag {
          padding: 5px 12px;
          background: var(--bg-elevated);
          border: 1px solid var(--bg-border-strong);
          border-radius: var(--radius-full);
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* Right */
        .login-right {
          width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 48px;
          gap: 24px;
          position: relative;
        }

        .login-card {
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--bg-border-strong);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }

        .login-card-header {
          padding: 32px 32px 24px;
          text-align: center;
          border-bottom: 1px solid var(--bg-border);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .login-logo-sm {
          width: 44px;
          height: 44px;
          background: var(--brand-amber-muted);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-amber);
          margin-bottom: 4px;
        }

        .login-card-header h2 {
          color: var(--text-primary);
          font-size: 20px;
        }

        .login-card-header p {
          font-size: 13px;
          color: var(--text-muted);
        }

        .login-form {
          padding: 28px 32px 32px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: var(--color-danger-bg);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: var(--radius-md);
          color: var(--color-danger);
          font-size: 13px;
          margin-bottom: 4px;
        }

        .login-demo-hint {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
          padding: 10px 14px;
          background: var(--bg-elevated);
          border: 1px solid var(--bg-border-strong);
          border-radius: var(--radius-md);
          font-size: 12px;
          color: var(--text-muted);
        }

        .login-demo-badge {
          padding: 2px 8px;
          background: var(--brand-amber-muted);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: var(--radius-full);
          font-size: 10px;
          color: var(--brand-amber);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          white-space: nowrap;
        }

        .login-footer {
          font-size: 12px;
          color: var(--text-disabled);
          text-align: center;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 24px; }
        }
      `}</style>
    </div>
  );
}
