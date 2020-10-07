import "../styles/calendar.css";

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const applicationContainer = document.getElementById("app");
applicationContainer.innerHTML = `
    <div class="calendar-month">
    <section class="calendar-month-header">
    <div id="selected-month" class="calendar-month-header-selected-month">
        
    </div>

    <div class="calendar-month-header-selectors">
        <span id="previous-month-selector"><</span>
        <span id="present-month-selector">Today</span>
        <span id="next-month-selector">></span>
    </div>
    </section>

    <ol id="days-of-week" class="day-of-week">

    </ol>

    <ol id="calendar-days" class="days-grid">
  
    </ol>
    </div>
`;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const INITIAL_MONTH = dayjs().format("M");
const INITIAL_YEAR = dayjs().format("YYYY");
const daysOfWeek = document.getElementById("days-of-week");
const calendarDays = document.getElementById("calendar-days");

WEEKDAYS.forEach(weekday => {
    const weekdayElement = document.createElement("li");
    daysOfWeek.appendChild(weekdayElement);
    weekdayElement.innerText = weekday;
});

const currentMonthDays = createDaysForCurrentMonth(INITIAL_YEAR, INITIAL_MONTH);
const previousMonthDays = createDaysForPreviousMonth(INITIAL_YEAR, INITIAL_MONTH);
const nextMonthDays = createDaysForNextMonth(INITIAL_YEAR, INITIAL_MONTH);
const days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

days.forEach(day => appendDay(day, calendarDays));

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

function appendDay(day, calendarDaysElement) {
    const dayElement = document.createElement("li");
    const dayElementClassList = dayElement.classList;

    dayElementClassList.add("calendar-day");
    const dayOfMonthElement = document.createElement("span");
    dayOfMonthElement.innerText = day.dayOfMonth;

    if (!day.isCurrentMonth) dayElementClassList.add("calendar-day--not-current");

    dayElement.appendChild(dayOfMonthElement);
    calendarDaysElement.appendChild(dayElement);
}