import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBJzH207mmnsyZtvPBMubF7ZJsVwGRaIo0",
  authDomain: "gen-lang-client-0446894856.firebaseapp.com",
  projectId: "gen-lang-client-0446894856"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

createUserWithEmailAndPassword(auth, 'mehdi@admin.com', 'mehdi4008')
  .then(() => {
    console.log("User created successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error.code, error.message);
    process.exit(1);
  });
