import dayjs from "dayjs";

import {
  getStoredEventsDates
} from "./calendar";

export const checkDuedates = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const eventsDates = getStoredEventsDates();

  eventsDates.forEach(day => {
    if (day === today) {
      const message = "You have an event today!";
      createNotification(message);
    }
  });
};

const createNotification = message => {
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(permission => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
};