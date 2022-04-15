import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: "AIzaSyAHN0dIVAvuiCljptobHV7HRJl5JCivg7Q",
  authDomain: "sistema-chamados-7f279.firebaseapp.com",
  projectId: "sistema-chamados-7f279",
  storageBucket: "sistema-chamados-7f279.appspot.com",
  messagingSenderId: "200738368433",
  appId: "1:200738368433:web:5130ff935c0e5b345b2b90",
  measurementId: "G-0E26RRX6EW"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;