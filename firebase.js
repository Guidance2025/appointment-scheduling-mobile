import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBQf6iL2HnonBiO6TpEMOPY6JLxOBVp8aw",
  authDomain: "appointment-notification-cc54d.firebaseapp.com",
 storageBucket: "appointment-notification-cc54d.appspot.com",
messagingSenderId: "106572713774",
projectId: "appointment-notification-cc54d",
  appId: "1:106572713774:android:d5c37c9f8da487e5bf74bf",
};

const app = initializeApp(firebaseConfig);

let messaging;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.log('Messaging not available in this environment');
}

export { messaging };
export default app;