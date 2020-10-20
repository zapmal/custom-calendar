import "../styles/modalbox.css";

const calendarDays = document.getElementById("calendar-days");
const modalBox = document.querySelector(".modal");
const closeModalBox = document.querySelector(".close");

const modalBoxContent = modalBox.querySelector(".modal-content");
const title = modalBoxContent.querySelector(".input-title");
const titleLabel = modalBoxContent.querySelector(".label-title");
const description = modalBoxContent.querySelector(".input-description");
const duedate = modalBoxContent.querySelector(".input-duedate");
const saveButton = modalBoxContent.querySelector(".save-btn");
const deleteButton = modalBoxContent.querySelector(".delete-btn");

const events = JSON.parse(localStorage.getItem("events")) || [];
let selectedDay;
let selectedDayElement;

// when an event is added the calendar should be rendered again
function saveEvent(e) {
    const eventData = {
        id: selectedDay,
        title: title.value,
        description: description.value,
        duedate: duedate.value
    }

    events.push(eventData);
    localStorage.setItem("events", JSON.stringify(events));
    console.log(events);
}

function displayEventData(day) {
    events.forEach(event => {
        if (event.id === day) {
            title.value = event.title;
            description.value = event.description;
            duedate.value = "01/01/0000";

            // this could go in a function x2
            titleLabel.classList.add("has-content");
            saveButton.textContent = "Update";
            saveButton.style.margin = "2rem 0 0 5rem";
            deleteButton.style.display = "inline-block";
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

        // this could go in a function
        title.value = "";
        description.value = "";
        titleLabel.classList.remove("has-content");
        deleteButton.style.display = "none";
        saveButton.textContent = "Save";
        saveButton.style.margin = "2rem 0 0 8.5rem";
    
        modalBox.style.display = "none";
    });
    title.addEventListener("keyup", e => {
        if (e.target.value === "" || !e.target.value) {
            titleLabel.classList.remove("has-content");
        } else {
            titleLabel.classList.add("has-content");
        }
    });
    saveButton.addEventListener("click", saveEvent);

    // At the moment only the icon is being deleted
    deleteButton.addEventListener("click", () => {
        [...calendarDays.children].forEach(day => {
            let current = day.dataset.id;
            if (current === selectedDay) {
                selectedDayElement.lastChild.classList.remove("event-active");
                const remainingEvents = events.filter(e => e.id !== current);
                localStorage.setItem("events", JSON.stringify(remainingEvents));
                modalBox.style.display = "none";
            }
        });
    });
    closeModalBox.addEventListener("click", () => modalBox.style.display="none");;
}

export { handleDayClick };