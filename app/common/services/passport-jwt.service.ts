import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import createError from "http-errors";
import * as adminService from "../../api/admin/admin.service";
import * as userService from "../../api/user/user.service";
import { type Request } from "express";
import { type IAdmin } from "../../api/admin/admin.dto";
import { type IUser } from "../../api/user/user.dto";
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');


const isValidPassword = async function (value: string, password: string) {
  const compare = await bcrypt.compare(value, password);
  return compare;
};

const secret = speakeasy.generateSecret({ length: 20 });

export const initPassport = (): void => {
  passport.use(
    new Strategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (token: { user: Request["user"] }, done) => {
        try {
          done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // admin login
  passport.use(
    "admin-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const admin = await adminService.getAdminByEmail(email);
          if (admin == null) {
            done(createError(401, "Admin not found!"), false);
            return;
          }

          

          // if (user.blocked) {
          //   done(createError(401, "User is blocked, Contact to admin"), false);
          //   return;
          // }

          const validate = await isValidPassword(password, admin.password);
          if (!validate) {
            done(createError(401, "Invalid email or password"), false);
            return;
          }
          const { password: _p, ...result } = admin;
          done(null, result, { message: "Logged in Successfully" });
        } catch (error: any) {
          done(createError(500, error.message));
        }
      }
    )
  );
  // user login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const user = await userService.getUserByEmail(email);
          if (user == null) {
            done(createError(401, "User not found!"), false);
            return;
          }

          if (!user.active) {
            done(createError(401, "User is inactive, Contact to Admin"), false);
            return;
          }

          // if (user.blocked) {
          //   done(createError(401, "User is blocked, Contact to admin"), false);
          //   return;
          // }
          if(!user.password){
            done(createError(401, "Create Password before login"), false);
            return;
          }

          // Two Factor Authentication
          if(user.factorAuthenticate){
            if(!req.body.code){
              const qr = await generateQR();
              done(null, qr, {message: "qrCode"});
              
            return;
            }
            else{
              const userToken = req.body.code; // OTP entered by the user
              console.log(userToken);
              const verified = speakeasy.totp.verify({
                secret: secret.base32,
                encoding: 'base32',
                token: userToken,
                //window: 1, // Allow a time window of 1 unit (default is 0)
              });

              if (!verified) {
                console.log("verify token "+verified)
                done(createError(401, "Invalid code"), false);
                return;
              }
            }
          }


          const validate = await isValidPassword(password, user.password);
          console.log(validate)
          if (!validate) {
            done(createError(401, "Invalid email or password"), false);
            return;
          }
          const { password: _p, ...result } = user;
          done(null, result, { message: "Logged in Successfully" });
        } catch (error: any) {
          done(createError(500, error.message));
        }
      }
    )
  );
};

export const createUserTokens = (user: Omit<IUser | IAdmin, "password">) => {
  const jwtSecret = process.env.JWT_SECRET ?? "";
  const token = jwt.sign(user, jwtSecret,{expiresIn: '1d'});
  const refToken = jwt.sign(user, jwtSecret,{expiresIn: '5d'});
  return { accessToken: token, refreshToken: refToken };
};

export const generateQR = () =>{
  return qrcode.toDataURL(secret.otpauth_url);
}

export const decodeToken = (token: string) => {
  // const jwtSecret = process.env.JWT_SECRET ?? "";
  const decode = jwt.decode(token);
  return decode as IUser | IAdmin;
};
