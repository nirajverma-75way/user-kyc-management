import express from "express";
import userRoutes from "./api/user/user.route";
import adminRoutes from "./api/admin/admin.route";
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger-output.json");

// routes
const router = express.Router();

router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;