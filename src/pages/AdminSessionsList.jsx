import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const API_BASE = "http://localhost:5000/api";

export default function AdminSessionsList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
const [showAttendance, setShowAttendance] = useState(false);
const [loadingAttendance, setLoadingAttendance] = useState(false);


  // Track per-session view mode: "code" or "qr"
  const [viewMode, setViewMode] = useState({}); 

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/sessions`);
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate 6-digit attendance code
  const generateCode = async (sessionId) => {
    try {
      const res = await fetch(
        `${API_BASE}/admin/sessions/${sessionId}/generate-code`,
        { method: "POST" }
      );
      const data = await res.json();

      // Default view mode to "code" after generation
      setViewMode((prev) => ({
        ...prev,
        [sessionId]: "code"
      }));

      // Refresh sessions to get updated code
      fetchSessions();
    } catch (err) {
      alert("Failed to generate attendance code");
    }
  };

  const viewAttendance = async (sessionId) => {
    try {
      setLoadingAttendance(true);
  
      const res = await fetch(
        `${API_BASE}/admin/sessions/${sessionId}/attendance`
      );
  
      if (!res.ok) {
        throw new Error("Failed to fetch attendance");
      }
  
      const data = await res.json();
  
      setAttendanceData(data);
      setShowAttendance(true);
    } catch (err) {
      alert("Failed to fetch attendance details");
    } finally {
      setLoadingAttendance(false);
    }
  };
  

  if (loading) {
    return <div style={styles.center}>Loading sessions...</div>;
  }

  if (error) {
    return <div style={{ ...styles.center, color: "red" }}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin - All Sessions</h2>

      {sessions.length === 0 && (
        <p style={styles.center}>No sessions found</p>
      )}
      {showAttendance && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h3>Attendance Details</h3>

      {loadingAttendance ? (
        <p>Loading...</p>
      ) : attendanceData.length === 0 ? (
        <p>No students attended yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Marked At</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((student, index) => (
              <tr key={index}>
                <td>{student.studentName}</td>
                <td>{student.email}</td>
                <td>
                  {new Date(student.markedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        style={{ ...styles.button, marginTop: "15px" }}
        onClick={() => setShowAttendance(false)}
      >
        Close
      </button>
    </div>
  </div>
)}


      <div style={styles.grid}>
        {sessions.map((session) => (
          <div key={session._id} style={styles.card}>
            <h3>{session.title}</h3>

            <p><b>Instructor:</b> {session.instructor}</p>
            <p><b>Time:</b> {session.startTime} - {session.endTime}</p>
            <p><b>Status:</b> {session.isLive ? "Live" : "Offline"}</p>

            <p>
              <b>Attendance:</b>{" "}
              <span style={{ color: "green", fontWeight: "bold" }}>
                {session.attendanceCount}
              </span>
            </p>

            {/* View Attendance */}
            <button
              style={styles.button}
              onClick={() => viewAttendance(session._id)}
            >
              View Attendance
            </button>

            {/* Generate Code */}
            <button
              style={{ ...styles.button, marginTop: "5px", backgroundColor: "#444" }}
              onClick={() => generateCode(session._id)}
            >
              Generate Attendance Code
            </button>

            {/* Show Code / QR if code exists */}
            {session.attendanceCode && (
              <div style={styles.codeBox}>

                {/* Toggle Buttons */}
                <div style={styles.toggleRow}>
                  <button
                    style={styles.toggleButton}
                    onClick={() =>
                      setViewMode((prev) => ({
                        ...prev,
                        [session._id]: "code"
                      }))
                    }
                  >
                    Show Code
                  </button>

                  <button
                    style={styles.toggleButton}
                    onClick={() =>
                      setViewMode((prev) => ({
                        ...prev,
                        [session._id]: "qr"
                      }))
                    }
                  >
                    Show QR
                  </button>
                </div>

                {/* Display Code */}
                {viewMode[session._id] === "code" && (
                  <h2 style={styles.codeText}>
                    {session.attendanceCode}
                  </h2>
                )}

                {/* Display QR */}
                {viewMode[session._id] === "qr" && (
  <div style={{ marginTop: "10px" }}>
    {console.log("Rendering QR with value:", session.attendanceCode)}

    <QRCodeCanvas
      value={`http://localhost:3000/mark-attendance?code=${session.attendanceCode}&sessionId=${session._id}`}
      size={180}
      
    />
  </div>
)}

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Styles ----------------

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
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
    color: "green",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  toggleRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "10px"
  },
  toggleButton: {
    padding: "6px 12px",
    border: "1px solid #333",
    backgroundColor: "black",
    cursor: "pointer",
    borderRadius: "4px"
  },
  codeBox: {
    marginTop: "15px",
    padding: "10px",
    borderTop: "1px dashed #ccc",
    textAlign: "center"
  },
  codeText: {
    letterSpacing: "6px",
    fontSize: "24px",
    margin: "10px 0"
  },
  center: {
    textAlign: "center",
    padding: "40px"
  }
};
