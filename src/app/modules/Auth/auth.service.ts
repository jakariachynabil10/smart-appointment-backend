
import prisma from "../../../shared/prisma";
import { ILoginUser } from "./auth.interface";
import httpStatus from "http-status";
import { AuthUtils } from "./auth.utils";
import { jwtHelpers } from "../../../helpers/jwtHelper";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  // ✅ Use findUnique instead of findMany
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // ✅ Compare hashed password
  const isPasswordMatch = await AuthUtils.comparePasswords(
    password,
    isUserExist.password
  );

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  // ✅ Create tokens
  const accessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      email: isUserExist.email,
    },
    config.jwt.secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  // ✅ Remove password from returned user
  const { password: _, ...userWithoutPassword } = isUserExist;

  return {
    ...userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const authServices = {
  loginUser,
};
