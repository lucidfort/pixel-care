"use client";

import moment from "moment";
import { useState, useEffect } from "react";
import {
  Calendar,
  Event,
  momentLocalizer,
  View,
  Views,
} from "react-big-calendar";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const ScheduleCalendar = ({ event }: { event: Event[] }) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [events, setEvents] = useState<Event[] | undefined>([]);

  useEffect(() => {
    setEvents(event);
  }, [event]);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      defaultView="week"
      events={events}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      onView={handleOnChangeView}
      min={new Date(2025, 1, 0, 7, 0, 0)}
      max={new Date(2025, 1, 0, 18, 0, 0)}
    />
  );
};

export default ScheduleCalendar;
