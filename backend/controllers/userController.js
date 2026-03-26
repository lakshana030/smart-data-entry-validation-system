const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// ============================
// 🔐 REGISTER ROUTE
// ============================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Server-side validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[6-9]\d{9}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!namePattern.test(name)) return res.status(400).json({ message: "Invalid name format" });
    if (!emailPattern.test(email)) return res.status(400).json({ message: "Invalid email format" });
    if (!phonePattern.test(phone)) return res.status(400).json({ message: "Invalid phone format" });
    if (!passwordPattern.test(password)) return res.status(400).json({ message: "Weak password format" });

    // Check if user exists
    const existingUser = await pool.query("SELECT * FROM data_entries WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await pool.query(
      "INSERT INTO data_entries (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone",
      [name, email, phone, hashedPassword]
    );

    // Generate token so the user is instantly logged in after registration
    const userRole = newUser.rows[0];
    const token = jwt.sign({ id: userRole.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "User registered successfully",
      user: userRole,
      token: token
    });

  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// 🔐 LOGIN ROUTE
// ============================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await pool.query("SELECT * FROM data_entries WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token: token,
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// 🔐 GET USERS
// ============================
exports.getUsers = async (req, res) => {
  try {
    const users = await pool.query("SELECT id, name, email, phone FROM data_entries");
    res.json(users.rows);
  } catch (err) {
    console.error("Fetch Users Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// ✏️ UPDATE USER
// ============================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    const updatedUser = await pool.query(
      "UPDATE data_entries SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING id, name, email, phone",
      [name, email, phone, id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser.rows[0],
    });

  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// ❌ DELETE USER
// ============================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await pool.query("DELETE FROM data_entries WHERE id=$1 RETURNING id", [id]);

    if (deletedUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
