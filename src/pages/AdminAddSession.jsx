import React, { useState } from "react";

const API_BASE = "http://localhost:5000/api";

export default function AdminAddSession() {
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !instructor || !startTime || !endTime) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch(`${API_BASE}/sessions/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          instructor,
          startTime,
          endTime,
          isLive
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.message || "Failed to create session" });
        return;
      }

      setMessage({ type: "success", text: "Session created successfully" });

      // Reset form
      setTitle("");
      setInstructor("");
      setStartTime("");
      setEndTime("");
      setIsLive(false);

    } catch (err) {
      setMessage({ type: "error", text: "Server error while creating session" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin - Add Live Session</h2>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label>Session Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter session title"
          />
        </div>

        <div style={styles.field}>
          <label>Instructor</label>
          <input
            type="text"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            placeholder="Enter instructor name"
          />
        </div>

        <div style={styles.field}>
          <label>Start Time</label>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="10:00"
          />
        </div>

        <div style={styles.field}>
          <label>End Time</label>
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="11:00"
          />
        </div>

        <div style={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={isLive}
            onChange={(e) => setIsLive(e.target.checked)}
          />
          <span>Mark as Live Now</span>
        </div>

        <button style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Add Session"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "10px",
              color: message.type === "error" ? "red" : "green"
            }}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}

// ---------------- Styles ----------------
const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif"
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "black",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};
