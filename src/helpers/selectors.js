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
  if (!interview) {
    return null;
  }

  const id = interview.interviewer;
  const interviewerData = state.interviewers[id];

  interview.interviewer = interviewerData;

  return interview;
}