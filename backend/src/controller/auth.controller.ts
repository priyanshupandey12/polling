import type {Request,Response} from 'express'
import { registerService,loginService ,refreshTokenService} from "../services/auth.services.js";
import ApiError from "../utils/error.js";
import User from '../models/user.model.js';

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: false,
sameSite: "lax" as const,
  maxAge,
});

export const register = async (req: Request, res: Response) => {
     const { fullName, email, password } = req.body;
      
      const user=await registerService({fullName,email,password})


      res.cookie("accessToken", user.accessToken, cookieOptions(15 * 60 * 1000));          
  res.cookie("refreshToken", user.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000)); 


      res.status(201).json({
        user: user.user,
        })

}


export const login = async (req: Request, res: Response) => {
      const { email, password } = req.body;

      const user=await loginService({email,password})

        res.cookie("accessToken", user.accessToken, cookieOptions(15 * 60 * 1000));          
  res.cookie("refreshToken", user.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000)); 


        res.status(200).json({
        user: user.user,
 
        })



}


export const logout = async (req: Request, res: Response) => {
       
  const options = cookieOptions(0);


  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
        res.status(200).json({ message: "Logged out successfully" });
}


export const refreshToken = async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw ApiError.unauthorized("No refresh token provided");
  }

  const result = await refreshTokenService(incomingRefreshToken);

 res.cookie("accessToken", result.accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie("refreshToken", result.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

  res.status(200).json({ 
    accessToken: result.accessToken 
  });
};


export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw ApiError.unauthorized("User not authenticated");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.unauthorized("User not found");
  }

  res.status(200).json({ user });
};


