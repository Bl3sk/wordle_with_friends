import { useState, useEffect } from 'react'
import jwtDecode  from 'jwt-decode'

function useAuthContext() {
    const [loggedUser, setLoggedUser] = useState(null)
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
    
   
  return (
    { loggedUser, setLoggedUser }
  )
}

export default useAuthContext