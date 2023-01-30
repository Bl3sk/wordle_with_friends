import { useState, useEffect } from 'react'
import { axiosInstance } from '../config/config'

function useWords() {
    const [solutions, setSolutions] = useState({  classic_word: null, challenge_word: null })

    // získání slov
    useEffect(() => {
        const date = new Date()
        const todayDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        console.log(todayDate, "TodaaaayyyDATEEEEEEEEEEEEEEEEE")
        axiosInstance({
            url: `/words?date=${todayDate}`,
            method: "GET",
            data: todayDate
        })
        .then((data) => {
            console.log("Získana data: ", data)
            if(!data.data) {
                console.log("Nedostali jsme žádná data.")
                //location.reload()
                localStorage.clear();
                return
            } 
            setSolutions(data.data.words)
        })
        .catch(err => {
            console.log("Během získávání dat se něco pokazilo. ", err)
        })
      }, [])
    
   
  return (
    { solutions }
  )
}

export default useWords