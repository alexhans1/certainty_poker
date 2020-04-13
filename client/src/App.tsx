import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Switch } from "react-router-dom";

import "./App.scss";
import { SERVER_URL } from "./config";

function Home() {
  return <p>Home</p>;
}

function PageNotFound() {
  return <p>Page not found.</p>;
}

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route component={PageNotFound} />
    </Switch>
  );
}

export default App;
