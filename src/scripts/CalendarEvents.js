import "../styles/modalbox.css";

const calendarDays = document.getElementById("calendar-days");
const modalBox = document.querySelector(".modal");
const closeModalBox = document.querySelector(".close");
const saveButton = document.querySelector(".save-btn");

// tests
const modalBoxContent = modalBox.querySelector(".modal-content");
const title = modalBoxContent.querySelector(".input-title");
const titleLabel = modalBoxContent.querySelector(".label-title");
const description = modalBoxContent.querySelector(".input-description");
const duedate = modalBoxContent.querySelector(".input-duedate");

// const events = JSON.parse(localStorage.getItem("events")) || []
const events = [];
let selectedDay;

function saveEvent(e) {
    const eventData = {
        id: selectedDay,
        title: title.value,
        description: description.value,
        duedate: duedate.value
    }

    console.log(eventData);
}

function handleDayClick() {
    calendarDays.addEventListener("click", e => {
        if (e.target.classList.contains("calendar-day--not-current")) return;
        selectedDay = e.target.dataset.id;
        modalBox.style.display = "block";
    });
    window.addEventListener("click", e => {
        if (e.target !== modalBox) return;
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
    closeModalBox.addEventListener("click", () => modalBox.style.display="none");;
}

 // Event icon test.
 // modalBoxContent.textContent = `Day #${e.target.textContent}`;
 // const eventFlag = e.target.querySelector(".event-flag");

 // eventFlag.classList.toggle("event-active");

export { handleDayClick };