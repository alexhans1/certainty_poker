import React from "react";
import { Route, Switch } from "react-router-dom";
import Lobby from "../Lobby";
import Game from "../Game";

import "./styles.css";

function PageNotFound() {
  return <p>Page not found.</p>;
}

function App() {
  return (
    <div
      id="app"
      className="mx-auto max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl"
    >
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
