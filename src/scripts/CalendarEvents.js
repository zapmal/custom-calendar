import "../styles/modalbox.css";

import dayjs from "dayjs";

const calendarDays = document.getElementById("calendar-days");
const modalBox = document.querySelector(".modal");
const closeModalBox = document.querySelector(".close");

const title = document.querySelector(".input-title");
const titleLabel = document.querySelector(".label-title");
const description = document.querySelector(".input-description");
const duedate = document.querySelector(".input-duedate");
const saveButton = document.querySelector(".save-btn");
const deleteButton = document.querySelector(".delete-btn");

let events = JSON.parse(localStorage.getItem("events")) || [];
let selectedDay;
let selectedDayElement;

function displayEventData(day) {
    events.forEach(event => {
        if (event.id === day) {
            title.value = event.title;
            description.value = event.description;
            duedate.value = dayjs(event.duedate).format("YYYY-MM-DD");

            titleLabel.classList.add("has-content");
            saveButton.textContent = "Update";
            saveButton.style.margin = "2rem 0 0 5rem";
            deleteButton.style.display = "inline-block";
        } 
    });
}

function cleanEventData() {
    title.value = "";
    description.value = "";
    duedate.value = "";
    
    titleLabel.classList.remove("has-content");
    saveButton.textContent = "Save";
    saveButton.style.margin = "2rem 0 0 8.5rem";
    deleteButton.style.display = "none";
    modalBox.style.display = "none";
}

/** 
 * Saves or updates the event based on the filteredEvents length. 
 * If the filteredEvents length is less than the events length then
 * that's because there's a repeated event (said event is filtered at
 * the beginning of the function, that's why its less) so what's saved
 * is the new, no-repeat version of the events array.
*/
function saveEvent(e) {
    const filteredEvents = events.filter(e => e.id !== selectedDay);
    const eventFlag = selectedDayElement.lastChild;
    const eventData = {
        id: selectedDay,
        title: title.value,
        description: description.value,
        duedate: duedate.value
    };

    if (events.length > filteredEvents.length) {
        filteredEvents.push(eventData);
        events = filteredEvents;
        console.log(filteredEvents);
    } else {
        events.push(eventData);
        console.log(events);
    }
    
    eventFlag.classList.add("event-active");
    localStorage.setItem("events", JSON.stringify(events));
}

function deleteEvent(e) {
    [...calendarDays.children].forEach(day => {
        let currentDay = day.dataset.id;
        if (currentDay === selectedDay) {
            const eventFlag = selectedDayElement.lastChild;
            eventFlag.classList.remove("event-active");
            const remainingEvents = events.filter(e => e.id !== currentDay);
            localStorage.setItem("events", JSON.stringify(remainingEvents));

            modalBox.style.display = "none";
        }
    });
}

function handleDayClick() {
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
        if (e.target.value === "" || !e.target.value) {
            titleLabel.classList.remove("has-content");
        } else {
            titleLabel.classList.add("has-content");
        }
    });
    saveButton.addEventListener("click", saveEvent);
    deleteButton.addEventListener("click", deleteEvent);
    closeModalBox.addEventListener("click", () => modalBox.style.display="none");;
}

export { handleDayClick };