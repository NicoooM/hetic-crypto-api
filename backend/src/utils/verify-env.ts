import { REQUIRED_ENV_VARS } from "../constants";

export function verifyEnv() {
  const missingVars = REQUIRED_ENV_VARS.filter(
    (envVar) => !process.env[envVar] || process.env[envVar].trim() === ""
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing or empty required environment variables: ${missingVars.join(
        ", "
      )}`
    );
  }
}
