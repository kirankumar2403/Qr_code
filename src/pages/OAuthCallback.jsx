import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function OAuthCallback() {
  const query = useQuery();
  const navigate = useNavigate();

  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Verifying response…");

  useEffect(() => {
    const code = query.get("code");
    const state = query.get("state");
    const error = query.get("error");

    if (error) {
      setStatus("error");
      setMessage("Authorization failed.");
      return;
    }

    const expectedState = sessionStorage.getItem("oauth_state");
    if (state !== expectedState) {
      setStatus("error");
      setMessage("Invalid OAuth state. Try again.");
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("Missing authorization code.");
      return;
    }

    // ⭐ Send code to backend
    fetch("http://localhost:5000/api/oauth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    })
      .then(res => res.json())
      .then((data) => {
        if (!data.user) {
          setStatus("error");
          setMessage("Backend failed to authenticate.");
          return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));

        setStatus("success");
        setMessage("Login successful! Redirecting…");

        setTimeout(() => navigate("/app/dashboard"), 1500);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error.");
      });
  }, []);

  return (
    <AuthLayout title="Connecting to Google">
      <div className="space-y-4 text-center">
        <p className={`${status === "success" ? "text-emerald-300" : status === "error" ? "text-red-300" : "text-slate-300"}`}>
          {message}
        </p>
      </div>
    </AuthLayout>
  );
}
