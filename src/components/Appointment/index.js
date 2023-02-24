import React from 'react';
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty";
import "components/Appointment/styles.scss";

export default function Appointment(props) {

  const scheduled = function () {
    return (props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty/>)
  }

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {scheduled()}
    </article>
  )
}