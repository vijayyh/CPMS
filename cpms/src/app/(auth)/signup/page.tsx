"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail, User, AlertCircle, Loader2, HardHat, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import "../auth.css";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Theme Management
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create account. Please try again.");
      } else {
        toast.success("Account created successfully!");
        router.push("/login");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <button 
        onClick={toggleTheme} 
        className="btn-icon theme-toggle" 
        title="Toggle Theme"
        style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 100, background: 'rgba(128,128,128,0.1)', border: 'none', color: 'var(--text-primary)', padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Animated background grid */}
      <div className="login-bg-grid" />

      {/* Left panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">
            <Building2 size={24} />
          </div>
          <span className="login-brand-name">CPMS</span>
        </div>

        <div className="login-hero">
          <div className="login-hero-tag">
            <div className="dot-active" style={{ width: 8, height: 8 }} />
            Construction Management Platform
          </div>
          <div className="login-hero-pretitle" style={{ fontSize: '24px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '-12px' }}>
            Command Center for
          </div>
          <h1 className="login-hero-title" style={{ fontSize: '56px', lineHeight: '1.1' }}>
            <span className="login-hero-accent">Sustaniq Civilcon.</span>
          </h1>
          <p className="login-hero-desc" style={{ fontSize: '14px', lineHeight: '1.5', maxWidth: '420px' }}>
            Internal construction ERP for Sustaniq Civilcon LLP. Streamlining procurement, site execution, quality control, and subcontractor billing across 10+ active sites in Mumbai.
          </p>
        </div>

        <div className="login-stats">
          {[
            { value: <AnimatedCounter value={100000} suffix="+" />, label: "Items Procured" },
            { value: <AnimatedCounter value={99} suffix="%" />, label: "On-time Deliveries" },
            { value: <AnimatedCounter value={500} suffix="+" />, label: "Trusted Partners" },
          ].map((s) => (
            <div key={s.label} className="login-stat">
              <div className="login-stat-value">{s.value}</div>
              <div className="login-stat-label">{s.label}</div>
            </div>
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
            <h2>Create an Account</h2>
            <p>Enter your details below to set up your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: "relative" }}>
                <User
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
                  id="name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                  minLength={6}
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
              id="signup-submit"
              type="submit"
              className="btn btn-primary btn-xl"
              style={{ width: "100%", marginTop: 8 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Creating Account…
                </>
              ) : (
                "Sign Up"
              )}
            </button>
            
            <div className="social-divider">or continue with</div>

            <div className="social-btn-group">
              <button type="button" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.2 21.9 10.4 21.7 9.7H12V14.1H17.8C17.5 15.6 16.3 16.7 14.8 17.2V17.2C13.9 17.5 13 17.7 12 17.7C8.7 17.7 6 15 6 11.7C6 10.7 6.3 9.7 6.8 8.9L10.3 12.4L8.3 14.4C7.5 13 7 11.4 7 9.7C7 6.9 9.2 4.7 12 4.7C13.5 4.7 14.8 5.3 15.7 6.2L19.2 2.7C17.3 1.1 14.8 0 12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24V22Z" fill="currentColor" stroke="none" /></svg>
                Google
              </button>
              <button type="button" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Phone
              </button>
            </div>

            <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--brand-primary)", fontWeight: 600, textDecoration: "none" }}>
                Sign in
              </Link>
            </div>
          </form>
        </div>
        

        <p className="login-footer">
          © 2024 CPMS · Construction Procurement & Management System
        </p>
      </div>
    </div>
  );
}
