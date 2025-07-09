import { Request, Response } from "express";
import { generateCaptcha, verifyCaptcha } from "../utils/captcha";
import { canSubmit } from "../utils/rateLimiter";
import { sendContactEmail } from "../utils/email";
import { body, validationResult } from "express-validator";

export const getCaptcha = (_req: Request, res: Response) => {
  const { question, token } = generateCaptcha();
  res.json({ question, token });
};

export const validateContact = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("message").notEmpty().withMessage("Message is required"),
  body("answer").isNumeric().withMessage("Answer must be a number"),
  body("token").notEmpty(),
  body("gdpr").equals("true").withMessage("GDPR consent required"),
];

export const postContact = async (req: Request, res: Response) => {
  // Honeypot
  if (req.body.website) {
    return res.status(400).json({ error: "Spam detected" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  const { allowed, wait } = canSubmit(req.ip);
  if (!allowed) return res.status(429).json({ error: "Please wait", wait });

  const { answer, token, name, email, prefix, phone, message } =
    req.body as Record<string, string>;
  const tokenStr: string = String(token);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isValid = verifyCaptcha(tokenStr, Number(answer ?? "0"));
  if (!isValid) return res.status(400).json({ error: "Captcha failed" });

  try {
    await sendContactEmail({
      name: name || "",
      email: email || "",
      phone: prefix ? `${prefix} ${phone}` : phone,
      message: message || "",
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error("Email send error", e);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
