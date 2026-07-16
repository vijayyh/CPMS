"use client";
import "../auth.css";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail, User, AlertCircle, Loader2, HardHat } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
            Start Building
            <br />
            <span className="login-hero-accent">With Confidence.</span>
          </h1>
          <p className="login-hero-desc">
            Join the future of construction management. Streamline operations and get complete visibility over your supply chain.
          </p>
        </div>

        <div className="login-stats">
          {[
            { value: "30%",  label: "Faster Procurement" },
            { value: "100%", label: "Real-time Tracking" },
            { value: "0",    label: "Paperwork" },
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
            
            <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--brand-primary)", fontWeight: 600, textDecoration: "none" }}>
                Sign in
              </Link>
            </div>
          </form>
        
        <p className="login-footer">
          © 2024 CPMS · Construction Procurement & Management System
        </p>
      </div>
    </div>
  );
}
