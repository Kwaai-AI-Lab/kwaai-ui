import { jwtDecode } from "jwt-decode";

// auth.helper.ts
export const getAuthToken = (): string => {
  const token = "";
  const decoded: { sub: string } = jwtDecode(token);
  localStorage.setItem("userId", decoded.sub);
    return "";
  };
  