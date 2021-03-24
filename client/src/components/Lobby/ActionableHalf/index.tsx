import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
  const history = useHistory();
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);

  useEffect(() => {
    const { pathname } = history.location;
    const isPrivateSetRoute = pathname !== "/";
    if (isPrivateSetRoute) {
      setIsCreateGameModalOpen(true);
    }
  }, [history]);

  return (
    <>
      <div className="flex flex-col justify-end h-full py-8 lg:pb-32 lg:pt-0">
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
        <p className="mt-10">
          Check out the rules{" "}
          <a
            className="text-blue-700 hover:text-blue-900 p-0"
            href="https://docs.google.com/document/d/13pwz8yzrPdY1DcQqXvhejJAxXdWdPrvxR6GUxg5PJPs/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
      </div>
      <StartGameModal
        sets={sets}
        fetchSets={fetchSets}
        open={isCreateGameModalOpen}
        handleOpen={() => {
          setIsCreateGameModalOpen(true);
        }}
        handleClose={() => {
          setIsCreateGameModalOpen(false);
        }}
      />
    </>
  );
}
