const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userController = require("../controllers/userController");

// ============================
// 🔐 JWT AUTH MIDDLEWARE
// ============================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
}

// Routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/users", userController.getUsers);
router.put("/users/:id", authenticateToken, userController.updateUser);
router.delete("/users/:id", authenticateToken, userController.deleteUser);

module.exports = router;
