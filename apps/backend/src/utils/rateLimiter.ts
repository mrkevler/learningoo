const submissions: Record<string, number> = {};

export const canSubmit = (ip: string) => {
  const now = Date.now();
  const last = submissions[ip] || 0;
  if (now - last < 10000) {
    return { allowed: false, wait: 10000 - (now - last) };
  }
  submissions[ip] = now;
  return { allowed: true };
};
