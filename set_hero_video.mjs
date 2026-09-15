import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBJzH207mmnsyZtvPBMubF7ZJsVwGRaIo0",
  authDomain: "gen-lang-client-0446894856.firebaseapp.com",
  projectId: "gen-lang-client-0446894856",
  storageBucket: "gen-lang-client-0446894856.firebasestorage.app",
  messagingSenderId: "562438917098",
  appId: "1:562438917098:web:3bd45fa4f710ca887e8093"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-0d4d0a50-18fc-483c-a019-c84f88da188f");
await updateDoc(doc(db, "settings", "general"), {
  heroBackgroundImage: "https://res.cloudinary.com/ypfk2p2e/video/upload/v1789461854/qx4ocqjnahqhzxqsqcz8.mp4"
});
console.log("Updated successfully");
