import {useEffect, useState, createContext } from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';
export const AuthContext = createContext({});

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loadingAuth, setloadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      function loadStorage() {
        const storageUser = localStorage.getItem("SistemaUsers");

        if (storageUser) {
          setUser(JSON.parse(storageUser));
          setloadingAuth(false);
        }
        setLoading(false);
      }

      loadStorage();
    }, []);

    async function signIn(email, password) {
      setloadingAuth(true);

      await firebase.auth().signInWithEmailAndPassword(email, password)
        .then( async (value) => {
          let uid = value.user.uid;

          const userProfile = await firebase.firestore().collection('users')
      .doc(uid).get();

      let data = {
        uid: uid,
        nome: userProfile.data().nome,
        avatarUrl: userProfile.data().avatarUrl,
        email: value.user.email,
        tipo: userProfile.data().
tipo,
      };

          setUser(data);
          storageUser(data);
          setloadingAuth(false);
          toast.success('Bem vindo de volta!')

        })

        .catch((error) => {
          setloadingAuth(false);
          console.log(error)
          toast.error('Ops! Algo deu errado, verifique seus dados!')
        });

    }

    async function signUp(email, password, nome, tipo){
      setloadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async (value) => {
           let uid = value.user.uid;
           await firebase.firestore().collection("users")
           .doc(uid).set({
              nome: nome,
              email: email,
              avatarUrl: null,
              tipo: tipo,
           })
            .then(() => {
              let data = {
                uid: uid,
                nome: nome,
                email: value.user.email,
                avatarUrl: null,
                tipo: tipo,
              }

              setUser(data);
              storageUser(data);
              setloadingAuth(false);
              toast.success('Bem vindo!')
              })
        })
        .catch((error) => {
          setloadingAuth(false);
          alert(error.message);
          setloadingAuth(false);
          toast.error('ops! algo deu errado')
        });
    }

    function storageUser(data) {
      localStorage.setItem("SistemaUsers", JSON.stringify(data));
    }

    async function signOut() {
      await firebase.auth().signOut()
        localStorage.removeItem("SistemaUsers");
        setUser(null);
        toast.success('Tudo certo você esta fora, Até logo!')
    }


  return(
    <AuthContext.Provider 
    value={{signed: !!user, user, loading, signUp, signOut, signIn, loadingAuth, setUser, storageUser}}>
        {children}
    </AuthContext.Provider>
  )
}


export default AuthProvider;