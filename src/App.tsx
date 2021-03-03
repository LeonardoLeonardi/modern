import React, { useState, useReducer } from 'react';
import './App.css';
import faker from 'faker';
import arrayMove from 'array-move';
import People from './People';
import { update, set } from 'lodash';

interface Item {}

interface Action {
  type: string;
  index: number;
}

function reducer(state: any, action: Action) {
  switch (action.type) {
    case 'Add':
      const newPerson = { name: faker.name.findName(), favorite: false };
      state.push(newPerson);
      return;
      break;
    case 'Remove':
      state.filter((list: any, index: number) => index !== action.index);
      break;
    case 'MoveUp':
      state = arrayMove(state, action.index - 1, action.index);
      break;
    case 'MoveDown':
      state = arrayMove(state, action.index + 1, action.index);
      break;
    case 'Favorite':
      update(state, `${action.index}.favorite`, (prev: boolean) => !prev);
      break;
    default:
      throw new Error();
  }
  return state;
}

function App(props: Item) {
  const peopleArray = new Array(10)
    .fill({})
    .map((list) => ({ name: faker.name.findName(), favorite: false }));

  const [state, dispatch] = useReducer(reducer, peopleArray);

  function ButtonAdd() {
    return (
      <div
        className="align-middle text-center bg-indigo-600 cursor-pointer rounded-lg m-2 p-2 text-white"
        onClick={() => dispatch({ type: 'Add', index: NaN })}
      >
        Add
      </div>
    );
  }

  return (
    <div>
      <People
        people={peopleArray}
        onClickRemove={(index) => dispatch({ type: 'Remove', index })}
        onClickUp={(index) => dispatch({ type: 'MoveUp', index })}
        onClickDown={(index) => dispatch({ type: 'MoveDown', index })}
        onClickFavorite={(index) => dispatch({ type: 'Favorite', index })}
      />
      <ButtonAdd />
    </div>
  );
}

export default App;

/*   function handleFavorite(i: number) {
    update(people, `${i}.favorite`, (prev: boolean) => !prev);
    setPeople([...people]);
    /*     setPeople((prev) => update(`${i}.favorite`, (p: boolean) => !p, prev));
  }*/
/* function handleAdd() {
    const newPerson = { name: faker.name.findName(), favorite: false };
    setPeople([...people, newPerson]);
  }
  function handleRemove(i: number) {
    setPeople(people.filter((list, index) => index !== i));
  } */
/*  function handleMoveUp(i: number) {
    const peopleUp = arrayMove(people, i - 1, i);
    setPeople(peopleUp);
  }
  function handleMoveDown(i: number) {
    const peopleDown = arrayMove(people, i + 1, i);
    setPeople(peopleDown);
  }
  
 */
