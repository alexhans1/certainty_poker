import React, { useState } from "react";
import countryCodeToFlagEmoji from "country-code-to-flag-emoji";
import { Question, QuestionTypes } from "../../../interfaces";
import countryCodes from "../../../assets/countryCodes";
import Guess from "../../Game/Guess";
import { Modal } from "@mui/material";
import { uploadQuestions as uploadQuestionsRequest } from "../../../db";
import { validateQuestions } from "./validateQuestions";

interface Props {
  open: boolean;
  handleClose: () => void;
}

function UploadModal({ open, handleClose }: Props) {
  const [data, setData] = useState<Question[]>();
  const [setName, setSetName] = useState("");
  const [isPrivate, setIsPrivate] = useState<0 | 1>(0);
  const [language, setLanguage] = useState<keyof typeof countryCodes>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const uploadQuestions = async () => {
    try {
      if (!data || !setName || !language) {
        return;
      }

      setLoading(true);
      await uploadQuestionsRequest(data, setName, language, !!isPrivate);

      handleClose();
      setSetName("");
      setData(undefined);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error as Error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/json") {
      setError(new Error("Invalid file type. Please upload a JSON file."));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;
      try {
        const jsonData = JSON.parse(e.target.result as string);

        validateQuestions(jsonData);
        setData(jsonData);
      } catch (err) {
        setError(err as Error);
      }
    };

    reader.onerror = () => {
      setError(new Error("Error reading the file."));
    };

    reader.readAsText(file);
  };

  const content = !data ? (
    <div
      style={{
        padding: "1em",
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "300px",
      }}
    >
      <label
        htmlFor="file-upload"
        style={{ display: "block", marginBottom: "1em" }}
      >
        Upload a JSON file with your question sets:
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ display: "block", marginBottom: "1em" }}
      />
    </div>
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
            setLanguage(
              e.target.value as keyof typeof countryCodes | undefined
            );
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
      {(data || []).map((q, i) => (
        <div className="flex gap-4">
          <p className="mt-3">{i + 1}.</p>
          <div key={q.question}>
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
                    Tolerance radius in km:{" "}
                    <b>{q.answer.geo.toleranceRadius}</b>
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
                      <b
                        className={
                          i === (q.answer.numerical as number) - 1
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {alt}
                      </b>
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
            setData(undefined);
            setSetName("");
            setLanguage(undefined);
          }}
        >
          {loading ? "Loading..." : "Upload new file"}
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
    >
      <div className="flex py-6 px-6 md:px-8 my-2 md:my-6 mx-2 md:mx-6 lg:mx-10 max-h-full bg-white rounded-md focus:outline-none">
        <div className="overflow-y-auto flex-shrink-0 max-w-full flex flex-col">
          <h3 className="text-2xl mb-2">
            Upload a JSON file with custom questions
          </h3>
          {content}
          {error && <div className="text-red-600 mt-4">{error.message}</div>}
        </div>
      </div>
    </Modal>
  );
}

export default UploadModal;
