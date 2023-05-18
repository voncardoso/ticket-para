import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const UserContextLogin = createContext();

export const UserStorageLogin = ({ children }) => {
    const [dataUser, setDataUser] = useState("")

    useEffect(() =>{
        async function getUser(){
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    setDataUser(user.uid);
                } else {
                }
            });
        }
        getUser()
    }, [])

    return (
        <UserContextLogin.Provider value={{dataUser}}>
          {children}
        </UserContextLogin.Provider>
      );
}