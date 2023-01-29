import { useState } from 'react';

function Countdown() {
    const [timer, setTimer] = useState("24:00:00")

    setInterval(()=> {
      const nextDay = new Date()
      nextDay.setHours(23); nextDay.setMinutes(59); nextDay.setSeconds(59); nextDay.setMilliseconds(999)
      const milliseconds = nextDay.getTime() - Date.now()
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      setTimer(`${(hours % 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`)
    }, 1000)

    return (
        <div className="timer">new words in: { timer }</div>
    )
  }
  
  export default Countdown;
  