import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDB } from "../config/db.js";

let auth;

export function getAuth() {
  if (!auth) {
    auth = betterAuth({
      database: mongodbAdapter(getDB()),
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.BETTER_AUTH_URL,
      basePath: "/api/auth",
      trustedOrigins: [
        "http://localhost:3000",
        "https://sportnest-client-sigma.vercel.app"
      ],
      
      session: {
        strategy: "jwt", 
        expiresIn: 60 * 60 * 24 * 7, 
      },
      
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          disableDefaultState: true, 
        },
      },
      advanced: {
        useSecureCookies: true,
        cookies: {
          session_token: {
            name: "better-auth.session_token",
            attributes: {
              sameSite: "none", 
              secure: true, 
              httpOnly: true,   
            }
          }
        }
      },
      emailAndPassword: { 
        enabled: true,
        minPasswordLength: 6
      },
    });
  }
  return auth;
}