import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  const setDay = day => {
    return setState({ ...state, day })
  };

  useEffect(() => {
    const daysURL = '/api/days';
    const appointmentURL = '/api/appointments';
    const interviewersURL = '/api/interviewers';

    Promise.all([
      axios.get(daysURL),
      axios.get(appointmentURL),
      axios.get(interviewersURL)
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    })
  }, []);

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(id, 'confirmed');

    return axios.put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        setState({ ...state, appointments, days });
      });
  }

  function cancelInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(id, 'canceled');

    return axios.delete(`/api/appointments/${id}`)
      .then((response) => {
        setState({ ...state, appointments, days });
      });
  };

  function updateSpots(id, action) {
    const stateCopy = { ...state };

    stateCopy.days.forEach((day) => {
      if (day.appointments.includes(id) && action === 'confirmed') {
        day.spots--;
      }

      if (day.appointments.includes(id) && action === 'canceled') {
        day.spots++;
      }
    });

    return stateCopy.days;
  };

  return { state, setDay, bookInterview, cancelInterview };
}