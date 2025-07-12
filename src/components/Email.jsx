const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Email() {
  const email = "alexei@gmail.com";
  const check = emailRegex.test(email);
  return check ? email : null;
}
