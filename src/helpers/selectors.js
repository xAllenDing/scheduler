export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  };

  let appointmentArr = null;

  for (let obj of state.days) {
    if (obj.name === day) {
      appointmentArr = obj.appointments;
    }
  };

  if (!appointmentArr) {
    return [];
  };

  let finalAppt = [];

  for (let appt of appointmentArr) {
    finalAppt.push(state.appointments[appt]);
  };

  return finalAppt;
}

export function getInterview(state, interview) {
  
  let resultInterview = {
    student: null,
    interviewer: null
  };
  
  if (!interview) {
    return null;
  }

  const id = interview.interviewer;
  const interviewerData = state.interviewers[id];

  resultInterview.interviewer = interviewerData;
  resultInterview.student = interview.student;
  
  return resultInterview;
}

export function getInterviewersForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  };

  let interviewerArr = null;

  for (let obj of state.days) {
    if (obj.name === day) {
      interviewerArr = obj.interviewers;
    }
  };

  if (!interviewerArr) {
    return [];
  };

  let finalInterviewer = [];

  for (let interviewer of interviewerArr) {
    finalInterviewer.push(state.interviewers[interviewer]);
  };

  return finalInterviewer;
}