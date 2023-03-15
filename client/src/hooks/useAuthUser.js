import { useState, useEffect } from 'react'
import { axiosInstance } from '../config/config'
import jwtDecode  from 'jwt-decode'

function useAuthContext() {
    const [loggedUser, setLoggedUser] = useState("")
    console.log(loggedUser)

    // získání přihlášeného uživatele z local storage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user) {
          try {
            const decoded = jwtDecode(user.jwt_token);
            const currentTime = Date.now() / 1000; // převedení na vteřiny
            if (decoded.exp > currentTime) {
              setLoggedUser(user);
            }
          } catch (error) {
            console.error('Chyba JWT tokenu', error);
          }
        }
       
      }, [])

    // aktualizace přihlášeného uživatele z local storage
    useEffect(() => { 
        const user = JSON.stringify(loggedUser)
        if (user) localStorage.setItem("user", user)
    }, [loggedUser])
    
    function updateLoggedUser() {
      axiosInstance({
          url: `users?userId=${loggedUser.id}`,
          method: "GET"
      })
      .then((data) => {
          console.log("Získana data: ", data)
          if(!data.data) {
              console.log("Nedostali jsme žádná data.")
              return
          } else {
            setLoggedUser({...loggedUser, 
              id: data.data._id,
              nickname: data.data.nickname,
              avatar: data.data.avatar
            })
          }
      })
      .catch(err => {
          console.log("Během získávání uživatele se něco pokazilo.", err)
      })
  }
  return (
    { loggedUser, setLoggedUser, updateLoggedUser }
  )
}

export default useAuthContext