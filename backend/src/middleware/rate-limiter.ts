import {
  AUTH_LIMITER_WINDOW_MS,
  LOGIN_LIMITER_MAX_REQUESTS,
  REGISTER_LIMITER_MAX_REQUESTS,
} from "../constants";
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
import { StatusCodes } from "http-status-codes";
import type { Request } from "express";

const getClientIp = (req: Request): string => {
  const ip = requestIp.getClientIp(req);
  return ip || "";
};

export const loginLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: LOGIN_LIMITER_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again after 15 minutes",
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  keyGenerator: getClientIp,
});

export const registerLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: REGISTER_LIMITER_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again after 15 minutes",
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  keyGenerator: getClientIp,
});
