import React, { useState } from 'react';
import ClassNames from 'classnames';

interface P {
  people: { name: string; favorite: boolean }[];
  onClickRemove: (index: number) => void;
  onClickUp: (index: number) => void;
  onClickDown: (index: number) => void;
  onClickFavorite: (index: number) => void;
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
  const style = ClassNames('', f.favorite === true ? 'orange' : 'none');
  console.log(f.favorite);
  return (
    <div className=" flex ">
      <svg
        className="w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill={style}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
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
            <ButtonUp text="Up" onClick={() => props.onClickUp(index)} />
            <ButtonDown text="Down" onClick={() => props.onClickDown(index)} />
            <ButtonFavorite
              text="Favorite"
              onClick={() => props.onClickFavorite(index)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default People;
