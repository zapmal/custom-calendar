import "../styles/modalbox.css";

const calendarDays = document.getElementById("calendar-days");
const modalBox = document.querySelector(".modal");
const closeModalBox = document.querySelector(".close");

function handleDayClick() {

    calendarDays.addEventListener("click", displayModalBox);
    closeModalBox.addEventListener("click", () => modalBox.style.display="none");

    window.addEventListener("click", e => {
        if (e.target === modalBox) {
            modalBox.style.display = "none";
        }
    });
}

function displayModalBox(e) {
    if (e.target.classList.contains("calendar-day--not-current")) return;
        
    const modalBoxContent = modalBox.querySelector(".modal-content");
    const title = modalBoxContent.querySelector(".input-title");
    const description = modalBoxContent.querySelector(".input-description");
    const duedate = modalBoxContent.querySelector(".input-duedate");
    // console.log(modalBoxContent.querySelector(".input-title"));


    modalBox.style.display = "block";
    // modalBoxContent.textContent = `Day #${e.target.textContent}`;
    // const eventFlag = e.target.querySelector(".event-flag");

    // eventFlag.classList.toggle("event-active");
}

export { handleDayClick };