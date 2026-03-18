export const ADMIN_APP_ORIGIN = "http://localhost:5174";

export function getAdminAppUrl(path = "/admin/login") {
  return `${ADMIN_APP_ORIGIN}${path}`;
}
