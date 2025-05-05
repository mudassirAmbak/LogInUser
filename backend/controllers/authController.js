import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = email === "admin@gmail.com" ? "admin" : "user";

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users SET ?", {
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};



