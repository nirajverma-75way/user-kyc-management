
import * as AdminService from "./admin.service";
import { createResponse } from "../../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express'
import passport from "passport";
import { createUserTokens } from "../../common/services/passport-jwt.service";

export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
    passport.authenticate(
        "admin-login",
        async (err: Error | null, user: any | undefined, info: any) => {
          if (err || !user) {
            return res.status(401).json({
              message: info?.message || "Authentication failed",
            });
          }
    
          const { accessToken, refreshToken } = createUserTokens(user);
    
          res.send(
            createResponse({ accessToken, refreshToken, user }, "Login successful")
          );
        }
      )(req, res);
});

export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.createAdmin(req.body);
    res.send(createResponse(result, "Admin created sucssefully"))
});

export const updateAdmin = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.updateAdmin(req.params.id, req.body);
    res.send(createResponse(result, "Admin updated sucssefully"))
});

export const editAdmin = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.editAdmin(req.params.id, req.body);
    res.send(createResponse(result, "Admin updated sucssefully"))
});

export const deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.deleteAdmin(req.params.id);
    res.send(createResponse(result, "Admin deleted sucssefully"))
});


export const getAdminById = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.getAdminById(req.params.id);
    res.send(createResponse(result))
});


export const getAllAdmin = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.getAllAdmin();
    res.send(createResponse(result))
});
