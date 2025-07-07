import jwt from "jsonwebtoken";

const CAPTCHA_SECRET =
  process.env.CAPTCHA_SECRET || process.env.JWT_SECRET || "supercaptcha";

export interface CaptchaPayload {
  answer: number;
  iat?: number;
  exp?: number;
}

export const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 100); // 0–99
  const num2 = Math.floor(Math.random() * 9) + 1; // 1–9
  const answer = num1 + num2;
  const token = jwt.sign({ answer } as CaptchaPayload, CAPTCHA_SECRET, {
    expiresIn: "1h",
  });
  return { question: `${num1} + ${num2}`, token };
};

export const verifyCaptcha = (
  token: string | undefined,
  userAnswer: number
) => {
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, CAPTCHA_SECRET) as any;
    return decoded.answer === userAnswer;
  } catch {
    return false;
  }
};
