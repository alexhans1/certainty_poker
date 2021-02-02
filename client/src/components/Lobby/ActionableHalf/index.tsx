import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { QueryLazyOptions, useMutation } from "@apollo/react-hooks";
import { useLocation } from "react-router-dom";
import countryCodeToFlagEmoji from "country-code-to-flag-emoji";
import { Game, Set } from "../../../interfaces";
import { CREATE_GAME_QUERY } from "../../../api/queries";
import errorHandler from "../../../api/errorHandler";
import UploadModal from "../UploadModal";

import "./styles.css";

interface Props {
  sets?: Set[];
  setName?: string;
  languages: string[];
  fetchSets: (
    options?: QueryLazyOptions<Record<string, any>> | undefined
  ) => void;
}

export default function ActionableHalf({
  sets = [],
  setName,
  languages,
  fetchSets,
}: Props) {
  const history = useHistory();
  const location = useLocation();
  const [selectedSets, setSelectedSets] = useState<string[]>(
    setName ? [setName] : []
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [shownLanguage, setShownLanguage] = useState("GB");
  const [createGame, { loading }] = useMutation<{
    createGame: Game;
  }>(CREATE_GAME_QUERY, {
    variables: {
      setNames: selectedSets,
    },
    onCompleted: ({ createGame }) => {
      history.push(`/${createGame.id}`);
    },
    onError: errorHandler,
  });

  const handleCreateGame = async () => {
    if (selectedSets.length) {
      createGame();
    }
  };

  return (
    <div className="actionable-container container-sm px-4 py-2">
      <a href="/" id="title" className="unstyled-link">
        Certainty Poker
      </a>
      {setName ? (
        <p>
          You can only start a game with these questions from this link{" "}
          <Link
            to={location.pathname}
            style={{ color: "#dfae06" }}
          >{`${window.location.host}${location.pathname}`}</Link>
          .
          <br />
          Make sure to <b>save this link</b> if you want to start a game with
          the uploaded questions later.
          <br />
          The questions will be available for 90 days.
        </p>
      ) : (
        <>
          <h1 className="py-5">
            You think you know things?
            <br />
            Let's make it interesting then!
          </h1>
          <p>
            Certainty Poker is a social (distance) trivia game that doesn't just
            test if you know things but also how certain you are about what you
            think you know.
          </p>
          <p>
            Start by selecting a set of trivia questions, create the game and
            share the link to join with your friends!
            <br />
            You don't like our questions? Upload your own{" "}
            <button
              className="text-blue-700 hover:text-blue-900 p-0"
              onClick={() => {
                setIsUploadModalOpen(true);
              }}
            >
              here ⤴
            </button>
            .
          </p>
        </>
      )}
      <div className="flex my-3">
        {languages.map((language) => (
          <span
            key={language}
            className={`text-4xl mx-1 ${
              language === shownLanguage ? "" : "text-black-50"
            }`}
            onClick={() => {
              setShownLanguage(language);
            }}
            style={{
              cursor: language === shownLanguage ? "default" : "pointer",
            }}
          >
            {countryCodeToFlagEmoji(language)}
          </span>
        ))}
      </div>
      <div className="set-container my-4">
        {sets
          .filter((s) => s.language === shownLanguage)
          .map((set) => (
            <span
              key={set.setName}
              className={`flex justify-center items-center rounded-md text-center px-4 py-3 border border-gray-800 hover:bg-gray-800 hover:text-white cursor-pointer ${
                selectedSets?.includes(set.setName)
                  ? "bg-gray-800 text-white"
                  : ""
              } ${setName ? "mr-auto" : ""}`}
              style={{
                gridColumn: `span ${Math.round(
                  Math.pow(set.setName.length, 0.35)
                )}`,
              }}
              onClick={(e) => {
                if (setName) {
                  return;
                }
                if (e.metaKey) {
                  if (selectedSets?.includes(set.setName)) {
                    setSelectedSets(
                      selectedSets.filter((setName) => set.setName !== setName)
                    );
                  } else {
                    setSelectedSets([set.setName, ...selectedSets]);
                  }
                } else {
                  setSelectedSets([set.setName]);
                }
              }}
            >
              {set.setName} ({set.numberOfQuestions})
            </span>
          ))}
      </div>
      <button
        className="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mx-auto"
        onClick={handleCreateGame}
        disabled={!selectedSets.length}
      >
        {loading ? "Loading..." : "Create Game"}
      </button>
      <p className="mt-4">
        Don't know the rules? Find them{" "}
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
      <p className="text-smaller">
        TL;DR:
        <br />
        Answer trivia different types of questions. Then bet some poker chips on
        how sure you are your answer is right. If you are unsure, you'd better
        fold or put on your best poker face. You're a 100%? Then risk it and go
        All In. If you are closest to the correct answer, you win whatever is in
        the pot. Unless you've folded, of course.
      </p>

      <UploadModal
        open={isUploadModalOpen}
        handleClose={() => {
          setIsUploadModalOpen(false);
        }}
        fetchSets={fetchSets}
        setSelectedSets={setSelectedSets}
      />
    </div>
  );
}
