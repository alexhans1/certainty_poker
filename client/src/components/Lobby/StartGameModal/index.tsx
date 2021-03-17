import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import countryCodeToFlagEmoji from "country-code-to-flag-emoji";
import { useMutation } from "@apollo/react-hooks";
import { Game, Set } from "../../../interfaces";
import { CREATE_GAME_QUERY } from "../../../api/queries";
import errorHandler from "../../../api/errorHandler";
import Modal from "../../shared/Modal";
import countryCodes from "../../../assets/countryCodes";

import "./styles.css";

interface Props {
  sets: Set[];
  open: boolean;
  handleClose: () => void;
}

function UploadModal({ sets, open, handleClose }: Props) {
  const history = useHistory();
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
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

  const languages =
    sets
      .reduce<string[]>((uniqueLanguages, s) => {
        if (!uniqueLanguages.includes(s.language)) {
          uniqueLanguages.push(s.language);
        }
        return uniqueLanguages;
      }, [])
      .sort((a, b) => {
        if (a === "GB") {
          return -1;
        }
        return parseInt(a) - parseInt(b);
      }) || [];

  return (
    <Modal open={open} handleClose={handleClose}>
      <h2 className="text-2xl font-bold my-4">
        Select a set of questions to start a game
      </h2>
      <div className="flex mb-3">
        {languages.map((language) => (
          <span
            key={language}
            className={`text-4xl mx-1 ${
              language === shownLanguage ? "" : "opacity-50"
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
      {Object.keys(countryCodes).includes(shownLanguage) && (
        <p className="mt-3 font-semibold">
          {countryCodes[shownLanguage as keyof typeof countryCodes]} question
          sets:
        </p>
      )}
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
              }`}
              style={{
                gridColumn: `span ${Math.round(
                  Math.pow(set.setName.length, 0.35)
                )}`,
              }}
              onClick={(e) => {
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
        className="mt-auto bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-auto"
        onClick={handleCreateGame}
        disabled={!selectedSets.length}
      >
        {loading ? "Loading..." : "Play for Free"}
      </button>
    </Modal>
  );
}

export default UploadModal;
