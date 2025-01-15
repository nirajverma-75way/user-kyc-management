
import { Router } from "express";
import { catchError } from "../../common/middleware/cath-error.middleware";
import * as AdminController from "./admin.controller";
import * as AdminValidator from "./admin.validation";

const router = Router();

router
        .get("/", AdminController.getAllAdmin)
        .get("/:id", AdminController.getAdminById)
        .delete("/:id", AdminController.deleteAdmin)
        .post("/", AdminValidator.createAdmin, catchError, AdminController.createAdmin)
        .post("/login", AdminValidator.loginAdmin, catchError, AdminController.loginAdmin)
        .put("/:id", AdminValidator.updateAdmin, catchError, AdminController.updateAdmin)
        .patch("/:id", AdminValidator.editAdmin, catchError, AdminController.editAdmin)

export default router;

