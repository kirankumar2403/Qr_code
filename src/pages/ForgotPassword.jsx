import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import TextInput from '../components/TextInput';
import GradientButton from '../components/GradientButton';

const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.05 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] } })
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: '' });

  const validate = () => {
    const next = { email: '' };
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    setErrors(next);
    return !next.email;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert(`Reset link sent to ${email}`);
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle={<span>We’ll send a reset link to your email.</span>}
      footer={<span>Remember your password? <Link to="/" className="text-primary-300 underline-offset-4 hover:underline">Back to sign in</Link></span>}
    >
      <motion.form onSubmit={onSubmit} className="space-y-4" initial="hidden" animate="show">
        <motion.div
          variants={fieldVariants}
          custom={0}
          animate={errors.email ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TextInput
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            error={!!errors.email}
            errorMessage={errors.email}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            }
          />
        </motion.div>

        <motion.div variants={fieldVariants} custom={1}>
          <GradientButton type="submit">Send reset link</GradientButton>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
