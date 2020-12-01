import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { Backdrop } from "@material-ui/core";
import { CSVReader } from "react-papaparse";
import { useMutation } from "react-apollo";
import countryCodeToFlagEmoji from "country-code-to-flag-emoji";
import { UPLOAD_QUESTION_SET } from "../../../api/queries";
import { QueryLazyOptions } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import { Question, QuestionTypes } from "../../../interfaces";
import errorLogger from "../../../api/errorHandler";
import { getGuess } from "../../Game/helpers";
import countryCodes from "../../../assets/countryCodes";
import processCsvData from "./processCsvData";

const styles = {
  card: {
    maxHeight: "95vh",
  },
};

export interface CSVDataRow {
  question: string;
  type: QuestionTypes;
  answer?: number | string;
  latitude?: number;
  longitude?: number;
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
  fetchSets: (
    options?: QueryLazyOptions<Record<string, any>> | undefined
  ) => void;
  setSelectedSets: React.Dispatch<React.SetStateAction<string[]>>;
}

function UploadModal({ open, handleClose, fetchSets, setSelectedSets }: Props) {
  const history = useHistory();
  const [showCSVInput, setShowCSVInput] = useState(true);
  const [data, setData] = useState<Omit<Question, "id">[]>();
  const [setName, setSetName] = useState("");
  const [isPrivate, setIsPrivate] = useState<0 | 1>(0);
  const [language, setLanguage] = useState<string>();

  const [uploadQuestions, { error }] = useMutation(UPLOAD_QUESTION_SET, {
    variables: {
      setName,
      questions: data,
      isPrivate: !!isPrivate,
      language,
    },
    onCompleted: () => {
      if (isPrivate) {
        history.push(`/questions/${setName}`);
      } else {
        fetchSets();
      }
      setSelectedSets([setName]);
      handleClose();
      setSetName("");
      setData(undefined);
      setShowCSVInput(true);
    },
    onError: errorLogger,
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
      <p>
        An example of the file format can be found{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.google.com/spreadsheets/d/1_cUrvCc3R2qTL_ME-A9wc9HmyH-zoAQkRnBs80dOPb8/edit?usp=sharing"
        >
          here
        </a>
        .
      </p>
      <CSVReader
        onDrop={handleOnDrop}
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
      <div className="input-group mb-2">
        <input
          value={setName}
          onChange={(e) => {
            setSetName(e.target.value);
          }}
          type="text"
          className="form-control form-control-lg"
          placeholder="Name for the question set"
          aria-label="Name for the question set"
          required
          autoFocus
        />
      </div>
      <div className="input-group mb-3">
        <select
          className="custom-select"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
          }}
        >
          <option selected>Language...</option>
          {Object.keys(countryCodes).map((code) => (
            <option value={code}>
              {countryCodeToFlagEmoji(code)}{" "}
              {countryCodes[code as keyof typeof countryCodes]}
            </option>
          ))}
        </select>
      </div>
      <h3>Review your upload:</h3>
      <hr />
      {(data || []).map((q) => (
        <div key={q.question} className="small">
          <p>
            Question: <b>{q.question}</b>
          </p>
          <p>
            Answer: <b>{getGuess(q.answer, q.type, q.alternatives)}</b>
          </p>
          {!!q.hints?.length && (
            <p>
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
          {q.alternatives?.length && (
            <p>
              Alternatives:{" "}
              {q.alternatives.map((alt, i) => (
                <>
                  <br />
                  <span key={alt}>
                    <b className={i === 0 ? "text-success" : ""}>{alt}</b>
                  </span>
                </>
              ))}
            </p>
          )}
          {q.explanation && (
            <p>
              Explanation: <b>{q.explanation}</b>
            </p>
          )}
          <hr />
        </div>
      ))}
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input mt-2"
          id="isPrivateCheckbox"
          value={isPrivate}
          onChange={() => {
            setIsPrivate(isPrivate ? 0 : 1);
          }}
        />
        <label className="form-check-label" htmlFor="isPrivateCheckbox">
          Questions are private
          <br />
          <span>
            If checked, this set of questions will not appear in the list on the
            start screen.
          </span>
        </label>
      </div>
      <button
        className="btn btn-primary"
        disabled={!setName}
        onClick={() => {
          uploadQuestions();
        }}
      >
        Submit
      </button>
      <button
        className="btn btn-outline-dark ml-3"
        onClick={() => {
          setShowCSVInput(true);
        }}
      >
        Upload new file
      </button>
    </>
  );

  return (
    <Modal
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      open={open}
      className="d-flex justify-content-center align-items-center p-5"
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div className="card" style={styles.card}>
        <div className="card-body text-dark overflow-auto">
          <h3>Upload a CSV file with custom questions</h3>
          {content}
          {error && <div className="alert alert-danger">{error.message}</div>}
        </div>
      </div>
    </Modal>
  );
}

export default UploadModal;
