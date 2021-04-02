import React, {
  useState,
  useReducer,
  useMemo,
  useEffect,
  useLayoutEffect,
  useContext,
  useCallback,
} from 'react';
import './App.css';
import faker from 'faker';
import arrayMove from 'array-move';
import _ from 'lodash/fp';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import { v4 } from 'uuid';

enum EventType {
  LAMPADINA_ACCESA = 'LAMPADINA_ACCESA',
  LAMPADINA_SPENTA = 'LAMPADINA_SPENTA',
}

interface Event {
  type: string; // LAMPADINA_SPENTA O LAMPADINA_ACCESA;
  timestamp: Date;
  traceId: string;
}
interface Command {
  type: string;
  timestamp: Date;
  traceId: string;
}

// Reducer o Projector, legge tutti gli eventi e li proietta o riduce in uno stato.
function isLightOn(events: Event[]): boolean {
  if (events.length === 0) {
    return false;
  }

  const lastEvent = events[events.length - 1];
  return lastEvent.type === EventType.LAMPADINA_ACCESA;
}
function SecondsLightOnLastMinute(events: Event[]): number {
  const minuteNow = DateTime.now().minus({ minute: 1 });
  var seconds = 0;
  var turnedOnTimestamp = minuteNow;
  events.forEach((event) => {
    if (event.type === EventType.LAMPADINA_ACCESA) {
      turnedOnTimestamp = DateTime.fromJSDate(event.timestamp);
    } else if (event.type === EventType.LAMPADINA_SPENTA) {
      const turnedOfDate = DateTime.fromJSDate(event.timestamp);
      if (turnedOfDate >= minuteNow) {
        const turnedOnDate =
          turnedOnTimestamp >= minuteNow ? turnedOnTimestamp : minuteNow;
        seconds += turnedOfDate.diff(turnedOnDate, 'seconds').seconds;
      }
    }
  });
  return seconds;
}

function Button(props: {
  className?: string;
  title: string;
  onClick: () => void;
}) {
  const className = classNames('px-2 py-1 m-1 rounded', props.className);
  return (
    <button className={className} onClick={props.onClick}>
      {props.title}
    </button>
  );
}

function Lampadina(props: { isTurnedOn: boolean }) {
  const className = classNames(
    'rounded-t-full bg-gray-400 p-10 m-2 w-44 text-center',
    {
      'bg-yellow-600': props.isTurnedOn,
    },
  );
  return (
    <div className={className}>{props.isTurnedOn ? 'ACCESSA' : 'SPENTA'}</div>
  );
}

//  UTENTE
//    |
//  invia
//    |
// COMANDO rappresenta l'intezione di dell'utente di interagire con il sistema  ====> [DB COMANDI] Write Store
//    |
//    |
// - [ LOGICA DI BUSINESS  ] -------------------------------------------------------------
//    |
//    |
// EVENTO rapprenta un cambiamento di stato già accaduto nel sistema   ====> [DB EVENTI] Read Store
//   |
//   |
// UTENTE vede il cambio di stato nel sistema

function useCommand() {
  const [commands, setCommands] = useState<Command[]>([]);

  function sendCommand(type: string) {
    // Scrivere sul db dei comandi, il comando che l'utente mi istruiscre.
    setCommands((prev) => [
      ...prev,
      { type, timestamp: new Date(), traceId: v4() },
    ]);
  }

  return { commands, sendCommand };
}

function useBusinessLogic(
  commands: Command[],
  events: Event[],
  emitEvent: (type: string, traceId: string) => void,
) {
  const [position, setPosition] = useState(-1);
  return () => {
    // Leggere i comandi che l'utente manda, gestice la logica applicative ed emettere gli eventi per i cambi di stato.
    commands.forEach((command, index) => {
      if (index > position) {
        console.log('Eseguo comando', command);
        switch (command.type) {
          case 'ACCENDI_LAMPADINA':
            if (!isLightOn(events)) {
              emitEvent('LAMPADINA_ACCESA', command.traceId);
            }
            break;

          case 'SPEGNI_LAMPADINA':
            if (isLightOn(events)) {
              emitEvent('LAMPADINA_SPENTA', command.traceId);
            }
            break;
        }
        // Quando finisco di leggere i comandi, aggiorno la position.
        setPosition(index);
      }
    });
  };
}

function useEvent() {
  const [events, setEvents] = useState<Event[]>([]);

  function emitEvent(type: string, traceId?: string) {
    // Scrive sul db degli eventi, l'evento che il sistema ha emesso.
    setEvents((prev) => [
      ...prev,
      { type, timestamp: new Date(), traceId: traceId ?? v4() },
    ]);
  }

  return { events, emitEvent };
}

function App() {
  const { events, emitEvent } = useEvent();
  const { commands, sendCommand } = useCommand();

  const runBusinessLogic = useBusinessLogic(commands, events, emitEvent);

  useEffect(() => {
    runBusinessLogic();
  }, [commands]);

  const isTurnedOn = isLightOn(events);

  return (
    <div className="flex flex-col">
      <Lampadina isTurnedOn={isTurnedOn} />

      <div className="flex">
        <Button
          className="bg-yellow-300 hover:bg-yellow-200"
          title="Accendi"
          onClick={() => sendCommand('ACCENDI_LAMPADINA')}
        />
        <Button
          className="bg-gray-300 hover:bg-gray-200"
          title="Spegni"
          onClick={() => sendCommand('SPEGNI_LAMPADINA')}
        />
      </div>

      <div className="flex flex-col m-1 mt-4">
        {SecondsLightOnLastMinute(events)}
      </div>
    </div>
  );
}

export default App;
