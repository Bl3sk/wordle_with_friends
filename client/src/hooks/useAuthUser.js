import { useState, useEffect } from 'react'
import { axiosInstance } from '../config/config'
import jwtDecode  from 'jwt-decode'

function useAuthContext() {
    const [loggedUser, setLoggedUser] = useState("")
    console.log({loggedUser})

    // získání přihlášeného uživatele z local storage
    useEffect(() => {
        const userFromStorage = JSON.parse(localStorage.getItem("user"))
        console.log({userFromStorage})
        if (userFromStorage) {
          try {
            const decoded = jwtDecode(userFromStorage.jwt_token);
            const currentTime = Date.now() / 1000; // převedení na vteřiny
            if (decoded.exp > currentTime) {
              axiosInstance({
                url: `users/getUserData/?userId=${userFromStorage._id}`,
                method: "GET"
            })
              .then((res) => {
                  const data = res.data
                  console.log("Získana data: ", data)
                  if(!res.data) {
                      console.log("Nedostali jsme žádná data.")
                      return
                  } else {
                    data.jwt_token = userFromStorage.jwt_token
                    setLoggedUser(data);
                  }
              })
              .catch(err => {
                  console.log("Během získávání uživatele se něco pokazilo.", err)
              })
            }
          } catch (error) {
            console.error('Chyba JWT tokenu', error);
          }
        }
      }, [])

    // aktualizace přihlášeného uživatele z local storage
    useEffect(() => { 
        if (!loggedUser) return
        console.log("TESSSSSSSSSTT v EEEFFECT,", loggedUser)
        let user = {
          _id: loggedUser._id,
          nickname: loggedUser.nickname,
          jwt_token: loggedUser.jwt_token
        }
        user = JSON.stringify(user)
        console.log("USEEEEEEEEEER",loggedUser)
        if (user) localStorage.setItem("user", user)
    }, [loggedUser])
    
    function updateLoggedUser() {
      axiosInstance({
          url: `users/getUserData/?userId=${loggedUser._id}`,
          method: "GET"
      })
      .then((data) => {
          console.log("Získana data: ", data)
          if(!data.data) {
              console.log("Nedostali jsme žádná data.")
              return
          } else {
            const avatar = data.data.avatar
            const user = data.data
            user.avatar = avatar
            user.jwt_token = loggedUser.jwt_token
            setLoggedUser({user, avatar})
          }
      })
      .catch(err => {
          console.log("Během získávání uživatele se něco pokazilo.", err)
      })
  }
  
    function handleLogout() {
      localStorage.removeItem("user");
      //localStorage.removeItem("avatar");
      setLoggedUser("")
    }
  return (
    { loggedUser, setLoggedUser, updateLoggedUser, handleLogout }
  )
}

export default useAuthContext