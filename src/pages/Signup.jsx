import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import GradientButton from "../components/GradientButton";
import TextInput from "../components/TextInput";


const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Signup() {
  const navigate =useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Username is required";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "At least 6 characters";
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Account created successfully!");
        navigate("/dashboard");
        setForm({
          username: "",
          password: "",
          fullName: "",
          email: "",
        });
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      setLoading(false);
      alert("Network error: " + err.message);
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle={
        <span>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary-300 underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </span>
      }
    >
      <motion.form
        onSubmit={onSubmit}
        className="space-y-4"
        initial="hidden"
        animate="show"
      >
        {[
          { label: "Username", name: "username", type: "text", placeholder: "Choose a username" },
          { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
          { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name" },
          { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
        ].map((field, i) => (
          <motion.div
            key={field.name}
            variants={fieldVariants}
            custom={i}
            animate={errors[field.name] ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TextInput
              label={field.label}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              error={!!errors[field.name]}
              errorMessage={errors[field.name]}
            />
          </motion.div>
        ))}

        

        <motion.div variants={fieldVariants} custom={6}>
          <GradientButton type="submit" loading={loading}>
            Create Account
          </GradientButton>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
