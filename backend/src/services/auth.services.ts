import User from "../models/user.model.js";
import type { registerType } from "../types/register.type.js";
import type { loginType } from "../types/login.type.js";
import ApiError from "../utils/error.js";
import { env } from "../config/env.js";
import { generateToken } from "../utils/jwt.js";
import { verifyToken } from "../utils/jwt.js";


export const registerService = async (registerData: registerType) => {

  const { fullName, email, password } = registerData;

  if (!fullName || !email || !password) {
    throw ApiError.badRequest("All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.badRequest("User already exists");
  }

  const user = await User.create({ fullName, email, password });

  if (!user) {
    throw ApiError.badRequest("Failed to create user");
  }

  const accessToken = generateToken(
    { userId: user._id },
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRES_IN
  );

  const refreshToken = generateToken(
    { userId: user._id },
    env.REFRESH_TOKEN_SECRET,
    env.REFRESH_TOKEN_EXPIRES_IN
  );

   user.refreshToken = refreshToken;

   await user.save();

   const savedUser = user.toObject();

   const {
  password: _password,
  refreshToken: _refreshToken,
  ...safeUser
} = savedUser;

  return {
  user: safeUser,
  accessToken,
  refreshToken,
  };
};


export const loginService = async (loginData: loginType) => {
    const { email, password } = loginData;
   
     if(!email || !password) {
        throw ApiError.badRequest("All fields are required");
     }

        const user = await User.findOne({ email}).select("+password");

        if (!user) {
        throw ApiError.badRequest("Invalid credentials");
        }

         const isPasswordValid = await user.comparePassword(password);
         if (!isPasswordValid) {
         throw ApiError.badRequest("Invalid credentials");
         }
         
       
const accessToken = generateToken(
    { userId: user._id },
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRES_IN
  );

  const refreshToken = generateToken(
    { userId: user._id },
    env.REFRESH_TOKEN_SECRET,
    env.REFRESH_TOKEN_EXPIRES_IN
  );

   user.refreshToken = refreshToken;

   await user.save();

   const savedUser = user.toObject();

   const {
  password: _password,
  refreshToken: _refreshToken,
  ...safeUser
} = savedUser;

  return {
  user: safeUser,
  accessToken,
  refreshToken,
  };




}

export const refreshTokenService = async (incomingRefreshToken: string) => {
  const decoded = verifyToken(
    incomingRefreshToken, 
    env.REFRESH_TOKEN_SECRET
  ) as { userId: string } | null;

  if (!decoded) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const user = await User.findById(decoded.userId).select("+refreshToken");

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const accessToken = generateToken(
    { userId: user._id },
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRES_IN
  );

  const newRefreshToken = generateToken(
    { userId: user._id },
    env.REFRESH_TOKEN_SECRET,
    env.REFRESH_TOKEN_EXPIRES_IN
  );

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};