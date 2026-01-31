const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// ---------------- Middleware ----------------
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ---------------- MongoDB Connection ----------------
mongoose
  .connect("mongodb+srv://23211a05l8:1234@cluster0.bfdje2e.mongodb.net/student")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("MongoDB Error:", err));

// ---------------- User Schema ----------------
const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: { type: String, required: true, unique: true },
  picture: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// ---------------- Session Schema ----------------
const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isLive: { type: Boolean, default: false },

  // NEW FIELDS
  attendanceCode: { type: String, default: null },
  codeActive: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});


const Session = mongoose.model("Session", sessionSchema);

// ---------------- Attendance Schema ----------------
const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  markedAt: { type: Date, default: Date.now }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

// ---------------- Auth APIs ----------------

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    user = new User({ username, fullName, email, password });
    await user.save();

    res.status(201).json({ message: "Signup successful", user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (password !== user.password)
      return res.status(401).json({ message: "Incorrect password" });

    return res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Admin APIs ----------------
// Generate attendance code for a session (Admin)
app.post("/api/admin/sessions/:sessionId/generate-code", async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const session = await Session.findByIdAndUpdate(
      sessionId,
      {
        attendanceCode: code,
        codeActive: true
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({
      message: "Attendance code generated",
      attendanceCode: session.attendanceCode
    });
  } catch (err) {
    console.error("Generate code error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ---------------- Admin: View attendance for a session ----------------
app.get("/api/admin/sessions/:sessionId/attendance", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const records = await Attendance.find({ sessionId })
      .populate("userId", "fullName email");

    const result = records.map((record) => ({
      studentName: record.userId.fullName,
      email: record.userId.email,
      markedAt: record.markedAt
    }));

    res.json(result);
  } catch (err) {
    console.error("Fetch session attendance error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle attendance code active/inactive
app.post("/api/admin/sessions/:sessionId/toggle-code", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { active } = req.body; // true or false

    const session = await Session.findByIdAndUpdate(
      sessionId,
      { codeActive: active },
      { new: true }
    );

    res.json({
      message: "Code status updated",
      codeActive: session.codeActive
    });
  } catch (err) {
    console.error("Toggle code error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new session
app.post("/api/sessions/create", async (req, res) => {
  try {
    const { title, instructor, startTime, endTime, isLive } = req.body;

    if (!title || !instructor || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const session = new Session({
      title,
      instructor,
      startTime,
      endTime,
      isLive: isLive || false
    });

    await session.save();
    res.status(201).json({ message: "Session created successfully", session });
  } catch (err) {
    console.error("Create session error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all sessions with attendance count (Admin panel)
app.get("/api/admin/sessions", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });

    const sessionsWithAttendance = await Promise.all(
      sessions.map(async (session) => {
        const count = await Attendance.countDocuments({
          sessionId: session._id
        });

        return {
          _id: session._id,
          title: session.title,
          instructor: session.instructor,
          startTime: session.startTime,
          endTime: session.endTime,
          isLive: session.isLive,
          createdAt: session.createdAt,
          attendanceCount: count,

          // 🔥 THIS WAS MISSING
          attendanceCode: session.attendanceCode,
          codeActive: session.codeActive
        };
      })
    );

    res.json(sessionsWithAttendance);
  } catch (err) {
    console.error("Fetch all sessions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ---------------- Student APIs ----------------

// Get all live sessions + attended status for a user
// Call like: /api/sessions/live?userId=USER_ID
app.get("/api/sessions/live", async (req, res) => {
  try {
    const { userId } = req.query;

    const sessions = await Session.find({ isLive: true });

    const result = await Promise.all(
      sessions.map(async (session) => {
        let attended = false;

        if (userId) {
          const record = await Attendance.findOne({
            userId,
            sessionId: session._id
          });
          attended = !!record;
        }

        return {
          _id: session._id,
          title: session.title,
          instructor: session.instructor,
          startTime: session.startTime,
          endTime: session.endTime,
          isLive: session.isLive,
          attended
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("Fetch live sessions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Attendance APIs ----------------

// Mark attendance
app.post("/api/attendance/mark", async (req, res) => {
  try {
    const { userId, sessionId, code } = req.body;

    if (!userId || !sessionId || !code) {
      return res.status(400).json({
        message: "userId, sessionId and code are required"
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.isLive) {
      return res.status(400).json({ message: "Session is not live" });
    }

    if (!session.codeActive) {
      return res.status(403).json({ message: "Attendance code is inactive" });
    }

    if (session.attendanceCode !== code) {
      return res.status(401).json({ message: "Invalid attendance code" });
    }

    const existing = await Attendance.findOne({ userId, sessionId });
    if (existing) {
      return res.status(409).json({ message: "Attendance already marked" });
    }

    await Attendance.create({ userId, sessionId });

    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get attendance of a user
app.get("/api/attendance/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const records = await Attendance.find({ userId })
      .populate("sessionId");

    res.json(records);
  } catch (err) {
    console.error("Fetch attendance error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Start Server ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
