import React, { useState } from "react";
import { CSVReader } from "react-papaparse";
import { useMutation } from "react-apollo";
import countryCodeToFlagEmoji from "country-code-to-flag-emoji";
import { UPLOAD_QUESTION_SET } from "../../../api/queries";
import { QueryLazyOptions } from "@apollo/client";
// import { useHistory } from "react-router";
import { Question, QuestionTypes } from "../../../interfaces";
import countryCodes from "../../../assets/countryCodes";
import processCsvData from "./processCsvData";
import Guess from "../../Game/Guess";
import { Backdrop, Modal } from "@mui/material";

export interface CSVDataRow {
  question: string;
  type: QuestionTypes;
  answer?: number | string;
  latitude?: number;
  longitude?: number;
  toleranceRadius?: number;
  hint1?: string;
  hint2?: string;
  explanation?: string;
  multiple_choice_alternative1?: string;
  multiple_choice_alternative2?: string;
  multiple_choice_alternative3?: string;
}

interface Props {
  open: boolean;
  handleClose: () => void;
  setShownLanguage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSets: React.Dispatch<React.SetStateAction<string[]>>;
}

function UploadModal({
  open,
  handleClose,
  setSelectedSets,
  setShownLanguage,
}: Props) {
  // const history = useHistory();
  const [showCSVInput, setShowCSVInput] = useState(true);
  const [data, setData] = useState<Omit<Question, "id">[]>();
  const [setName, setSetName] = useState("");
  const [isPrivate, setIsPrivate] = useState<0 | 1>(0);
  const [language, setLanguage] = useState<string>();
  const [_, setError] = useState();

  const [uploadQuestions, { error }] = useMutation(UPLOAD_QUESTION_SET, {
    variables: {
      setName,
      questions: data,
      isPrivate: !!isPrivate,
      language,
    },
    onCompleted: () => {
      setSelectedSets([setName]);
      setShownLanguage(language || "GB");
      handleClose();
      setSetName("");
      setData(undefined);
      setShowCSVInput(true);
    },
    onError: (err: unknown) => {
      setError(() => {
        throw err;
      });
    },
  });

  const handleOnDrop = (rows: { data: CSVDataRow }[]) => {
    setShowCSVInput(false);
    setData(processCsvData(rows));
  };

  const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.error(err);
  };

  const content = showCSVInput ? (
    <>
      <p className="mb-3">
        An example of the file format can be found{" "}
        <a
          className="text-blue-700 hover:text-blue-900"
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.google.com/spreadsheets/d/1_cUrvCc3R2qTL_ME-A9wc9HmyH-zoAQkRnBs80dOPb8/edit?usp=sharing"
        >
          here
        </a>
        .
      </p>
      <CSVReader
        onError={handleOnError}
        config={{ header: true }}
        addRemoveButton
        removeButtonColor="#659cef"
      >
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
    </>
  ) : (
    <>
      <div className="flex">
        <input
          value={setName}
          onChange={(e) => {
            setSetName(e.target.value);
          }}
          type="text"
          className="rounded-md bg-white border border-gray-400 px-4 py-2 mr-4"
          placeholder="Name for the question set"
          aria-label="Name for the question set"
          required
          autoFocus
        />
        <select
          className="rounded-md bg-white border border-gray-400 px-4 py-2"
          required
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
          }}
        >
          <option selected>Language...</option>
          {Object.keys(countryCodes).map((code) => (
            <option key={code} value={code}>
              {countryCodeToFlagEmoji(code)}{" "}
              {countryCodes[code as keyof typeof countryCodes]}
            </option>
          ))}
        </select>
      </div>
      <h3 className="text-2xl mb-3 mt-5">Review your upload:</h3>
      <hr />
      {(data || []).map((q) => (
        <div key={q.question} className="small">
          <p className="my-3">
            Question: <b>{q.question}</b>
          </p>

          {q.type !== QuestionTypes.MULTIPLE_CHOICE && (
            <>
              <p className="my-3">
                Answer:{" "}
                <b>
                  <Guess
                    guess={q.answer}
                    questionType={q.type}
                    alternatives={q.alternatives}
                  />
                </b>
              </p>
              {q.answer.geo?.toleranceRadius && (
                <p className="my-3">
                  Tolerance radius in km: <b>{q.answer.geo.toleranceRadius}</b>
                </p>
              )}
            </>
          )}
          {!!q.hints?.length && (
            <p className="my-3">
              Hints:{" "}
              {q.hints.map((h: string) => (
                <>
                  <br />
                  <span key={h}>
                    <b>{h}</b>
                  </span>
                </>
              ))}
            </p>
          )}
          {!!q.alternatives?.length && (
            <p className="my-3">
              Alternatives:{" "}
              {q.alternatives.map((alt, i) => (
                <>
                  <br />
                  <span key={alt}>
                    <b className={i === 0 ? "text-green-500" : ""}>{alt}</b>
                  </span>
                </>
              ))}
            </p>
          )}
          {q.explanation && (
            <p className="my-3">
              Explanation: <b>{q.explanation}</b>
            </p>
          )}
          <hr className="my-3" />
        </div>
      ))}
      <div className="flex">
        <input
          type="checkbox"
          className="mt-2"
          id="isPrivateCheckbox"
          value={isPrivate}
          onChange={() => {
            setIsPrivate(isPrivate ? 0 : 1);
          }}
        />
        <label className="ml-2" htmlFor="isPrivateCheckbox">
          Questions are private
          <br />
          <span>
            If checked, this set of questions will not appear in the list on the
            start screen.
          </span>
        </label>
      </div>
      <div className="flex mt-3">
        <button
          className="bg-blue-500 rounded-lg font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600"
          disabled={!setName || !language}
          onClick={() => {
            uploadQuestions();
          }}
        >
          Upload
        </button>
        <button
          className="border-2 boder-gray-800 rounded-lg font-bold hover:text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-gray-800 ml-3"
          onClick={() => {
            setShowCSVInput(true);
          }}
        >
          Upload new file
        </button>
      </div>
    </>
  );

  return (
    <Modal
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      open={open}
      className="flex justify-center items-center p-5"
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div className="flex py-6 px-6 md:px-8 my-2 md:my-6 mx-2 md:mx-6 lg:mx-10 max-h-full bg-white rounded-md focus:outline-none">
        <div className="overflow-y-auto flex-shrink-0 max-w-full flex flex-col">
          <h3 className="text-2xl mb-2">
            Upload a CSV file with custom questions
          </h3>
          {content}
          {error && <div className="alert alert-danger">{error.message}</div>}
        </div>
      </div>
    </Modal>
  );
}

export default UploadModal;
