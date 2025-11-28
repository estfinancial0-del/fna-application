export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Financial Needs Analysis";

export const APP_LOGO = "/est-logo.webp";

// Simple login URL for username/password authentication
export const getLoginUrl = () => {
  return "/login";
};
