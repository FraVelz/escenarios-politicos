/** Firebase client — solo lectura; escritura denegada por rules (Admin SDK en /api/ingest). */
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Config pública del SDK web. Preferir env en Vercel; fallbacks del proyecto
 * (las API keys web no son secretas — las rules bloquean writes).
 * No lanzar en import: rompe `next build` / prerender si faltan env.
 */
function publicFirebaseConfig() {
  return {
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      "AIzaSyC1Xf7w4ZRGaw_LuiHQC3UY8OREK-McejY",
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      "escenarios-politicos-co.firebaseapp.com",
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      "escenarios-politicos-co",
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      "escenarios-politicos-co.firebasestorage.app",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      "774079660369",
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
      "1:774079660369:web:c49c61892801bd12ec1370",
  };
}

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  const existing = getApps()[0];
  if (existing) {
    app = existing;
    return app;
  }
  app = initializeApp(publicFirebaseConfig());
  return app;
}

export function getDb(): Firestore {
  if (db) return db;
  db = getFirestore(getFirebaseApp());
  return db;
}
