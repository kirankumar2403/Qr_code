import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For demo: get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchLiveSessions();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLiveSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/sessions/live`);
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (sessionId) => {
    try {
      if (!user) {
        alert("Please login first");
        return;
      }

      const res = await fetch(`${API_BASE}/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          sessionId: sessionId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to mark attendance");
        return;
      }

      // Update UI after marking attendance
      setSessions((prev) =>
        prev.map((s) =>
          s._id === sessionId ? { ...s, attended: true } : s
        )
      );

      alert("Attendance marked successfully");
    } catch (err) {
      alert("Server error while marking attendance");
    }
  };

  if (loading) {
    return <div style={styles.center}>Loading live sessions...</div>;
  }

  if (error) {
    return <div style={{ ...styles.center, color: "red" }}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Live Sessions Dashboard</h2>

      {sessions.length === 0 && (
        <p style={styles.noData}>No live sessions available</p>
      )}

      <div style={styles.grid}>
        {sessions.map((session) => (
          <div key={session._id} style={styles.card}>
            <h3>{session.title}</h3>
            <p><b>Instructor:</b> {session.instructor}</p>
            <p><b>Time:</b> {session.startTime} - {session.endTime}</p>
            <p><b>Status:</b> {session.isLive ? "Live" : "Upcoming"}</p>

            <button
              style={
                session.attended
                  ? { ...styles.button, backgroundColor: "#aaa" }
                  : styles.button
              }
              disabled={session.attended}
              onClick={() => markAttendance(session._id)}
            >
              {session.attended ? "Attendance Marked" : "Mark Attendance"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Simple Inline Styles ----------------
const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif"
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
  button: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    backgroundColor: "black",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  center: {
    padding: "40px",
    textAlign: "center"
  },
  noData: {
    textAlign: "center",
    color: "#555"
  }
};
