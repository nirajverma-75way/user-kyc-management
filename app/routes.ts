import express from "express";
import userRoutes from "./api/user/user.route";
import adminRoutes from "./api/admin/admin.route";

// routes
const router = express.Router();

router.use("/users", userRoutes);
router.use("/admin", adminRoutes);

export default router;