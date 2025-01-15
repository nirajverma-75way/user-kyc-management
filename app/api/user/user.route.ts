
import { Router } from "express";
import { catchError } from "../../common/middleware/cath-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";

const router = Router();

router
        .get("/", userController.getAllUser)
        .get("/active", userController.getAllActiveUser)
        .get("/mail/pending-user", userController.sendMailPendingUser)
        .get("/pending/:type", userController.getPendingUser)
        .get("/:id", userController.getUserById)
        .delete("/:id", userController.deleteUser)
        .post("/", userValidator.createUser, catchError, userController.createUser)
        .post("/login", userValidator.loginUser, catchError, userController.loginUser)
        .patch("/set-password/:token", userValidator.setPassword, catchError, userController.setPassword)
        .put("/:id", userValidator.updateUser, catchError, userController.updateUser)
        .patch("/:id", userValidator.editUser, catchError, userController.editUser)

export default router;

