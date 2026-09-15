import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBJzH207mmnsyZtvPBMubF7ZJsVwGRaIo0",
  authDomain: "gen-lang-client-0446894856.firebaseapp.com",
  projectId: "gen-lang-client-0446894856",
  storageBucket: "gen-lang-client-0446894856.firebasestorage.app",
  messagingSenderId: "562438917098",
  appId: "1:562438917098:web:3bd45fa4f710ca887e8093"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const testRef = ref(storage, 'test.txt');
try {
  await uploadString(testRef, 'hello world');
  console.log("Success:", await getDownloadURL(testRef));
} catch(e) {
  console.error("Error:", e);
}
