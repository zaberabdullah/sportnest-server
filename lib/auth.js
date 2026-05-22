const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");
const { getDB } = require("../config/db");

let auth;

function getAuth() {
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
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60
        }
      },
      advanced: {
        useSecureCookies: true, 
        crossSubDomainCookies: {
          enabled: true,
        },
        defaultCookieAttributes: {
          sameSite: "none",
          secure: true,     
          partitioned: true,
          httpOnly: true
        }
      },
      emailAndPassword: { 
        enabled: true,
        minPasswordLength: 6
      },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google` // <-- Explicitly add koro
        },
      },
    });
  }
  return auth;
}

module.exports = { getAuth };