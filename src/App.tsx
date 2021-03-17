import React, { useState, useEffect, useReducer, useCallback } from 'react';
import './App.css';
import classNames from 'classnames';
import arrayMove from 'array-move';
import _ from 'lodash/fp';

interface Item {
  status: 'stopped' | 'started' | 'paused';
  seconds: number;
  laps: number[];
}
interface Action {
  type: 'start' | 'stop' | 'pause' | 'reset' | 'lap' | 'interval';
  payload?: {};
}
const timerState: Item = {
  status: 'stopped',
  seconds: 0,
  laps: new Array(10).fill(0),
};

function reducer(state: Item, action: Action): Item {
  switch (action.type) {
    case 'interval':
      return { ...state, seconds: state.seconds + 1 };
    case 'start':
      if (state.status === 'stopped') {
        state.seconds = 0;
      }
      return { ...state, status: 'started' };
    case 'stop':
      return { ...state, status: 'stopped' };
    case 'pause':
      return { ...state, status: 'paused' };
    case 'reset':
      return { status: 'stopped', laps: [], seconds: 0 };
    case 'lap':
      return { ...state, laps: [...state.laps, state.seconds], seconds: 0 };
  }
  return state;
}

function useHookTimer() {
  const [state, dispatch] = useReducer(reducer, timerState);

  const ButtonStart = useCallback((props: Item) => {
    const styleStart = classNames(
      ' text-white rounded px-4 mx-1 my-2',
      props.status === 'started' ? 'bg-gray-700' : 'bg-green-700',
    );

    return (
      <button
        onClick={() => {
          /* setPaused(false);
      setState('start'); */
          dispatch({ type: 'start' });
        }}
        className={styleStart}
        disabled={props.status === 'started' ? true : false}
      >
        Start
      </button>
    );
  }, []);
  const ButtonStop = useCallback((props: Item) => {
    const styleStop = classNames(' text-white rounded px-4 mx-1 my-2', {
      'bg-red-700': props.status === 'started' || props.status === 'paused',
      'bg-gray-700': props.status === 'stopped',
    });
    return (
      <button
        onClick={() => {
          /* setPaused(true);
          setStopped(true);
          setState('stop'); */
          dispatch({ type: 'stop' });
        }}
        className={styleStop}
        disabled={props.status === 'stopped' ? true : false}
      >
        Stop
      </button>
    );
  }, []);
  const ButtonPause = useCallback((props: Item) => {
    const stylePause = classNames(' text-white rounded px-4 mx-1 my-2', {
      'bg-blue-700': props.status !== 'stopped',
      'bg-gray-700': props.status === 'stopped',
    });

    return (
      <button
        onClick={() => {
          /* setPaused(true);
          setState('pause'); */
          dispatch({ type: 'pause' });
        }}
        className={stylePause}
        disabled={
          props.status === 'paused' || props.status === 'stopped' ? true : false
        }
      >
        Pause
      </button>
    );
  }, []);
  const ButtonLap = useCallback((props: Item) => {
    const styleLap = classNames(' text-white rounded px-4 mx-1 my-2', {
      'bg-blue-700': props.status !== 'stopped',
      'bg-gray-700': props.status === 'stopped',
    });

    return (
      <button
        onClick={() => {
          /* setLap([...lap, seconds]);
          setSeconds(0); */
          dispatch({ type: 'lap' });
        }}
        className={styleLap}
        disabled={props.status === 'stopped' ? true : false}
      >
        Lap
      </button>
    );
  }, []);
  const ButtonReset = useCallback((props: Item) => {
    return (
      <button
        onClick={() => {
          // setSeconds(0);
          /* setState('start'); */
          dispatch({ type: 'reset' });
        }}
        className="bg-indigo-600 text-white rounded px-4 mx-1 my-2"
      >
        Reset
      </button>
    );
  }, []);

  useEffect(() => {
    if (state.status === 'paused') {
      return;
    }
    if (state.status === 'stopped') {
      return;
    }
    console.log(state.status);
    const interval = setInterval(() => {
      dispatch({ type: 'interval' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status]);

  return {
    ButtonStart,
    ButtonStop,
    ButtonPause,
    ButtonLap,
    ButtonReset,
    state,
  };
}

function App() {
  const {
    ButtonStart,
    ButtonStop,
    ButtonPause,
    ButtonLap,
    ButtonReset,
    state,
  } = useHookTimer();

  return (
    <div>
      <div>
        <ButtonStart {...state} />
        <ButtonStop {...state} />
        <ButtonPause {...state} />
        <ButtonLap {...state} />
        <ButtonReset {...state} />
      </div>
      {/*----MAP----*/}
      <div className="p-2">Timer: {state.seconds} secondi</div>
      {state.laps.map((time: number, index: number) => {
        if (time != 0) {
          return (
            <div className="px-2 py-1" key={index}>
              Timer lap: {time} secondi
            </div>
          );
        }
      })}
    </div>
  );
}

export default App;
