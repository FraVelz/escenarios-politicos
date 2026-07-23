/** Firebase client — solo lectura; escritura denegada por rules (Admin SDK en /api/ingest). */
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

function requirePublicConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (process.env.VERCEL && (!apiKey || !projectId)) {
    throw new Error(
      "NEXT_PUBLIC_FIREBASE_API_KEY y NEXT_PUBLIC_FIREBASE_PROJECT_ID son obligatorios en Vercel",
    );
  }
  return {
    apiKey: apiKey || "AIzaSyC1Xf7w4ZRGaw_LuiHQC3UY8OREK-McejY",
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      "escenarios-politicos-co.firebaseapp.com",
    projectId: projectId || "escenarios-politicos-co",
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      "escenarios-politicos-co.firebasestorage.app",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "774079660369",
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
      "1:774079660369:web:c49c61892801bd12ec1370",
  };
}

const firebaseConfig = requirePublicConfig();

export function getFirebaseApp() {
  return getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
}

export function getDb() {
  return getFirestore(getFirebaseApp());
}
