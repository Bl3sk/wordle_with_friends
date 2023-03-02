import { useState, useEffect } from 'react'

function useAuthContext() {
    const [loggedUser, setLoggedUser] = useState(null)
    console.log(loggedUser)

    // získání přihlášeného uživatele z local storage
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("user")))
      }, [])

    // aktualizace přihlášeného uživatele z local storage
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(loggedUser))
    }, [loggedUser])
    
   
  return (
    { loggedUser, setLoggedUser }
  )
}

export default useAuthContext