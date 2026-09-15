import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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
const snapshot = await getDocs(collection(db, "media"));
snapshot.forEach(doc => console.log(doc.id, doc.data()));
