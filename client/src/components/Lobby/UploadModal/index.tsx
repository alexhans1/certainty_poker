import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { Backdrop } from "@material-ui/core";
import { CSVReader } from "react-papaparse";
import { useMutation } from "react-apollo";
import { UPLOAD_QUESTION_SET } from "../../../api/queries";
import { QueryLazyOptions } from "@apollo/react-hooks";

interface UploadModalProps {
  open: boolean;
  handleClose: () => void;
  fetchSets: (
    options?: QueryLazyOptions<Record<string, any>> | undefined
  ) => void;
}

function UploadModal({ open, handleClose, fetchSets }: UploadModalProps) {
  const [showCSVInput, setShowCSVInput] = useState(true);
  const [data, setData] = useState();
  const [setName, setSetName] = useState("");

  const [uploadQuestions, { error }] = useMutation(UPLOAD_QUESTION_SET, {
    variables: {
      setName,
      questions: data,
    },
    onCompleted: () => {
      fetchSets();
      handleClose();
      setSetName("");
      setData(undefined);
      setShowCSVInput(true);
    },
  });

  const handleOnDrop = (d: any) => {
    setShowCSVInput(false);
    setData(
      d.map((row: any) => {
        const { question, answer, hint1, hint2, explanation } = row.data;
        return { question, answer, hints: [hint1, hint2], explanation };
      })
    );
  };

  const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.log(err);
  };

  const content = showCSVInput ? (
    <>
      <h4>Format:</h4>
      <table className="table text-dark table-responsive small">
        <tr>
          <td>question</td>
          <td>answer</td>
          <td>hint1</td>
          <td>hint2</td>
          <td>explanation</td>
        </tr>
        <tr>
          <td>Example Question?</td>
          <td>274,84</td>
          <td>Example hint 1</td>
          <td>Example hint 2</td>
          <td>Example explanation (optional)</td>
        </tr>
      </table>
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
      <div className="input-group mb-3">
        <input
          value={setName}
          onChange={(e) => {
            setSetName(e.target.value);
          }}
          type="text"
          className="form-control form-control-lg"
          placeholder="Name for the question set"
          aria-label="Name for the question set"
          required={true}
        />
      </div>
      <h5>Review questions:</h5>
      {(data || []).map((q: any) => (
        <div key={q.question} className="small">
          <p>
            Question: <b>{q.question}</b>
          </p>
          <p>
            Answer: <b>{q.answer}</b>
          </p>
          <p>
            Hints:{" "}
            {q.hints.map((h: string) => (
              <>
                <br />
                <span key={h}>
                  <b>{h}</b>,{" "}
                </span>
              </>
            ))}
          </p>
          {q.explantion && (
            <p>
              Explanation: <b>{q.explantion}</b>
            </p>
          )}
          <hr />
        </div>
      ))}
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
      <div className="card">
        <div className="card-body text-dark">
          <h3>Upload a file with custom questions</h3>
          {content}
          {error && <div className="alert alert-danger">{error.message}</div>}
        </div>
      </div>
    </Modal>
  );
}

export default UploadModal;
