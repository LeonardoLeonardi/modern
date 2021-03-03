import React, { useState } from 'react';
import ClassNames from 'classnames';

interface P {
  /* people: { name: string; favorite: boolean }[]; */
  onClickRemove: (index: number) => void;
  /* onClickUp: (index: number) => void;
  onClickDown: (index: number) => void;
  onClickFavorite: (index: number) => void; */
}
interface ButtonP {
  text: string;
  onClick: () => void;
}
interface F {
  name: string;
  favorite: boolean;
}
function ButtonRemove(P: ButtonP) {
  return (
    <button
      className="m-2 bg-red-400 rounded-lg px-2"
      onClick={() => P.onClick()}
    >
      Remove
    </button>
  );
}
function ButtonUp(P: ButtonP) {
  return (
    <button
      className="m-2 bg-blue-400 rounded-lg px-2"
      onClick={() => P.onClick()}
    >
      Move Up
    </button>
  );
}
function ButtonDown(p: ButtonP) {
  return (
    <button
      className="m-2 bg-green-400 rounded-lg px-2"
      onClick={() => p.onClick()}
    >
      Move Down
    </button>
  );
}
function ButtonFavorite(p: ButtonP) {
  return (
    <button
      className="m-2 bg-yellow-400 rounded-lg px-2"
      onClick={() => p.onClick()}
    >
      Preferito
    </button>
  );
}
function IsFavorite(f: F) {
  const style = ClassNames(
    '',
    f.favorite === true ? 'bg-yellow-500' : 'bg-red-500',
  );
  console.log(f.favorite);
  return (
    <div className={style}>
      <p className="m-1">{f.name}</p>
    </div>
  );
}

function People(props: P) {
  return (
    <div>
      {props.people.map((person, index) => (
        <div
          className="flex justify-between items-center align-middle"
          key={index}
        >
          <IsFavorite name={person.name} favorite={person.favorite} />
          <div>
            <ButtonRemove
              text="Remove"
              onClick={() => props.onClickRemove(index)}
            />
            {/* <ButtonUp text="Up" onClick={() => props.onClickUp(index)} />
            <ButtonDown text="Down" onClick={() => props.onClickDown(index)} />
            <ButtonFavorite
              text="Favorite"
              onClick={() => props.onClickFavorite(index)}
            /> */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default People;
