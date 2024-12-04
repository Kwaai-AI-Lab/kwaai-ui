import { jwtDecode } from "jwt-decode";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../services/auth.services";

export const getAuthToken = (): string => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found in localStorage");
  }

  const decoded: { sub: string } = jwtDecode(token);
  localStorage.setItem("userId", decoded.sub);

  return token;
};


export const getUserEmail = (): string | null  => {
  const email = localStorage.getItem("userEmail");
  return email;

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
      localStorage.setItem("userEmail", email);
      localStorage.setItem("token", response.token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      return Promise.reject();
    }
  } catch (e) {
    return Promise.reject(e);
  }
};

export const logout = async (): Promise<void> => {
  await apiLogout();
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
};

export const checkError = ({ status }: { status: number }): Promise<void> => {
  if (status === 401 || status === 403) {
    logout();
    localStorage.removeItem("token");
    return Promise.reject();
  }
  return Promise.resolve();
};

export const checkAuth = (): boolean => {
  console.log("Checking auth");
  const token = localStorage.getItem("token");
  console.log("token", token);
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
