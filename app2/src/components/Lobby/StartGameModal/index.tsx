import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import countryCodeToFlagEmoji from "country-code-to-flag-emoji";
import { FiCopy } from "react-icons/fi";
import UploadModal from "../UploadModal";
import { Game, Question, Set } from "../../../interfaces";
import Modal from "../../shared/Modal";
import countryCodes from "../../../assets/countryCodes";

import "./styles.css";
import { addDoc, collection } from "firebase/firestore";
import db from "../../../db";

interface Props {
  sets: Set[];
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

function StartGameModal({ sets, open, handleClose, handleOpen }: Props) {
  // const history = useHistory();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedSets, setSelectedSets] = useState<Set[]>([]);
  const [shownLanguage, setShownLanguage] = useState("GB");
  const [languages, setLanguages] = useState<string[]>([]);
  const [_, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
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
    setLanguages(languages);
    setShownLanguage(languages.includes("GB") ? "GB" : languages[0]);
    if (sets.length === 1) {
      setSelectedSets([sets[0]]);
    }
  }, [sets]);

  async function createGame() {
    // todo: add TTL
    const newGame: Omit<Game, "id"> = {
      questionRounds: [],
      questions: selectedSets.reduce<Question[]>((acc, set) => {
        return [...acc, ...set.questions];
      }, []),
      isOver: false,
      players: [],
      dealerId: "unassigned",
      setNames: selectedSets.map(({ setName }) => setName),
    };
    try {
      const docRef = await addDoc(collection(db, "games"), newGame);
      navigate(`/${docRef.id}`);
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  }

  const loading = false;

  // const { pathname } = history.location;
  const isPrivateSetRoute = false; // pathname !== "/";

  const handleCreateGame = async () => {
    if (selectedSets.length) {
      createGame();
    }
  };

  return (
    <>
      <Modal open={open} handleClose={handleClose}>
        <h2 className="text-2xl font-bold my-4">
          Select a set of questions to start a game
        </h2>
        {isPrivateSetRoute && (
          <p className="text-sm font-semibold my-3 px-6 py-3 bg-yellow-100 border border-yellow-300 rounded-xl">
            Make sure you copy and save this URL in order to start games with
            this question set at any time:
            <br />
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none font-bold"
            >
              {window.location.href} <FiCopy className="ml-2 text-lg" />
            </button>
          </p>
        )}
        <p className="my-2 font-semibold">Languages:</p>
        <div className="flex mb-3">
          {languages.map((language) => (
            <span
              key={language}
              className={`text-4xl mx-1 px-5 rounded-full border border-gray-800 hover:bg-gray-800 ${
                language === shownLanguage
                  ? "bg-gray-800"
                  : "opacity-50 hover:opacity-100"
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
                  selectedSets
                    .map(({ setName }) => setName)
                    .includes(set.setName)
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
                    if (
                      selectedSets
                        .map(({ setName }) => setName)
                        .includes(set.setName)
                    ) {
                      setSelectedSets(
                        selectedSets.filter(
                          ({ setName }) => set.setName !== setName
                        )
                      );
                    } else {
                      setSelectedSets([set, ...selectedSets]);
                    }
                  } else {
                    setSelectedSets([set]);
                  }
                }}
              >
                {set.setName} ({set.numberOfQuestions})
              </span>
            ))}
        </div>

        <p className="mt-auto">
          You can also upload your own set of questions{" "}
          <button
            onClick={() => {
              setIsUploadModalOpen(true);
              handleClose();
            }}
            className="text-blue-600 hover:text-blue-800 focus:outline-none font-bold"
          >
            here
          </button>
          .
        </p>

        <button
          className="mt-3 bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-auto"
          onClick={handleCreateGame}
          disabled={!selectedSets.length}
        >
          {loading ? "Loading..." : "Play for Free"}
        </button>
      </Modal>
      {/* <UploadModal
        open={isUploadModalOpen}
        handleClose={() => {
          handleOpen();
          setIsUploadModalOpen(false);
        }}
        setShownLanguage={setShownLanguage}
        setSelectedSets={setSelectedSets}
      /> */}
    </>
  );
}

export default StartGameModal;
