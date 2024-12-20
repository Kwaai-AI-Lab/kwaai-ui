import { jwtDecode } from "jwt-decode";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../services/auth.services";

// Constants for localStorage keys
const USER_ID_KEY = "userId";
const TOKEN_KEY = "token";
const USER_EMAIL_KEY = "userEmail";

// Utility class for Auth-related methods
class AuthUtils {
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  }

  static getUserEmail(): string | null {
    return localStorage.getItem(USER_EMAIL_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static setUserId(userId: string): void {
    localStorage.setItem(USER_ID_KEY, userId);
  }

  static setUserEmail(email: string): void {
    localStorage.setItem(USER_EMAIL_KEY, email);
  }

  static removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  static removeUserId(): void {
    localStorage.removeItem(USER_ID_KEY);
  }

  static removeUserEmail(): void {
    localStorage.removeItem(USER_EMAIL_KEY);
  }
}

export const getAuthToken = (): string => {
  const token = AuthUtils.getToken();

  if (!token) {
    throw new Error("No token found in localStorage");
  }

  const decoded: { sub: string } = jwtDecode(token);
  AuthUtils.setUserId(decoded.sub);

  return token;
};

export const getUserEmail = (): string | null => {
  return AuthUtils.getUserEmail();
};

export const login = async (email: string, isRegistering: boolean): Promise<void> => {
  let response;
  try {
    if (isRegistering) {
      response = await apiRegister(email);
    } else {
      response = await apiLogin(email);
    }
    if (response) {
      AuthUtils.setUserEmail(email);
      AuthUtils.setToken(response.token);
    } else {
      AuthUtils.removeToken();
      AuthUtils.removeUserEmail();
      return Promise.reject();
    }
  } catch (e) {
    return Promise.reject(e);
  }
};

export const logout = async (): Promise<void> => {
  await apiLogout();
  AuthUtils.removeToken();
  AuthUtils.removeUserEmail();
  AuthUtils.removeUserId();
};

export const checkError = ({ status }: { status: number }): Promise<void> => {
  if (status === 401 || status === 403) {
    logout();
    AuthUtils.removeToken();
    return Promise.reject();
  }
  return Promise.resolve();
};

export const checkAuth = (): boolean => {
  const token = AuthUtils.getToken();
  if (!token) return false;

  try {
    const decodedToken: { exp?: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if exp exists and is greater than the current time
    return decodedToken.exp !== undefined && decodedToken.exp > currentTime;
  } catch (error) {
    // If the token is invalid, return false
    return false;
  }
};

export const getPermissions = (): Promise<void> => Promise.resolve();

export default AuthUtils;
