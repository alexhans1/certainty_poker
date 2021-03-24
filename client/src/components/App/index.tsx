import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import Lobby from "../Lobby";
import Game from "../Game";

function PageNotFound() {
  return <p>Page not found.</p>;
}

function App() {
  return (
    <div className="mx-auto flex flex-col h-full max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl px-3">
      <Link to="/" className="mt-4 text-3xl font-bold">
        Certainty Poker
      </Link>
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
