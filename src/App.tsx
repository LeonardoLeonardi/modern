import React, { useState, useReducer, useEffect } from 'react';
import './App.css';
/* import _, { result } from 'lodash/fp';*/
import classNames from 'classnames';
import { DateTime } from 'luxon';
/* import { v4 } from 'uuid';*/
import { GraphQLClient } from 'graphql-request';
import gql from 'graphql-tag';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { Button, Classes, Dialog, InputGroup } from '@blueprintjs/core';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useSubscription,
} from '@apollo/client';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

interface DataTransaction {
  id: string;
  amount: number;
  userId: string;
  time: string;
  creditDate: string;
  delayed: boolean;
}

async function subscriptionApollo(response: string) {
  const GRAPHQL_ENDPOINT = 'wss://dev.graphql-v2.keix.com/graphql';
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  });

  const wsLink = new WebSocketLink({
    uri: GRAPHQL_ENDPOINT,
    options: {
      reconnect: true,
    },
  });
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );
  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  client
    .subscribe({
      query: gql`
        subscription($id: String!) {
          subscribeForEvents(id: $id) {
            id
            stream_name
            type
            time
            position
            global_position
            data
          }
        }
      `,
      variables: { id: response },
    })
    .subscribe({
      next(data) {
        console.log(data);
      },
    });
}

async function earnCredit(userId: string, amount: number): Promise<number> {
  const endpoint = 'https://dev.graphql-v2.keix.com/graphql';

  const query = gql`
    mutation {
      earnCredits(id: "${userId}",amount:${amount})
    }
  `;

  // ... or create a GraphQL client instance to send requests
  const client = new GraphQLClient(endpoint, { headers: {} });
  const graph = client.request(query).then((data) => {
    return data.getUserBalance;
    console.log(data.getUserBalance);
  });
  return await graph;
}
async function useCredit(userId: string, amount: number): Promise<number> {
  const endpoint = 'https://dev.graphql-v2.keix.com/graphql';

  const query = gql`
    mutation {
      useCredits(id: "${userId}",amount:${amount})
    }
  `;

  // ... or create a GraphQL client instance to send requests
  const client = new GraphQLClient(endpoint, { headers: {} });
  const graph = client.request(query).then((data) => {
    return data.getUserBalance;
  });
  return await graph;
}
async function getBalance(userId: string): Promise<number> {
  const endpoint = 'https://dev.graphql-v2.keix.com/graphql';

  const query = gql`
    query {getUserBalance(id:"${userId}")}
  `;

  // ... or create a GraphQL client instance to send requests
  const client = new GraphQLClient(endpoint, { headers: {} });
  const graph = client.request(query).then((data) => {
    return data.getUserBalance;
  });
  return await graph;
}
async function getUser(): Promise<DataTransaction[]> {
  const endpoint = 'https://dev.graphql-v2.keix.com/graphql';

  const query = gql`
    query {
      userTransactions(limit: 100) {
        items {
          id
          amount
          userId
          time
          creditDate
          delayed
        }
      }
    }
  `;

  // ... or create a GraphQL client instance to send requests
  const client = new GraphQLClient(endpoint, { headers: {} });
  const graph = client.request(query).then((data) => {
    return data.userTransactions.items;
  });
  return await graph;
}
async function getTransaction(filter: string): Promise<DataTransaction[]> {
  const endpoint = 'https://dev.graphql-v2.keix.com/graphql';
  let query: any = '';
  if (filter.length > 0) {
    query = gql`
    query{
      userTransactions(filters:{filters:[{attributeName:"userId",filters:[{op:"=",value:"${filter}"}]}]}) {
        items{
          id
          amount
          userId
          time
          creditDate
          delayed
        }
      }
    }
    `;
  } else {
    query = gql`
      query {
        userTransactions(limit: 100) {
          items {
            id
            amount
            userId
            time
            creditDate
            delayed
          }
        }
      }
    `;
  }

  // ... or create a GraphQL client instance to send requests
  const client = new GraphQLClient(endpoint, { headers: {} });
  const graph = client.request(query).then((data) => {
    return data.userTransactions.items;
  });
  return await graph;
}

function Header(props: { name: string }) {
  return (
    <div className="bg-indigo-500 rounded-t-md w-full h-1/6  flex flex-row justify-center items-center sticky">
      <h1 className="font-semibold font-serif text-2xl text-gray-50 uppercase">
        {props.name} List
      </h1>
    </div>
  );
}
function TransactionCard(props: { value: number; date: string }) {
  var dateRefact = DateTime.fromISO(props.date);
  const className = classNames(
    props.value > 0
      ? 'text-2xl font-semibold mx-4 my-0 text-green-500 '
      : 'text-2xl font-semibold mx-4 my-0 text-red-500',
  );

  return (
    <div className="flex flex-row rounded-md bg-gray-50 w-full h-20 shadow-md justify-between items-center my-1 cursor-pointer transform transition-transform hover:scale-105 hover:bg-gray-100">
      <div className="flex">
        {/* <p className="text-2xl font-semibold mx-4">Icon </p> */}
        <p className="text-2xl font-semibold mx-4 my-0">
          {dateRefact.toLocaleString()}
        </p>
      </div>
      <p className={className}>{props.value}€</p>
    </div>
  );
}
function PeopleCard(props: {
  name: String;
  onClickUser: () => void;
  onClickAdd: () => void;
  balance: number;
}) {
  return (
    <div
      className="flex flex-row rounded-md bg-gray-50 w-full h-16 shadow-md  items-center my-2 cursor-pointer transform transition-transform hover:scale-105 hover:bg-gray-100"
      onClick={props.onClickUser}
    >
      <div className="flex flex-row  items-center w-full">
        {/* <p className="text-2xl font-semibold mx-4">Icon </p> */}
        <p className="text-1xl font-semibold mx-4 my-0 text-gray-600 ">
          {props.name}
        </p>
      </div>
    </div>
  );
}

function App() {
  const [transaction, setTransaction] = useState<DataTransaction[]>([]);
  const [isOpenDialogEarn, setIsOpenDialogEarn] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<string>('');
  const [dataCredit, setDataCredit] = useState<number>(0);
  const [isOpenDialogUsed, setIsOpenDialogUsed] = useState<boolean>(false);
  const [user, setUser] = useState<string[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<string>('');
  let userShow: string[] = [];

  useEffect(async () => {
    const resultTransaction = await getTransaction(selectedItem);
    const resultUser = await getUser();
    setTransaction(resultTransaction);
    resultUser.map((data, index) => {
      if (!userShow.includes(data.userId)) {
        userShow.push(data.userId);
      }
    });
    let resultBalance = await getBalance(selectedItem);
    setBalance(resultBalance);
    setUser(userShow);
  }, [selectedItem]);
  console.log(user);

  return (
    <div className="bg-gray-300 w-screen h-screen flex flex-row justify-center items-center">
      {/* DIALOG USE CREDIT */}
      <Dialog
        icon="remove"
        isOpen={isOpenDialogUsed}
        isCloseButtonShown={true}
        onClose={() => setIsOpenDialogUsed(false)}
        onClosing={() => setIsOpenDialogUsed(false)}
        onClosed={() => setIsOpenDialogUsed(false)}
        canOutsideClickClose={true}
        title="Use Credit"
      >
        <div className="m-5 flex flex-row justify-around">
          <div>
            <label className="ml-2">User</label>
            <InputGroup
              id="text-input"
              placeholder="User"
              round={true}
              onChange={(event) => setDataUser(event.target.value)}
            />
          </div>
          <div>
            <label className="ml-2">Amount</label>
            <InputGroup
              placeholder="Amount"
              round={true}
              onChange={(event) => setDataCredit(Number(event.target.value))}
            />
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => setIsOpenDialogUsed(false)}>Close</Button>
            <Button
              intent="success"
              onClick={() => {
                setIsOpenDialogUsed(false);
                useCredit(dataUser, dataCredit);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
      {/* DIALOG EARN CREDIT */}
      <Dialog
        icon="add"
        isOpen={isOpenDialogEarn}
        isCloseButtonShown={true}
        onClose={() => setIsOpenDialogEarn(false)}
        onClosing={() => setIsOpenDialogEarn(false)}
        onClosed={() => setIsOpenDialogEarn(false)}
        canOutsideClickClose={true}
        title="Earn Credit"
      >
        <div className="m-5 flex flex-row justify-around">
          <div>
            <label className="ml-2">User</label>
            <InputGroup
              id="text-input"
              placeholder="User"
              round={true}
              onChange={(event) => setDataUser(event.target.value)}
            />
          </div>
          <div>
            <label className="ml-2">Amount</label>
            <InputGroup
              placeholder="Amount"
              round={true}
              onChange={(event) => setDataCredit(Number(event.target.value))}
            />
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => setIsOpenDialogEarn(false)}>Close</Button>
            <Button
              intent="success"
              onClick={() => {
                setIsOpenDialogEarn(false);
                earnCredit(dataUser, dataCredit);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
      <div className="w-1/6 m-5 max-w-md h-3/6 ">
        <div className="bg-gray-200 rounded-md w-full h-full shadow-xl ">
          <Header name={'user'} />
          <div className="overflow-y-auto h-5/6 overflow-x-hidden py-1 px-2 ">
            {user.map((data, index) => {
              return (
                <PeopleCard
                  name={data}
                  balance={balance}
                  onClickUser={() => setSelectedItem(data)}
                  onClickAdd={() => setSelectedItem(data)}
                />
              );
            })}
          </div>
        </div>
        <div className="w-full flex justify-evenly">
          <Button
            className="m-2"
            intent="success"
            outlined={true}
            onClick={() => setIsOpenDialogEarn(true)}
          >
            Earn Credit
          </Button>
          <Button
            className="m-2"
            intent="danger"
            outlined={true}
            onClick={() => setIsOpenDialogUsed(true)}
          >
            Use Credit
          </Button>
        </div>
      </div>

      <div className="bg-gray-200 rounded-md w-1/5 max-w-md h-3/6 shadow-xl ">
        <Header name={'transaction'} />
        <div className="overflow-y-auto h-5/6 overflow-x-hidden">
          <div className="flex flex-col   text-gray-600 py-1 px-3 ">
            <p className="text-xl font-semibold mx-3 text-center text-gray-800">
              This account has {balance} credits
            </p>
            {transaction.map((data, index) => (
              <TransactionCard value={data.amount} date={data.creditDate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
