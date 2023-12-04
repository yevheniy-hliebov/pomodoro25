import { useEffect, useState } from 'react';
import { Question, ResetTimer, SkipForward, StartPause } from './cmps/Btn';
import './scss/style.scss';

const pomodoroIntervals = {
  focus: {
    name: 'focus',
    time: { minutes: 25, seconds: 0 }
  },
  short: {
    name: 'short',
    time: { minutes: 5, seconds: 0 }
  },
  long: {
    name: 'long',
    time: { minutes: 15, seconds: 0 }
  }
}

function App() {
  const [pomodoroInterval, setPomodoroInterval] = useState(pomodoroIntervals.focus.name)
  const [time, setTime] = useState(pomodoroIntervals.focus.time);
  const [isActive, setIsActive] = useState(false);
  const [countTimer, setCountTimer] = useState(1)

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        const { minutes, seconds } = time;

        if (seconds > 0) {
          setTime({ minutes, seconds: seconds - 1 });
        } else if (minutes > 0) {
          setTime({ minutes: minutes - 1, seconds: 59 });
        } else {
          clearInterval(interval);
          skipForward()
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  function startTimer() {
    setIsActive(true);
  };

  function toggleTimer() {
    setIsActive(!isActive);
  };

  function pauseTimer() {
    setIsActive(false);
  };

  function timerFormated() {
    return `${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`
  }

  function resetTimer() {
    setTime(pomodoroIntervals[`${pomodoroInterval}`].time);
    setIsActive(false);
  };

  function skipForward() {
    setIsActive(false);
    if (pomodoroInterval === 'focus') {
      setCountTimer(prevCount => prevCount + 1)
      setShortBreakTimer()
      if (countTimer % 4 === 0) {
        setLongBreakTimer();
      }
    } else {
      setFocusTimer();
    }
  }

  function setFocusTimer() {
    setPomodoroInterval(pomodoroIntervals.focus.name);
    setTime(pomodoroIntervals.focus.time)
    setIsActive(false);
  }

  function setShortBreakTimer() {
    setPomodoroInterval(pomodoroIntervals.short.name);
    setTime(pomodoroIntervals.short.time)
    setIsActive(false);
  }

  function setLongBreakTimer() {
    setPomodoroInterval(pomodoroIntervals.long.name);
    setTime(pomodoroIntervals.long.time)
    setIsActive(false);
  }

  document.title = pomodoroInterval[0].toLocaleUpperCase() + ' - ' + timerFormated();

  return (
    <>
      <div className={`pomodoro ${pomodoroInterval}`}>
        <div className="pomodoro__pomodoroIntervals">
          <div className={`pomodoro__btn-pomodoroInterval ${pomodoroInterval === 'focus' ? 'selected' : ''}`} onClick={setFocusTimer} >Focus</div>
          <div className={`pomodoro__btn-pomodoroInterval ${pomodoroInterval === 'short' ? 'selected' : ''}`} onClick={setShortBreakTimer} >Short</div>
          <div className={`pomodoro__btn-pomodoroInterval ${pomodoroInterval === 'long' ? 'selected' : ''}`} onClick={setLongBreakTimer} >Long</div>
        </div>
        <div className="pomodoro__timer">{timerFormated()}</div>
        <div className="pomodoro__actions">
          <ResetTimer onClick={resetTimer} />
          <StartPause onClick={toggleTimer} isPause={isActive} />
          <SkipForward onClick={skipForward} />
        </div>
        <div className="pomodoro__counts">
          <div className="pomodoro__count"># {countTimer}</div>
          <ResetTimer onClick={() => { setCountTimer(1); setFocusTimer() }} />
        </div>
        <div className="pomodoro__name-pomodoroInterval">
          {(pomodoroInterval === 'focus') && 'Time to focus'}
          {(pomodoroInterval === 'short') && 'Time for a break'}
          {(pomodoroInterval === 'long') && 'Time for a long break'}
        </div>
        <Question className={'pomodoro__btn-question'} />
        <div className='pomodoro__explanation'>
          <h2 className='title'>How it works?</h2>
          <div className="text">
            <p>The Pomodoro Technique is a time management method based on <b>25-minute</b> stretches of focused work broken by <b>five-minute</b> breaks.</p>
            <p>Long breaks of <b>15 minutes</b> are taken after four consecutive work intervals.</p>
            <p>Each work interval is called a pomodoro, the Italian word for tomato.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
