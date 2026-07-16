import "../auth.css";
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

          </form>
          
          <div style={{ textAlign: "center", marginBottom: "32px", fontSize: "14px", color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <Link href="/signup" style={{ color: "var(--brand-primary)", fontWeight: 600, textDecoration: "none" }}>
                Sign Up
              </Link>
          </div>
        </div>

        <p className="login-footer">
          © 2024 CPMS · Construction Procurement & Management System
        </p>
      </div>

      
    </div>
  );
}
