const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require('path');
const employeeRoutes = require('./routes/employeeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const authRoutes = require('./routes/authRoutes');
const hrRoutes = require('./routes/hrRoutes');
const adminRoutes = require('./routes/adminRoutes');
dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*', 
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
