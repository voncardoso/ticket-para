import { init } from "next-firebase-auth";

const TWELVE_DAYS_IN_MS = 12 * 60 * 60 * 24 * 1000;

const initAuth = () => {
  init({
    authPageURL: "/auth",
    appPageURL: "/",
    loginAPIEndpoint: "/api/login",
    logoutAPIEndpoint: "/api/logout",
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID as string,
        clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENTE_AMAIL as string,
        privateKey: process.env.NEXT_PUBLIC_FIRABASE_PRIVATE_KEY as string,
      },
      databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    },
    firebaseClientInitConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    },
    cookies: {
      name: "ExampleApp",
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: TWELVE_DAYS_IN_MS,
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === "true",
      signed: true,
    },
  });
};

export default initAuth;
