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
    <div id="app" className="container py-4">
      <a href="/" id="title">Certainty Poker</a>
      <Switch>
        <Route path="/" component={Lobby} exact />
        <Route path="/:game_id" component={Game} exact />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  );
}

export default App;
