import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get("access_token");

    if (!accessToken) {
      alert("Google login failed");
      return navigate("/login");
    }

    // Fetch user profile from Google API
    fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(async (profile) => {
        // Send user to backend
        const res = await fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: profile.email,
            name: profile.name,
            picture: profile.picture
          })
        });

        const data = await res.json();

        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/app/dashboard");
      });
  }, []);

  return <h2>Logging in with Google...</h2>;
}
