import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Building2, Lock, Mail, AlertCircle, Loader2, Sun, Moon } from "lucide-react-native";
import { useAuthStore } from "../core/authStore";

// Minimal animated counter to match the web app without heavy dependencies
function AnimatedCounter({ value, suffix }: { value: number, suffix: string }) {
  return <span>{value}{suffix}</span>;
}

export default function WebLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setSessionToken } = useAuthStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Temporary mock login since we don't have the full API integration yet
      if (email && password) {
        setUser({ id: "1", name: "Admin User", email: email, role: "ADMIN" });
        await setSessionToken("mock_token");
        router.replace("/(tabs)");
      } else {
        throw new Error("Invalid");
      }
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell" style={{ backgroundColor: isDark ? '#0B0F19' : '#FDFDFE' }}>
      <button 
        onClick={toggleTheme} 
        className="btn-icon theme-toggle" 
        title="Toggle Theme"
        style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 100, background: 'rgba(128,128,128,0.1)', border: 'none', color: 'var(--text-primary)', padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
      >
        {isDark ? <Sun size={20} color="var(--text-primary)" /> : <Moon size={20} color="var(--text-primary)" />}
      </button>

      {/* Animated background grid */}
      <div className="login-bg-grid" />

      {/* Left panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">
            <Building2 size={24} color="#000" />
          </div>
          <span className="login-brand-name">CPMS</span>
        </div>

        <div className="login-hero">
          <div className="login-hero-tag">
            <div className="dot-active" style={{ width: 8, height: 8, backgroundColor: 'var(--brand-amber)', borderRadius: '50%' }} />
            Construction Management Platform
          </div>
          <h1 className="login-hero-title">
            Command Center for
            <br />
            <span className="login-hero-accent">Sustaniq Civilcon.</span>
          </h1>
          <p className="login-hero-desc" style={{ fontSize: '14px', lineHeight: '1.5', maxWidth: '420px' }}>
            Internal construction ERP for Sustaniq Civilcon LLP. Streamlining procurement, site execution, quality control, and subcontractor billing across 10+ active sites in Mumbai.
          </p>
        </div>

        <div className="login-stats">
          {[
            { value: <AnimatedCounter value={1250} suffix="+" />, label: "Active Vendors" },
            { value: <AnimatedCounter value={15000} suffix="+" />, label: "Materials Tracked" },
            { value: <AnimatedCounter value={300} suffix="+" />, label: "Live Projects" },
          ].map((s) => (
            <div key={s.label} className="login-stat">
              <div className="login-stat-value">{s.value}</div>
              <div className="login-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

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
              <Building2 size={20} color="var(--brand-amber)" />
            </div>
            <h2>Sign in to CPMS</h2>
            <p>Enter your credentials to access the management dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: 'absolute', left: 12, top: 10, zIndex: 10 }}>
                  <Mail size={15} color="var(--text-muted)" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  style={{ 
                    paddingLeft: 36, 
                    width: '100%', 
                    height: 40, 
                    borderRadius: 8, 
                    border: '1px solid var(--bg-border-strong)', 
                    background: 'var(--bg-app)', 
                    color: 'var(--text-primary)' 
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Password</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: 'absolute', left: 12, top: 10, zIndex: 10 }}>
                  <Lock size={15} color="var(--text-muted)" />
                </div>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  style={{ 
                    paddingLeft: 36, 
                    width: '100%', 
                    height: 40, 
                    borderRadius: 8, 
                    border: '1px solid var(--bg-border-strong)', 
                    background: 'var(--bg-app)', 
                    color: 'var(--text-primary)' 
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error ? (
              <div className="login-error">
                <AlertCircle size={14} color="var(--color-danger)" />
                <span style={{ marginLeft: 8 }}>{error}</span>
              </div>
            ) : null}

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-xl"
              style={{ 
                width: "100%", 
                marginTop: 8, 
                height: 44, 
                background: 'var(--brand-primary)', 
                color: 'white', 
                border: 'none', 
                borderRadius: 8, 
                fontWeight: 600, 
                cursor: 'pointer' 
              }}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>

            <div className="social-divider" style={{ margin: '24px 0', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
              or continue with
            </div>

            <div className="social-btn-group" style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="social-btn" style={{ flex: 1, height: 40, background: 'var(--bg-card)', border: '1px solid var(--bg-border-strong)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-primary)' }}>
                Google
              </button>
              <button type="button" className="social-btn" style={{ flex: 1, height: 40, background: 'var(--bg-card)', border: '1px solid var(--bg-border-strong)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-primary)' }}>
                Phone
              </button>
            </div>

          </form>

        </div>

        <p className="login-footer" style={{ marginTop: 24 }}>
          CPMS · Construction Procurement & Management System
        </p>
      </div>
    </div>
  );
}
