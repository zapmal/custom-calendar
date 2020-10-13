import "../styles/calendar.css";

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import { handleDayClick } from "./CalendarEvents";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const TODAY = dayjs().format("YYYY-MM-DD");
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const daysOfWeek = document.getElementById("days-of-week");

const INITIAL_MONTH = dayjs().format("M");
const INITIAL_YEAR = dayjs().format("YYYY");

let currentMonthDays;

WEEKDAYS.forEach(weekday => {
    const weekdayElement = document.createElement("li");
    daysOfWeek.appendChild(weekdayElement);
    weekdayElement.innerText = weekday;
});

renderCalendar();
initMonthSelector();
handleDayClick();

function renderCalendar(year = INITIAL_YEAR, month = INITIAL_MONTH) {
    const calendarDaysElement = document.getElementById("calendar-days");
    const selectedMonth = document.getElementById("selected-month");
    selectedMonth.innerText = dayjs(new Date(year, month - 1)).format("MMMM YYYY");

    removeAllDayElements(calendarDaysElement);

    currentMonthDays = createDaysForCurrentMonth(
        year,
        month,
        dayjs(`${year}-${month}-01`).daysInMonth()
    );

    const previousMonthDays = createDaysForPreviousMonth(year, month);
    const nextMonthDays = createDaysForNextMonth(year, month);
    const days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
    
    days.forEach(day => appendDay(day, calendarDaysElement));
}

function initMonthSelector() {
    let selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));

    document.addEventListener("keydown", e => {
        if (e.code === "ArrowLeft") {
            selectedMonth = dayjs(selectedMonth).subtract(1, "month");
            renderCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
        } 
        if (e.code === "ArrowRight") {
            selectedMonth = dayjs(selectedMonth).add(1, "month");
            renderCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
        }
    });

    const previousMonthSelector = document.getElementById("previous-month-selector");
    previousMonthSelector.addEventListener("click", () => {
        selectedMonth = dayjs(selectedMonth).subtract(1, "month");
        renderCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });

    const presentMonthSelector = document.getElementById("present-month-selector");
    presentMonthSelector.addEventListener("click", () => {
        selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
        renderCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });

    const nextMonthSelector = document.getElementById("next-month-selector");
    nextMonthSelector.addEventListener("click", () => {
        selectedMonth = dayjs(selectedMonth).add(1, "month");
        renderCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });
}

function appendDay(day, calendarDaysElement) {
    const dayElement = document.createElement("li");
    dayElement.dataset.id = day.date;
    const dayElementClassList = dayElement.classList;

    dayElementClassList.add("calendar-day");
    const dayOfMonthElement = document.createElement("span");
    dayOfMonthElement.innerText = day.dayOfMonth;

    const eventFlag = document.createElement("abbr");
    eventFlag.classList.add("event-flag");
    eventFlag.title = "There are Events this day";
    eventFlag.textContent = "EV";

    if (day.date === TODAY) dayElementClassList.add("calendar-day--today");

    if (!day.isCurrentMonth) dayElementClassList.add("calendar-day--not-current");

    dayElement.appendChild(dayOfMonthElement);
    dayElement.appendChild(eventFlag);
    calendarDaysElement.appendChild(dayElement);
}

function removeAllDayElements(calendarDaysElement) {
    let first = calendarDaysElement.firstElementChild;

    while (first) {
        first.remove();
        first = calendarDaysElement.firstElementChild;
    }
}

function getNumberOfDaysInMonth(year, month) {
    return dayjs(`${year}-${month}-01`).daysInMonth();
}

function createDaysForCurrentMonth(year, month) {
    return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
        return {
            date: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
            dayOfMonth: index + 1,
            isCurrentMonth: true
        };
    });
}

function createDaysForPreviousMonth(year, month) {
    const firstDayOfCurrentMonth = getWeekday(currentMonthDays[0].date);
    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");
    const visibleDaysOfPreviousMonth = firstDayOfCurrentMonth ? firstDayOfCurrentMonth - 1 : 6;

    const previousMonthLastMonday = dayjs(currentMonthDays[0].date)
        .subtract(visibleDaysOfPreviousMonth, "day")
        .date();

    return [...Array(visibleDaysOfPreviousMonth)].map((day, index) => {
        return {
            date: dayjs(
                `${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMonday + index}`
            ).format("YYYY-MM-DD"),
            dayOfMonth: previousMonthLastMonday + index,
            isCurrentMonth: false
        };
    });
}

function createDaysForNextMonth(year, month) {
    const lastDayOfTheMonth = getWeekday(`${year}-${month}-${currentMonthDays.length}`);
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");
    const visibleDaysOfNextMonth = lastDayOfTheMonth ? 7 - lastDayOfTheMonth : lastDayOfTheMonth;

    return [...Array(visibleDaysOfNextMonth)].map((day, index) => {
        return  {
            date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format("YYYY-MM-DD"),
            dayOfMonth: index + 1,
            isCurrentMonth: false
        };
    });
}

function getWeekday(date) {
    return dayjs(date).weekday();
}
