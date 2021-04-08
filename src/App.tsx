import React, {
  useState,
  useReducer,
  useMemo,
  useEffect,
  useLayoutEffect,
  useContext,
  useCallback,
} from 'react';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import {
  Classes,
  Alignment,
  Intent,
  Spinner,
  Button,
  AnchorButton,
  Icon,
  Card,
  Toast,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Callout,
} from '@blueprintjs/core';

import * as Blueprint from '@blueprintjs/core';
import './App.css';
import _ from 'lodash/fp';
import classNames from 'classnames';
import { DateTime, Interval } from 'luxon';
import { v4 } from 'uuid';
import { FocusStyleManager } from '@blueprintjs/core';
import { INTENT_PRIMARY } from '@blueprintjs/core/lib/esm/common/classes';
FocusStyleManager.onlyShowFocusOnTabs();

enum EventType {
  LAMPADINA_ACCESA = 'LAMPADINA_ACCESA',
  LAMPADINA_SPENTA = 'LAMPADINA_SPENTA',
  CONTATORE_ACCESO = 'CONTATORE_ACCESO',
  CONTATORE_SPENTO = 'CONTATORE_SPENTO',
}

interface Event {
  type: string; // LAMPADINA_SPENTA O LAMPADINA_ACCESA;
  timestamp: Date;
  traceId: string;
  idBulb?: number;
}
interface Command {
  type: string;
  timestamp: Date;
  traceId: string;
  idBulb?: number;
}

// Reducer o Projector, legge tutti gli eventi e li proietta o riduce in uno stato.
function isLightOn(events: Event[], id?: number): boolean {
  if (events.length === 0) {
    return false;
  }
  const Filtered = events.filter(
    (events) =>
      events.idBulb === id &&
      (events.type == 'LAMPADINA_ACCESA' || events.type == 'LAMPADINA_SPENTA'),
  );
  const lastEvent = Filtered[Filtered.length - 1];
  return lastEvent != null && lastEvent.type === 'LAMPADINA_ACCESA';
}

function isContatoreOn(events: Event[]): boolean {
  if (events.length === 0) {
    return false;
  }
  const Filtered = events.filter(
    (events) =>
      events.type == 'CONTATORE_ACCESO' || events.type == 'CONTATORE_SPENTO',
  );
  const lastEvent = Filtered[Filtered.length - 1];
  return lastEvent != null && lastEvent.type === 'CONTATORE_ACCESO';
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
function Buttonee(props: {
  className?: string;
  title: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <>
      <Button
        text={props.title}
        className="px-2 py-1 m-1 rounded"
        onClick={props.onClick}
        icon={props.icon}
        intent={props.className}
      ></Button>
    </>
  );
}

function Lampadina(props: { isTurnedOn: boolean; index: number }) {
  const className = classNames(props.isTurnedOn ? ' orange ' : 'gray');
  return (
    <>
      <Icon
        icon="lightbulb"
        iconSize={100}
        className="rounded-t-full p-10 m-2 w-44 text-center"
        color={className}
      />
    </>
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

  function sendCommand(type: string, id?: number) {
    // Scrivere sul db dei comandi, il comando che l'utente mi istruiscre.
    setCommands((prev) => [
      ...prev,
      { type, timestamp: new Date(), traceId: v4(), idBulb: id },
    ]);
  }

  return { commands, sendCommand };
}

function useBusinessLogic(
  commands: Command[],
  events: Event[],
  emitEvent: (type: string, traceId: string, id?: number) => void,
) {
  const [position, setPosition] = useState(-1);
  return () => {
    // Leggere i comandi che l'utente manda, gestice la logica applicative ed emettere gli eventi per i cambi di stato.
    commands.forEach((command, index) => {
      if (index > position) {
        console.log('Eseguo comando', command);
        switch (command.type) {
          case 'ACCENDI_LAMPADINA':
            if (!isLightOn(events, command.idBulb) && isContatoreOn(events)) {
              emitEvent('LAMPADINA_ACCESA', command.traceId, command.idBulb);
            }
            break;

          case 'SPEGNI_LAMPADINA':
            if (isLightOn(events, command.idBulb) && isContatoreOn(events)) {
              emitEvent('LAMPADINA_SPENTA', command.traceId, command.idBulb);
            }
            break;
          case 'ACCENDI_CONTATORE':
            if (!isContatoreOn(events)) {
              emitEvent('CONTATORE_ACCESO', command.traceId);
            }
            break;
          case 'SPEGNI_CONTATORE':
            if (isContatoreOn(events)) {
              emitEvent('CONTATORE_SPENTO', command.traceId);
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

  function emitEvent(type: string, traceId?: string, id?: number) {
    // Scrive sul db degli eventi, l'evento che il sistema ha emesso.
    setEvents((prev) => [
      ...prev,
      { type, timestamp: new Date(), traceId: traceId ?? v4(), idBulb: id },
    ]);
  }

  return { events, emitEvent };
}

function App() {
  const { events, emitEvent } = useEvent();
  const { commands, sendCommand } = useCommand();

  const runBusinessLogic = useBusinessLogic(commands, events, emitEvent);

  const numBulb = new Array(3).fill([0]);

  useEffect(() => {
    runBusinessLogic();
  }, [commands]);

  const isContatoreTurnedOn = isContatoreOn(events);
  return (
    <>
      <Navbar className="shadow-lg bp3-dark">
        <NavbarGroup>
          <NavbarHeading>Lampadine di casa Leonardi</NavbarHeading>
          <NavbarDivider />
          <Button className={Classes.MINIMAL} icon="home" text="Home" />
        </NavbarGroup>
      </Navbar>
      <div className="flex flex-col justify-center items-center align-middle pt-5">
        <Card interactive={true} className="m-2">
          <Icon
            icon="offline"
            iconSize={100}
            className="p-10 w-44 text-center ml-20"
            color={isContatoreTurnedOn ? 'purple' : 'gray'}
          />

          <div className="items-center m-3">
            <Buttonee
              className="success"
              title="Accendi contatore"
              icon="layer"
              onClick={() => sendCommand('ACCENDI_CONTATORE')}
            />
            <Buttonee
              className="danger"
              title="Spegni contatore"
              icon="layer-outline"
              onClick={() => sendCommand('SPEGNI_CONTATORE')}
            />
          </div>
          <div className="m-1 mt-4">{SecondsLightOnLastMinute(events)}</div>
        </Card>
        <div className="flex-col ">
          <div className="flex items-center justify-center ">
            {numBulb.map((numBulb, index) => (
              <>
                <Card interactive={true} className="m-2">
                  <Lampadina
                    isTurnedOn={isLightOn(events, index) && isContatoreTurnedOn}
                    index={index}
                  />
                  <div className="flex mb-1">
                    <Buttonee
                      className="warning"
                      title="Accendi"
                      icon="eye-on"
                      onClick={() => sendCommand('ACCENDI_LAMPADINA', index)}
                    />
                    <Buttonee
                      className="none"
                      title="Spegni"
                      icon="eye-off"
                      onClick={() => sendCommand('SPEGNI_LAMPADINA', index)}
                    />
                  </div>
                </Card>
              </>
            ))}
          </div>
          <Callout
            intent="warning"
            icon="offline"
            title={'Promemoria importante'}
            className="max-w-2xl m-2"
          >
            Ricordati che devi pagare la bolletta! :)
          </Callout>
        </div>
      </div>
    </>
  );
}

export default App;
