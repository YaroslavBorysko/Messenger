import React, {createContext, useContext, useState} from "react";
import {jwtDecode} from "jwt-decode"

const AuthContext = createContext({
    auth: null,
    user: null
})

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {

    const existingToken = localStorage.getItem("jwt_session")

    const [currentUser, setCurrentUser] = useState(
        !!existingToken ? (
            jwtDecode(existingToken)
        ) : null
    )
    const [isLogin, setIsLogin] = useState(!!existingToken)

    async function logIn(accessToken) {
        localStorage.setItem("jwt_session", accessToken)
        setCurrentUser(jwtDecode(accessToken))
        setIsLogin(true)
    }

    function logOut() {
        localStorage.removeItem("jwt_session")
        setCurrentUser({})
        setIsLogin(false)
    }

    const value = {
        currentUser, logIn, logOut, isLogin
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}
