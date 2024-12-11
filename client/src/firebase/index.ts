// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "certainty-poker.firebaseapp.com",
  projectId: "certainty-poker",
  storageBucket: "certainty-poker.firebasestorage.app",
  messagingSenderId: "39603160000",
  appId: "1:39603160000:web:b60e429273a3f53bb4be25",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create a ReCaptchaEnterpriseProvider instance using your reCAPTCHA Enterprise
// site key and pass it to initializeAppCheck().\
if (import.meta.env.DEV) {
  (
    self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: string }
  ).FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN;
}
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  ),
  isTokenAutoRefreshEnabled: true, // Set to true to allow auto-refresh.
});

export default app;
