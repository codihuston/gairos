import { calendar_v3, people_v1 } from "googleapis";
import { oauth2Client } from "../../services/auth/google";

export const GoogleCalendar = new calendar_v3.Calendar({
  auth: oauth2Client
});

export const GooglePeople = new people_v1.People({
  auth: oauth2Client
});
