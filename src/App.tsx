import { addMinutes, formatISO, intlFormat, lightFormat } from 'date-fns'
import { RefObject, useEffect, useRef, useState } from 'react';
import './app.css'

const CURRENT_DATE_FORMATTED = formatISO(new Date(), { representation: 'date' })
const DURATION_WAR = 15
const INTERVAL_BETWEEN_WARS = 85

function formatSchedules(dates: Array<Date>) {
  return dates.map(time => {
    return intlFormat(time, {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }, {
      locale: 'pt-BR',
    })
  })
}

function calculateSchedules(warEnd: Date) {
  const firstSchedule = addMinutes(warEnd, INTERVAL_BETWEEN_WARS)

  const schedules = [firstSchedule]

  for(let i = 0; i < 10; i++) {
    const newTime = addMinutes(schedules[schedules.length - 1],
      INTERVAL_BETWEEN_WARS + DURATION_WAR)

    schedules.push(newTime)
  }

  return schedules
} 

function App() {
  const [warSchedule, setWarSchedule] = useState<Array<string>>([])
  const TIME_INPUT: RefObject<HTMLInputElement> = useRef(null)


  useEffect(()=> { 
    const local_storage = localStorage.getItem('@12Sky 2 War - schedules')

    if(local_storage) {
      const schedules = JSON.parse(local_storage)

      setWarSchedule(schedules)
    }
  },[])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lastWar = new Date(`${CURRENT_DATE_FORMATTED} ${TIME_INPUT.current?.value}`)
    
    const schedules = calculateSchedules(lastWar)

    const formated = formatSchedules(schedules)

    setWarSchedule(formated)

    localStorage.setItem('@12Sky 2 War - schedules', JSON.stringify(formated))

  }

  return (
    <div className='container'>
      <form onSubmit={(e)=> {handleSubmit(e)}}>
        <input ref={TIME_INPUT} type="time" defaultValue={'00:00'}/>
        <button type="submit">CALCULAR</button>
      </form>

      <ul>
        {warSchedule.length === 0 && 
          <li>Nenhum horário ainda</li>}
        {warSchedule.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
   
  )
}

export default App
