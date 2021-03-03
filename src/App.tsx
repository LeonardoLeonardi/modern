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

const peopleArray = new Array(10)
  .fill({})
  .map((list) => ({ name: faker.name.findName(), favorite: false }));

function reducer(state: any, action: Action) {
  switch (action.type) {
    case 'Add':
      const newPerson = { name: faker.name.findName(), favorite: false };
      state([...state, newPerson]);
      return state;
    case 'Remove':
      return state(
        state.filter((list: any, index: number) => index !== action.index),
      );
    case 'MoveUp':
      return {};
    case 'MoveDown':
      return {};
    case 'Favorite':
      return {};
    default:
      throw new Error();
  }
}
function App(props: Item) {
  /* const [people, setPeople] = useState(
    new Array(10)
      .fill({})
      .map((list) => ({ name: faker.name.findName(), favorite: false })),
  ); */
  const [state, dispatch] = useReducer(reducer, peopleArray);
  function ButtonAdd() {
    return (
      <div
        className="align-middle text-center bg-indigo-600 cursor-pointer rounded-lg m-2 p-2 text-white"
        onClick={() => dispatch({ type: 'Add', i: NaN })}
      >
        Add
      </div>
    );
  }

  return (
    <div>
      <People
        /* people={people} */
        onClickRemove={(index) => dispatch({ type: 'Remove', i: index })}
        /* onClickUp={(index) => handleMoveUp(index)}
        onClickDown={(index) => handleMoveDown(index)}
        onClickFavorite={(index) => handleFavorite(index)} */
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
