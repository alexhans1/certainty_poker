import React from "react";
import { Route, Switch } from "react-router-dom";
import Lobby from "../Lobby";
import Game from "../Game";

import "./styles.scss";

function PageNotFound() {
  return <p>Page not found.</p>;
}

function App() {
  return (
    <div id="app">
      <Switch>
        <Route path="/" component={Lobby} exact />
        <Route path="/:gameId" component={Game} exact />
        <Route path="/questions/:setName" component={Lobby} exact />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  );
}

export default App;
