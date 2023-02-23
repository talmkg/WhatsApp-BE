import createError from "http-errors";
import { verifyAccesstoken } from "./jwtTokens.js";

export const isSignedIn = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createError(401, "Bearer token required"));
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    const userPayload = await verifyAccesstoken(token);
    if (userPayload) {
      req.user = {
        _id: userPayload._id,
        username: userPayload.username,
      };
    }

    next();
  } catch (error) {
    next(createError(401, "Invalid access token provided"));
  }
};
