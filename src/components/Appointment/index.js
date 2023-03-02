import React from 'react';
import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty";
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';
import Status from "components/Appointment/Status";
import Confirm from './Confirm';
import Error from "components/Appointment/Error";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    console.log("name :", name);
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then((response) => {
        return transition(SHOW);
      })
      .catch(error => {
        transition(ERROR_SAVE, true);
      })
  };

  function cancel(event) {
    transition(DELETING, true);

    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY)
      })
      .catch(error => {
        transition(ERROR_DELETE, true)
      })
  };

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
          bookInterview={props.bookInterview}
        />
      )}
      {mode === SAVING &&
        <Status message="Saving..." />
      }
      {mode === ERROR_SAVE && (
        <Error
          message="Error! Appointment couldn't be saved. Please try again later."
          onClose={back}
        />
      )}
      {mode === DELETING &&
        <Status message="Deleting..." />}
      {mode === ERROR_DELETE && (
        <Error
          message="Error! Failed to delete. Please try again."
          onClose={back}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you want to delete the appointment?"
          onCancel={back}
          onConfirm={() => cancel()}
        />)}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
    </article>
  );
}