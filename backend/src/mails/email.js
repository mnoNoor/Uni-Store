import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrap } from "./mailTrap.js";

export const sendVerifyEmail = async (email, verifyToken) => {
  try {
    mailtrap.send({
      from: { name: "Mailtrap Test", email: "sender@example.com" },
      to: [{ email: email }],
      subject: "Hello from Mailtrap Node.js",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "verificationCode",
        verifyToken,
      ),
    });
  } catch (error) {
    console.error("Error sending an email: ", error);
    throw new Error(`Error sending an email: ${error}`);
  }
};
