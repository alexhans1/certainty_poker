import React, { useEffect, useState } from "react";
import axios from "axios";

import "./App.scss";
import { SERVER_URL } from "./config";

function App() {
  const [data, setData] = useState("Loading...");
  useEffect(() => {
    axios.get(SERVER_URL).then(({ data: res }) => {
      setData(res?.data ?? "Failed to load.");
    });
  }, []);

  return <div className="App">{data}</div>;
}

export default App;
