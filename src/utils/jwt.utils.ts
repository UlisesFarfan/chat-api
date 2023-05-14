import "dotenv/config";

import {
  sign,
  verify,
  VerifyErrors,
  Jwt,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";

import { UserInterface } from "../interfaces/user.interface";

type Payload = {
  client_id: string;
  client_secret: string;
};

const verifyToken = (
  authCode: string
): Jwt | JwtPayload | string | undefined | void | UserInterface => {
  return verify(
    authCode,
    process.env.SECRET_JWT as string,
    (
      error: VerifyErrors | TokenExpiredError | null,
      decoded: Jwt | JwtPayload | string | undefined | any
    ) => {
      if (error) {
        throw error;
      }
      return {
        email: decoded?.email,
      };
    }
  );
};

const generateAccessToken = (payload: any) => {
  let secret = process.env.SECRET_JWT as string;
  let expire = process.env.JWT_EXPIRATION as string;

  const accessToken = sign({ payload }, secret as string, {
    expiresIn: expire,
  });

  return accessToken;
};

const generateRefreshToken = (payload: any) => {
  const refreshToken = sign({ payload }, process.env.SECRET_REFRESH as string, {
    expiresIn: process.env.JWT_EXPIRATION as string,
  });

  return refreshToken;
};

const verifyRefreshToken = (payload: any): any => {
  return verify(
    payload,
    process.env.SECRET_REFRESH as string,
    (
      error: VerifyErrors | null,
      decoded: Jwt | JwtPayload | string | undefined
    ) => {
      if (error) {
        throw error;
      }
      return decoded;
    }
  );
};

export {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
