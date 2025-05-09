import db from "../config/db.js";

export const getAllUsers = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, name, email, role, status FROM users"
    );
    res.json(results);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

export const getOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [results] = await db.query(
      "SELECT id, name, email, role, picture FROM users WHERE id = ?",
      [userId]
    );
    res.json(results[0]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await db.query("UPDATE users SET status = 0 WHERE id = ?", [req.params.id]);
    res.json({ message: "User deactivated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deactivating user", error: err.message });
  }
};

export const restoreUser = async (req, res) => {
  try {
    await db.query("UPDATE users SET status = 1 WHERE id = ?", [req.params.id]);
    res.json({ message: "User restored successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error restoring user", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const { id } = req.params;
    await db.query(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id]
    );
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: err.message });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;
    const { imageUrl } = req.body;

    if (!imageUrl) return res.status(400).json({ message: "Image URL is required" });

    await db.execute("UPDATE users SET picture = ? WHERE id = ?", [imageUrl, userId]);

    res.json({ message: "Profile picture updated successfully", imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
