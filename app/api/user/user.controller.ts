
import * as userService from "./user.service";
import { createResponse } from "../../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express';
import jwt from "jsonwebtoken";
import { resetPasswordEmailTemplate, sendEmail } from "../../common/services/email.service";
import bcrypt from 'bcrypt';

const invitations: Record<string, { token: string; expires: Date }> = {};

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body);
    //CREATE TOKEN
    const jwtSecret = process.env.JWT_SECRET ?? "";
    const token = await jwt.sign(req.body, jwtSecret, { expiresIn: '1d' });
    const mailStatus = await sendEmail({
        from: process.env.MAIL_EMAIL,
        to: req.body.email,
        subject: "Invitation for create Password | KYC Verification",
        text: "Change the password",
        html: resetPasswordEmailTemplate(token),
    });
    res.send(createResponse({mailStatus, result, token}, "User created sucssefully"))
});

export const setPassword = asyncHandler(async (req: Request, res: Response) => {
    const decodedUser = jwt.verify(req.params.token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 12);
    }
    const result = await userService.updateUserByEmail(decodedUser.email, req.body);
    res.send(createResponse(result, "Password updated sucssefully"))
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.updateUser(req.params.id, req.body);
    res.send(createResponse(result, "User updated sucssefully"))
});

export const editUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.editUser(req.params.id, req.body);
    res.send(createResponse(result, "User updated sucssefully"))
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.deleteUser(req.params.id);
    res.send(createResponse(result, "User deleted sucssefully"))
});


export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getUserById(req.params.id);
    res.send(createResponse(result))
});


export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getAllUser();
    res.send(createResponse(result))
});
