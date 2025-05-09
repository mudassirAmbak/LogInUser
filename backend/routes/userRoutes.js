import express from "express";
import {
  getAllUsers,
  getOwnProfile,
  deleteUser,
  restoreUser,
  updateProfilePic,
  updateUser
} from "../controllers/userController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.get("/me", protect, getOwnProfile);
router.put("/me/profile-pic", protect, updateProfilePic);
router.delete("/:id", protect, adminOnly, deleteUser);
router.put('/restore/:id', protect, adminOnly, restoreUser); 
router.put('/:id', protect, adminOnly, updateUser);

export default router;
