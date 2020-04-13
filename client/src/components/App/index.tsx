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
    <Switch>
      <Route path="/" component={Lobby} exact />
      <Route path="/:game_id" component={Game} exact />
      <Route component={PageNotFound} />
    </Switch>
  );
}

export default App;
