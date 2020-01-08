import { calendar_v3 } from "googleapis";
import { oauth2Client } from "../../services/auth/google";

export const calendar = new calendar_v3.Calendar({
  auth: oauth2Client
});
