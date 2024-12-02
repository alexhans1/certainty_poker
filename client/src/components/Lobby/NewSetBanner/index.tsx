import React, { useState } from "react";
import { useMutation } from "react-apollo";
// import { useHistory } from "react-router";
import { CREATE_GAME_QUERY } from "../../../api/queries";
import { Game } from "../../../interfaces";
import image from "../../../assets/2021.png";

interface Props {
  className?: string;
  setName: string;
}
function NewSetBanner({ className = "", setName }: Props) {
  // const history = useHistory();
  const [_, setError] = useState();
  const [createGame, { loading }] = useMutation<{
    createGame: Game;
  }>(CREATE_GAME_QUERY, {
    variables: {
      setNames: [setName],
    },
    // onCompleted: ({ createGame }) => {
    //   history.push(`/${createGame.id}`);
    // },
    onError: (err) => {
      setError(() => {
        throw err;
      });
    },
  });

  return (
    <div
      className={`bg-yellow-200 relative text-lg rounded-2xl px-5 py-6 mr-auto max-w-sm ${className}`}
    >
      <p>
        <b className="text-2xl">2021 Quiz </b>
      </p>
      <p className="mt-2">
        New question set with all 2021 trivia.{" "}
        <i>News, pop culture, arts and sports.</i>
        <br />
        Do you remember what happened this past year?
      </p>
      <button
        className="mt-6 bg-black rounded-full font-semi-bold text-white text-center px-6 py-3 transition duration-300 ease-in-out hover:text-black hover:bg-white border border-black focus:outline-none mr-auto"
        onClick={() => {
          createGame();
        }}
      >
        {loading ? "Loading..." : "Start 2021 Quiz"}
      </button>
      <img
        className="absolute bottom-3 right-3 transform -rotate-12"
        style={{ width: "35%" }}
        src={image}
        alt="2021"
      />
    </div>
  );
}

export default NewSetBanner;
