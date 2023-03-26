import { useState, useEffect } from 'react'
import { axiosInstance } from '../config/config'

function useWords() {
    const [solutions, setSolutions] = useState({  classic_word: null, challenge_word: null })

    // získání slov
    useEffect(() => {
        //const date = new Date()
        //const todayDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        axiosInstance({
            url: `/words/newest`,
            method: "GET",
        })
        .then((res) => {
            console.log("Získana data: ", res)
            if(!res.data) {
                console.log("Nedostali jsme žádná data.")
                return
            } 
            setSolutions(res.data.words)
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