import * as userService from "./user.service";
import { createResponse } from "../../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  resetPasswordEmailTemplate,
  sendEmail,
} from "../../common/services/email.service";
import bcrypt from "bcrypt";
import passport from "passport";
import {
  createUserTokens,
  decodeToken,
} from "../../common/services/passport-jwt.service";

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  passport.authenticate(
    "login",
    async (err: Error | null, user: any | undefined, info: any) => {
      if (err || !user) {
        return res.status(401).json({
          message: info?.message || "Authentication failed",
        });
      }
      if (info.message === "qrCode") {
        res.send(createResponse({ qr_code: user }, "Scan the QR Code"));
      } else {
        const { accessToken, refreshToken } = createUserTokens(user);
        const tokenUpdate = await userService.editUser(user._id, {
          accessToken,
          refToken: refreshToken,
        });
        res.send(
          createResponse(
            { accessToken, refreshToken, user },
            "Login successful"
          )
        );
      }
    }
  )(req, res);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  //CREATE TOKEN
  const jwtSecret = process.env.JWT_SECRET ?? "";
  const token = await jwt.sign(req.body, jwtSecret, { expiresIn: "1d" });
  const mailStatus = await sendEmail({
    from: process.env.MAIL_EMAIL,
    to: req.body.email,
    subject: "Invitation for create Password | KYC Verification",
    text: "Change the password",
    html: resetPasswordEmailTemplate(token),
  });
  res.send(
    createResponse({ mailStatus, result, token }, "User created sucssefully")
  );
});

export const setPassword = asyncHandler(async (req: Request, res: Response) => {
  const decodedUser = jwt.verify(
    req.params.token,
    process.env.JWT_SECRET!
  ) as jwt.JwtPayload;
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 12);
  }
  const result = await userService.updateUserByEmail(
    decodedUser.email,
    req.body
  );
  res.send(createResponse(result, "Password updated sucssefully"));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated sucssefully"));
});

export const editUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.editUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated sucssefully"));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  res.send(createResponse(result, "User deleted sucssefully"));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  res.send(createResponse(result));
});

export const getPendingUser = asyncHandler(
  async (req: Request, res: Response) => {
    let filter = {};
    if (req.params.type == "onboarding") {
      filter = { qualification: { $exists: false } };
    }
    if (req.params.type == "kyc") {
      filter = { kycDocument: { $exists: false } };
    }
    const result = await userService.getPendingUser(filter);
    res.send(createResponse({ total: result.length, user: result }));
  }
);

export const sendMailPendingUser = asyncHandler(
  async (req: Request, res: Response) => {
    const filter = {
      $and: [
        { qualification: { $exists: false } }, // qualification does not exist
        { verification: { $exists: false } }, // verification does not exist
      ],
    };
    const result = await userService.getPendingUser(filter);
    const mailSent = await Promise.all([
      result.map((data) => {
        return sendEmail({
          from: process.env.MAIL_EMAIL,
          to: data.email,
          subject: "Pending | KYC Verification",
          text: "Complete the kyc documentation and onboardingd",
          html: `<h3>Please Complete Your KYC Documentation and Onboarding Process</h3>`,
        });
      }),
    ]);

    res.send(createResponse(mailSent));
  }
);

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  let result;
  if (req.query.startDate && req.query.endDate) {
    const start = new Date(req.query.startDate as string);
    const end = new Date(req.query.endDate as string);
    result = await userService.getUseByDateFilterr(start, end);
  } else {
    result = await userService.getAllUser();
  }

  res.send(createResponse({ total: result.length, user: result }));
});

export const getAllActiveUser = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await userService.getAllActiveUser();
    //Extract Active User
    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const activeSessions: any[] = [];
    let total = 0;
    result.forEach((tokenDoc) => {
      if (tokenDoc.accessToken && tokenDoc.accessToken != "") {
        const decoded = decodeToken(tokenDoc.accessToken) as JwtPayload;
        console.log({ decoded });

        if (decoded.exp && decoded.exp > now) {
          // If the token has not expired, add it to active sessions
          activeSessions.push(tokenDoc);
          total = total + 1;
        }
      }
    });
    res.send(createResponse({ total, user: activeSessions }));
  }
);
