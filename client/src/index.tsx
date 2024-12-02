import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { OperationDefinitionNode } from "graphql";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { SERVER_URL } from "./config";
import db from "./db/firestore-config";

import "./index.css";

// const httpLink = new HttpLink({
//   uri: `http${SERVER_URL}/query`,
// });

// Create a WebSocket link:
// const wsLink = new WebSocketLink({
//   uri: `ws${SERVER_URL}/query`,
//   options: {
//     reconnect: true,
//   },
// });

// const link = split(
//   // split based on operation type
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(
//       query
//     ) as OperationDefinitionNode;
//     return kind === "OperationDefinition" && operation === "subscription";
//   },
//   wsLink,
//   httpLink
// );

// const client = new ApolloClient({
//   link,
//   cache: new InMemoryCache(),
// });

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
