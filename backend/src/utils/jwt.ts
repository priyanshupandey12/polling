import jwt from "jsonwebtoken";

export const generateToken = (
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(payload, secret, { expiresIn } as any);
};

export const verifyToken = (token: string, secret: string) => {
  try {

    return jwt.verify(token, secret);

  } catch (error) {

    return null;

  }
};


