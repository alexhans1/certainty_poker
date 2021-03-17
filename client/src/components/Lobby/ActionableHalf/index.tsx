import React, { useState } from "react";
import { QueryLazyOptions } from "@apollo/react-hooks";
import { Set } from "../../../interfaces";
import StartGameModal from "../StartGameModal";

interface Props {
  sets?: Set[];
  setName?: string;
  fetchSets: (
    options?: QueryLazyOptions<Record<string, any>> | undefined
  ) => void;
}

export default function ActionableHalf({
  sets = [],
  setName,
  fetchSets,
}: Props) {
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col justify-end h-full py-8 lg:pb-40 lg:pt-0">
        <h1 className="text-5xl">
          <span className="font-light italic">You think you know things?</span>
          <br />
          Let's make it interesting then!
        </h1>
        <p className="text-xl mt-3">
          <b>Free</b> poker-like trivia game.
        </p>
        <button
          onClick={() => {
            setIsCreateGameModalOpen(true);
          }}
          className="border border-blue-600 rounded-full font-bold text-3xl text-blue-600 hover:text-white text-center px-8 py-4 transition duration-300 ease-in-out hover:bg-blue-600 mt-8 mr-auto focus:outline-none"
        >
          Create Game
        </button>
      </div>
      <StartGameModal
        sets={sets}
        open={isCreateGameModalOpen}
        handleClose={() => {
          setIsCreateGameModalOpen(false);
        }}
      />
    </>
  );
}
