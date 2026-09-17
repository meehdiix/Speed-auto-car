import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

async function check() {
  const t1 = await getDoc(doc(db, 'cars', 'zkHap3H4dcqkGShRNwV0'));
  console.log("MG5 Automatic Images:", JSON.stringify(t1.data().images, null, 2));
  
  const t2 = await getDoc(doc(db, 'cars', 'jY8LMLOnbnHCyVqeO7as'));
  console.log("MG 5 Manual Images:", JSON.stringify(t2.data().images, null, 2));
}
check().then(() => process.exit(0)).catch(console.error);
