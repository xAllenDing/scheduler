import React from "react";
import axios from 'axios';

import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByPlaceholderText, getByAltText, queryByText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {

    // Render Application
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"))
      .then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText("Leopold Silvers")).toBeInTheDocument();
      });
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {

    // Render Application
    const { container, debug } = render(<Application />);

    // Wait for the text "Archie Cohen" to display
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // Click "Add"
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // Click "Save"
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday"));

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    // Render Application
    const { container, debug } = render(<Application />);

    // Wait for the text "Archie Cohen" to display
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen")
    );

    // Click "Delete"
    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you want to delete the appointment?")).toBeInTheDocument();

    // Click "Confirm"
    fireEvent.click(queryByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // Click "Add"
    await waitForElement(() => getByAltText(appointment, "Add"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    // Render Application
    const { container } = render(<Application />);

    // Wait for the text "Archie Cohen" to display
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen")
    );

    // Click "Edit"
    fireEvent.click(queryByAltText(appointment, 'Edit'));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // Click "save"
    fireEvent.click(getByText(appointment, 'Save'));
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(container, 'Sylvia Palmer'));
    expect(getByText(container, 'Sylvia Palmer')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '1 spot remaining'));
  });

  it("shows the save error when failing to save an appointment", async () => {

    // Render Application
    const { container } = render(<Application />);

    // Wait for the text "Archie Cohen" to display
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    fireEvent.click(getByAltText(appointment, "Edit"));

    getAllByTestId(appointment, "student-name-input");

    axios.put.mockRejectedValueOnce();

    // Click "Save"
    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => getByText(appointment, "Error"));
  });

  it("shows the delete error when failing to delete an appointment", async () => {

    // Render Application
    const { container } = render(<Application />);

    // Wait for the text "Archie Cohen" to display
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    // Click "Delete"
    fireEvent.click(getByAltText(appointment, "Delete"));
    await waitForElement(() => getByText(appointment, "Confirm"));

    axios.delete.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Confirm"));

    await waitForElement(() => getByText(appointment, "Error"));
  });
})
