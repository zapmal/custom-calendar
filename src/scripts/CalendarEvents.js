import "../styles/modalbox.css";

const calendarDays = document.getElementById("calendar-days");
const modalBox = document.querySelector(".modal");
const modalBoxContent = document.querySelector(".modal .content"); // test
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
        
    modalBox.style.display = "block";
    modalBoxContent.textContent = `Day #${e.target.textContent}`;
}

export { handleDayClick };