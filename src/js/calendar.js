import "../styles/calendar.css";

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import {
  handleDayClick
} from "./calendarEvents";
import {
  checkDuedates
} from "./notifications";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const TODAY = dayjs().format("YYYY-MM-DD");
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const daysOfWeek = document.getElementById("days-of-week");

const INITIAL_MONTH = dayjs().format("M");
const INITIAL_YEAR = dayjs().format("YYYY");

let currentMonthDays;

const renderCalendar = (year = INITIAL_YEAR, month = INITIAL_MONTH) => {
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

  // Events
  const storedEvents = getStoredEventsDates();
  const renderedDays = [...document.querySelectorAll(".calendar-day")];

  renderedDays.forEach(day => {
    if (day.classList.contains("calendar-day--not-current")) return;
    let currentDay = day.dataset.id;

    storedEvents.forEach(event => {
      if (event === currentDay) {
        const eventFlag = day.querySelector(".event-flag");
        eventFlag.classList.add("event-active");
      }
    });
  });
}

const initMonthSelector = () => {
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

const appendDay = (day, calendarDaysElement) => {
  const dayElement = document.createElement("li");
  dayElement.dataset.id = day.date;

  dayElement.classList.add("calendar-day");
  const dayOfMonthElement = document.createElement("span");
  dayOfMonthElement.innerText = day.dayOfMonth;

  const eventFlag = document.createElement("abbr");
  eventFlag.classList.add("event-flag");
  eventFlag.title = "This means that there's an event this day, click for more details!";
  eventFlag.textContent = "E";

  if (day.date === TODAY) dayElement.classList.add("calendar-day--today");

  if (!day.isCurrentMonth) dayElement.classList.add("calendar-day--not-current");

  dayElement.appendChild(dayOfMonthElement);
  dayElement.appendChild(eventFlag);
  calendarDaysElement.appendChild(dayElement);
}

const removeAllDayElements = calendarDaysElement => {
  let first = calendarDaysElement.firstElementChild;

  while (first) {
    first.remove();
    first = calendarDaysElement.firstElementChild;
  }
}

const getNumberOfDaysInMonth = (year, month) => {
  return dayjs(`${year}-${month}-01`).daysInMonth();
}

const createDaysForCurrentMonth = (year, month) => {
  return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
    return {
      date: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
      dayOfMonth: index + 1,
      isCurrentMonth: true
    };
  });
}

const createDaysForPreviousMonth = (year, month) => {
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

const createDaysForNextMonth = (year, month) => {
  const lastDayOfTheMonth = getWeekday(`${year}-${month}-${currentMonthDays.length}`);
  const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");
  const visibleDaysOfNextMonth = lastDayOfTheMonth ? 7 - lastDayOfTheMonth : lastDayOfTheMonth;

  return [...Array(visibleDaysOfNextMonth)].map((day, index) => {
    return {
      date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format("YYYY-MM-DD"),
      dayOfMonth: index + 1,
      isCurrentMonth: false
    };
  });
}

const getWeekday = date => {
  return dayjs(date).weekday();
}

export const getStoredEventsDates = () => {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const data = events.map(e => dayjs(e.id).format("YYYY-MM-DD"));

  return data;
}

/** 
 * Initialization of app.
*/
WEEKDAYS.forEach(weekday => {
  const weekdayElement = document.createElement("li");
  daysOfWeek.appendChild(weekdayElement);
  weekdayElement.innerText = weekday;
});

renderCalendar();
initMonthSelector();
handleDayClick();
checkDuedates();