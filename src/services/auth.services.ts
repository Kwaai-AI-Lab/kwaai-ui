import {
    startAuthentication,
    startRegistration,
  } from "@simplewebauthn/browser";
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';

const API_URL = process.env.REACT_APP_API_URL;

function decodeBase64URL(input: string): Uint8Array {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "===".slice(0, 4 - (base64.length % 4));
  return Uint8Array.from(atob(base64 + pad), (c) => c.charCodeAt(0));
}


export const login = async (email: string) => {
    try {
      const response = await fetch(
        `${API_URL}/auth/webauthn/login-options`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
          credentials: "include",
        }
      );
  
      if (response.status !== 200) {
        throw new Error("Failed to generate Login options");
      }
  
      const res = await response.json();
      
      const parsedOptions: PublicKeyCredentialCreationOptionsJSON =
        typeof res.options === "string"
          ? JSON.parse(res.options)
          : res.options;
      
      const startAuthenticationOpts = {
        optionsJSON: parsedOptions, // Pass parsed options in the required key
      };
      
      const authResp = await startAuthentication(startAuthenticationOpts);
      

      const verifyResponse = await fetch(
        `${API_URL}/auth/webauthn/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            auth_resp: authResp,
            challenge: parsedOptions.challenge,
          }),
        }
      );
  
      if (verifyResponse.status !== 200) {
        throw new Error("Failed to register user.");
      }
      return await verifyResponse.json()
    } catch (error) {
      throw new Error("Failed to register user");
    }
  };

  export const register = async (email: string) => {
    try {
      const response = await fetch(
        `${API_URL}/auth/webauthn/register-options`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
          credentials: "include",
        }
      );
  
      if (response.status === 409) {
        throw new Error("User already exists");
      }
  
      if (response.status !== 200) {
        throw new Error("Failed to generate registration options");
      }
  
      const optionsJSON = await response.json();
  
      // Ensure optionsJSON contains the correct structure
      const parsedOptions: PublicKeyCredentialCreationOptionsJSON =
        typeof optionsJSON.options === "string"
          ? JSON.parse(optionsJSON.options)
          : optionsJSON.options;

      // Wrap parsedOptions in the expected structure for startRegistration
      const startRegistrationOpts = {
        optionsJSON: parsedOptions, // Pass parsed options in the required key
      };
  
      const attResp = await startRegistration(startRegistrationOpts);
  
      const verifyResponse = await fetch(
        `${API_URL}/auth/webauthn/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            att_resp: attResp,
            challenge: parsedOptions.challenge,
            user_id: parsedOptions.user.id,
          })
        }
      );
  
      if (verifyResponse.status !== 200) {
        throw new Error("Failed to register user.");
      }
  
      return await verifyResponse.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration error:", error.message);
        throw error;
      }
      throw new Error("Failed to register user");
    }
  };
  
  

  export const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };