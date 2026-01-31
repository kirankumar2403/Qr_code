import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [enteredCode, setEnteredCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Logged-in user (stored after login)
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchLiveSessions();
    const interval = setInterval(fetchLiveSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/sessions/live?userId=${user?._id}`
      );
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAttendanceForm = (sessionId) => {
    setSelectedSessionId(sessionId);
    setEnteredCode("");
  };

  const submitAttendance = async () => {
    if (!enteredCode.trim()) {
      alert("Please enter attendance code");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          sessionId: selectedSessionId,
          code: enteredCode.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Attendance marked successfully");

      // Update UI
      setSessions(prev =>
        prev.map(s =>
          s._id === selectedSessionId ? { ...s, attended: true } : s
        )
      );

      setSelectedSessionId(null);
      setEnteredCode("");
    } catch {
      alert("Server error");
    } finally {
      setSubmitting(false);
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
      <h2 style={styles.heading}>Live Sessions</h2>

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

            {session.attended ? (
              <button style={{ ...styles.button, backgroundColor: "green" }} disabled>
                Attended
              </button>
            ) : (
              <>
                <button
                  style={styles.button}
                  onClick={() => openAttendanceForm(session._id)}
                >
                  Mark Attendance
                </button>

                {selectedSessionId === session._id && (
                  <div style={styles.codeBox}>
                    <input
                      type="text"
                      placeholder="Enter attendance code"
                      value={enteredCode}
                      onChange={(e) =>
                        setEnteredCode(e.target.value.toUpperCase())
                      }
                      style={styles.input}
                    />
                    <button
                      style={styles.submitBtn}
                      onClick={submitAttendance}
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

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
  codeBox: {
    marginTop: "10px",
    display: "flex",
    gap: "8px"
  },
  input: {
    flex: 1,
    padding: "8px",
    textTransform: "uppercase"
  },
  submitBtn: {
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
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
