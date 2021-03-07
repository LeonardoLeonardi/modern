import React, { useState, useReducer } from 'react';
import './App.css';
import faker from 'faker';
import arrayMove from 'array-move';
import People from './People';
import _ from 'lodash/fp';

interface Item {
  name: string;
  favorite: boolean;
}

interface Action {
  type: string;
  index: number;
  nameManual?: any;
}

function reducer(state: Item[], action: Action) {
  switch (action.type) {
    case 'AddManual':
      //const newPersonManual = { name: action.nameManual, favorite: false };
      //return [...state, newPersonManual];
      break;
    case 'Add':
      const newPerson = { name: faker.name.findName(), favorite: false };
      return [...state, newPerson];
    case 'Remove':
      return _.pullAt(action.index, state);
    case 'MoveUp':
      return arrayMove(state, action.index - 1, action.index);
    case 'MoveDown':
      return arrayMove(state, action.index + 1, action.index);
    case 'Favorite':
      return _.update(
        `${action.index}.favorite`,
        (prev: boolean) => !prev,
        state,
      );
    default:
      throw new Error();
  }
  return state;
}
const peopleArray: Item[] = new Array(10)
  .fill({})
  .map((list) => ({ name: faker.name.findName(), favorite: false }));

function App() {
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
  function ButtonAddManual() {
    return (
      <div className="flex m-2">
        <div>
          <form>
            <label className="text-lg bg-indigo-600">
              Nome:
              <input
                className="border-gray-200 border-2 "
                type="text"
                name="username"
              />
            </label>
            <input
              className="align-middle text-center bg-indigo-600 cursor-pointer rounded-lg m-2 p-2 text-white"
              type="button"
              value="Submit"
              onClick={(e) =>
                dispatch({
                  type: 'AddManual',
                  index: NaN,
                  nameManual: e,
                })
              }
            />
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <People
        people={state}
        onClickRemove={(index) => dispatch({ type: 'Remove', index })}
        onClickUp={(index) => dispatch({ type: 'MoveUp', index })}
        onClickDown={(index) => dispatch({ type: 'MoveDown', index })}
        onClickFavorite={(index) => dispatch({ type: 'Favorite', index })}
      />
      <ButtonAdd />
      <ButtonAddManual />
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
