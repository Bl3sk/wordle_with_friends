import { useState, useEffect } from 'react'
import { axiosInstance } from '../config/config'

function useWords() {
    const [solutions, setSolutions] = useState({  classic_word: null, challenge_word: null })
    console.log({solutions})
    // získání slov
    useEffect(() => {
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
            const words = res.data.words
            words._id = res.data._id
            setSolutions(words)
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