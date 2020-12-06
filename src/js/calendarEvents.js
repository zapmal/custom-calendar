import "../styles/modalbox.css";

import dayjs from "dayjs";

const calendarDays = document.getElementById("calendar-days");
const modalBox = document.querySelector(".modal");
const closeButton = document.querySelector(".button__close");
const title = document.querySelector(".title__input");
const titleLabel = document.querySelector(".title__label");
const description = document.querySelector(".description__input");
const duedate = document.querySelector(".duedate__input");
const saveButton = document.querySelector(".button__save");
const deleteButton = document.querySelector(".button__delete");
const activeDuedate = document.getElementById("duedate__checkbox");

let selectedDay;
let selectedDayElement;

export const handleDayClick = () => {
  calendarDays.addEventListener("click", e => {
    if (e.target.classList.contains("calendar-day--not-current")) return;
    selectedDay = e.target.dataset.id;
    selectedDayElement = e.target;
    displayEventData(selectedDay);

    modalBox.style.display = "block";
  });
  window.addEventListener("click", e => {
    if (e.target !== modalBox) return;

    cleanEventData();
  });
  title.addEventListener("keyup", e => {
    if (isEmpty(e.target.value)) {
      titleLabel.classList.remove("has-content");
    } else {
      titleLabel.classList.add("has-content");
    }
  });
  activeDuedate.addEventListener("click", () => {
    if (activeDuedate.checked) {
      duedate.disabled = true;
    } else {
      duedate.disabled = false;
    }
  });
  saveButton.addEventListener("click", saveEvent);
  deleteButton.addEventListener("click", deleteEvent);
  closeButton.addEventListener("click", () => modalBox.style.display = "none");;
}

const displayEventData = day => {
  const events = getStoredEvents();
  events.forEach(event => {
    if (event.id === day) {
      title.value = event.title;
      description.value = event.description;
      duedate.value = dayjs(event.duedate).format("YYYY-MM-DD");

      titleLabel.classList.add("has-content");
      saveButton.textContent = "Update";

      saveButton.classList.remove("button__save-align");
      saveButton.classList.add("align-btns");
      deleteButton.style.display = "inline-block";
    }
  });
}

const cleanEventData = () => {
  title.value = "";
  description.value = "";
  duedate.value = "";

  titleLabel.classList.remove("has-content");

  saveButton.textContent = "Save";
  saveButton.classList.remove("align-btns");
  saveButton.classList.add("button__save-align");

  deleteButton.style.display = "none";
  modalBox.style.display = "none";
};


const isEmpty = input => {
  return input === "" || !input;
}

/** 
 * Saves or updates the event based on the filteredEvents length. 
 * If the filteredEvents length is less than the events length then
 * that's because there's a repeated event (said event is filtered at
 * the beginning of the function, that's why its less) so what's saved
 * is the new, no-repeat version of the events array.
 */
const saveEvent = () => {
  let events = getStoredEvents();
  const filteredEvents = events.filter(e => e.id !== selectedDay);
  const eventFlag = selectedDayElement.lastChild;
  const errorMessage = document.querySelector(".error");

  const eventData = {
    id: selectedDay,
    title: title.value,
    description: description.value,
    duedate: duedate.value
  };

  if (isEmpty(eventData.title)) {
    errorMessage.classList.add("display-error");
    saveButton.classList.add("disabled-button");
    saveButton.disabled = true;

    setTimeout(() => {
      saveButton.disabled = false;
      saveButton.classList.remove("disabled-button");
      errorMessage.classList.remove("display-error");
    }, 5000);

  } else {

    if (events.length > filteredEvents.length) {
      filteredEvents.push(eventData);
      events = filteredEvents;
    } else {
      events.push(eventData);
    }

    eventFlag.classList.add("event-active");
    localStorage.setItem("events", JSON.stringify(events));
    modalBox.style.display = "none";
  }
}

const deleteEvent = () => {
  let events = getStoredEvents();
  const eventFlag = selectedDayElement.lastChild;

  eventFlag.classList.remove("event-active");
  events = events.filter(e => e.id !== selectedDay);

  localStorage.setItem("events", JSON.stringify(events));

  modalBox.style.display = "none";
  cleanEventData();
}

const getStoredEvents = () => {
  const events = JSON.parse(localStorage.getItem("events")) || [];

  return events;
}