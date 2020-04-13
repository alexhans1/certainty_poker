import React from "react";
import { useParams } from "react-router-dom";

import "./styles.scss";

function App() {
  let { game_id } = useParams();

  return <p>Game: {game_id}</p>;
}

export default App;
