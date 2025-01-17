import {
  AUTH_LIMITER_WINDOW_MS,
  LOGIN_LIMITER_MAX_REQUESTS,
  REGISTER_LIMITER_MAX_REQUESTS,
} from "../constants";
import rateLimit from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

export const loginLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: LOGIN_LIMITER_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again after 15 minutes",
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
});

export const registerLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: REGISTER_LIMITER_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again after 15 minutes",
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
});
