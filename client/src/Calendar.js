import React, { useState, useEffect } from 'react';
import './Calendar.css'; // Make sure the CSS file is updated

const Calendar = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [activeDay, setActiveDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);
  const [eventsArr, setEventsArr] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventTimeFrom, setEventTimeFrom] = useState("");
  const [eventTimeTo, setEventTimeTo] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Update the time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    initCalendar();
  }, [month, year, eventsArr]);

  const initCalendar = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    const daysArr = [];

    // Previous month's days (fill in)
    for (let x = firstDay; x > 0; x--) {
      daysArr.push(
        <div key={`prev-${x}`} className="day prev-date">
          {prevLastDate - x + 1}
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= lastDate; day++) {
      const isToday =
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();
      const eventForDay = eventsArr.some(
        (event) =>
          event.day === day && event.month === month + 1 && event.year === year
      );
      daysArr.push(
        <div
          key={`day-${day}`}
          className={`day ${isToday ? "today" : ""} ${
            eventForDay ? "event" : ""
          }`}
          onClick={() => setActiveDay(day)}
        >
          {day}
        </div>
      );
    }

    // Fill next month's days
    const nextDays = 7 - (daysArr.length % 7);
    for (let j = 1; j <= nextDays; j++) {
      daysArr.push(
        <div key={`next-${j}`} className="day next-date">
          {j}
        </div>
      );
    }

    setDays(daysArr);
  };

  const deleteEvent = (eventToDelete) => {
    const updatedEvents = eventsArr.filter(event => event !== eventToDelete);
    setEventsArr(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };
  


  const prevMonth = () => {
    setMonth(month === 0 ? 11 : month - 1);
    if (month === 0) setYear(year - 1);
  };

  const nextMonth = () => {
    setMonth(month === 11 ? 0 : month + 1);
    if (month === 11) setYear(year + 1);
  };

  const addEvent = () => {
    const newEvent = {
      day: activeDay,
      month: month + 1,
      year: year,
      events: [{ title: eventName, time: `${eventTimeFrom} - ${eventTimeTo}` }],
    };

    const updatedEvents = [...eventsArr, newEvent];
    setEventsArr(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    setEventName("");
    setEventTimeFrom("");
    setEventTimeTo("");
    setShowEventForm(false);
  };

  const getWeekEvents = () => {
    const today = new Date();
    const firstDayOfWeek = today.getDate() - today.getDay(); // Get first day of the week
    const lastDayOfWeek = firstDayOfWeek + 6; // Get last day of the week

    return eventsArr.filter(
      (event) =>
        event.day >= firstDayOfWeek &&
        event.day <= lastDayOfWeek &&
        event.month === month + 1 &&
        event.year === year
    );
  };

  const getMonthEvents = () => {
    return eventsArr.filter(
      (event) => event.month === month + 1 && event.year === year
    );
  };

  return (
    <div className="container">
      {/* Left Panel (Calendar) */}
      <div className="left">
        <div className="calendar">
          <div className="month">
            <i className="fas fa-angle-left prev" onClick={prevMonth}></i>
            <div className="date">{months[month]} {year}</div>
            <i className="fas fa-angle-right next" onClick={nextMonth}></i>
          </div>

          <div className="weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="days">
            {days}
          </div>

          <div className="goto-today">
            <div className="goto">
              <input type="text" placeholder="mm/yyyy" className="date-input" />
              <button className="goto-btn" onClick={() => initCalendar()}>Go</button>
            </div>
            <button className="today-btn" onClick={() => {
              setMonth(new Date().getMonth());
              setYear(new Date().getFullYear());
            }}>Today</button>
          </div>
        </div>
      </div>

      {/* Right Panel (Event Details) */}
      <div className="right">
        <div className="today-date">
          <div className="event-day">{new Date(year, month, activeDay).toLocaleString('en-us', { weekday: 'long' })}</div>
          <div className="event-date">{activeDay} {months[month]} {year}</div>
        </div>
        <div id="current-time">Current Time: <span>{currentTime}</span></div>

        <div className="event-dropdowns">
          <div className="dropdown">
            <button className="dropbtn">Upcoming Events This Week</button>
            <div className="dropdown-content">
              {getWeekEvents().map((event, index) => (
                <div key={index}>{event.day} {months[event.month - 1]}: {event.events[0].title} ({event.events[0].time})</div>
              ))}
            </div>
          </div>

          <div className="dropdown">
            <button className="dropbtn">Upcoming Events This Month</button>
            <div className="dropdown-content">
              {getMonthEvents().map((event, index) => (
                <div key={index}>{event.day} {months[event.month - 1]}: {event.events[0].title} ({event.events[0].time})</div>
              ))}
            </div>
          </div>
        </div>

        <div className="events">
          {eventsArr.filter(event => event.day === activeDay && event.month === month + 1 && event.year === year).map((event, index) => (
            <div key={index} className="event">
              <div className="title">
                <i className="fas fa-circle"></i>
                <h3 className="event-title">{event.events[0].title}</h3>
              </div>
              <div className="event-time">
                <span className="event-time">{event.events[0].time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Event Form */}
        {showEventForm && (
          <div className="add-event-wrapper">
            <div className="add-event-header">
              <div className="title">Add Event</div>
              <i className="fas fa-times close" onClick={() => setShowEventForm(false)}></i>
            </div>
            <div className="add-event-body">
              <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
              <input type="text" placeholder="Event Time From" value={eventTimeFrom} onChange={(e) => setEventTimeFrom(e.target.value)} />
              <input type="text" placeholder="Event Time To" value={eventTimeTo} onChange={(e) => setEventTimeTo(e.target.value)} />
            </div>
            <div className="add-event-footer">
              <button className="add-event-btn" onClick={addEvent}>Add Event</button>
            </div>
          </div>
        )}

        {/* Add Event Button */}
        <button className="add-event" onClick={() => setShowEventForm(true)}>
          <i className="fas fa-plus">Create event</i>
        </button>
      </div>
    </div>
  );
};

export default Calendar;
