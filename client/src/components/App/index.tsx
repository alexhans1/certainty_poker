import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router";
import Lobby from "../Lobby";
import Game from "../Game";
import db from "../../db/firestore-config";
import { collection, onSnapshot } from "firebase/firestore";

function PageNotFound() {
  return <p>Page not found.</p>;
}

function App() {
  return <Lobby />;
  return (
    <div className="mx-auto flex flex-col max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl px-3">
      <Link to="/" className="mt-4 text-3xl font-bold">
        Certainty Poker
      </Link>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/:gameId" element={<Game />} />
        <Route path="/questions/:setName" element={<Lobby />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
