import { MailtrapClient } from "mailtrap";

export const mailtrap = new MailtrapClient({
  token: process.env.MAIL_TRAP_TOKEN,
});
