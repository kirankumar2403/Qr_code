import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import TextInput from '../components/TextInput';
import GradientButton from '../components/GradientButton';
import { redirectToGoogleOAuth } from '../utils/googleAuth';

function GoogleButton() {
  return (
    <button
      type="button"
      onClick={redirectToGoogleOAuth}
      className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-slate-100 backdrop-blur-md transition hover:bg-white/10"
      aria-label="Continue with Google"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.5-5.5 3.5-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.7C16.5 2.5 14.4 1.5 12 1.5 6.8 1.5 2.5 5.8 2.5 11s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.4 0-.6-.1-1.1-.2-1.5H12z"
        />
      </svg>
      <span>Continue with Google</span>
    </button>
  );
}

const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.05 * i, duration: 0.35 } }),
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const next = { email: '', password: '' };
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';

    setErrors(next);
    return !next.email && !next.password;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save user session
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // ⏳ Add 3-second loading delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);

      } else {
        setLoading(false);
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      setLoading(false);
      alert("Network error: " + err.message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        <span>
          New here? <Link to="/signup" className="font-semibold text-primary-300 hover:underline">Create an account</Link>
        </span>
      }
    >
      <motion.form onSubmit={onSubmit} className="space-y-4" initial="hidden" animate="show">
        
        <motion.div
          variants={fieldVariants}
          custom={0}
          animate={errors.email ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
        >
          <TextInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            errorMessage={errors.email}
          />
        </motion.div>

        <motion.div
          variants={fieldVariants}
          custom={1}
          animate={errors.password ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
        >
          <TextInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            errorMessage={errors.password}
          />
        </motion.div>

        <motion.div variants={fieldVariants} custom={2}>
          <GradientButton type="submit" loading={loading}>
            Sign in
          </GradientButton>
        </motion.div>

        <motion.div className="relative py-2 text-center text-sm text-slate-400" variants={fieldVariants} custom={3}>
          <span className="px-2">or continue with</span>
        </motion.div>

        <motion.div className="flex justify-center" variants={fieldVariants} custom={4}>
          <GoogleButton />
        </motion.div>

      </motion.form>
    </AuthLayout>
  );
}
