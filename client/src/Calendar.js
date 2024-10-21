import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 
    'August', 'September', 'October', 'November', 'December'
  ];

  const [activeDay, setActiveDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);

  // Initialize Calendar when month or year changes
  useEffect(() => {
    initCalendar();
  }, [month, year]);

  const initCalendar = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const daysArr = [];

    // Add blank days from the previous month to align the first day
    for (let i = 0; i < firstDay; i++) {
      daysArr.push(<div key={`prev-${i}`} className="day prev-date"></div>);
    }

    // Add days of the current month
    for (let day = 1; day <= lastDate; day++) {
      daysArr.push(
        <div
          key={`day-${day}`}
          className={`day ${day === activeDay ? 'active' : ''}`}
          onClick={() => setActiveDay(day)}
        >
          {day}
        </div>
      );
    }

    setDays(daysArr);
  };

  const prevMonth = () => {
    setMonth(month === 0 ? 11 : month - 1);
    if (month === 0) setYear(year - 1);
  };

  const nextMonth = () => {
    setMonth(month === 11 ? 0 : month + 1);
    if (month === 11) setYear(year + 1);
  };

  return (
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
        <button className="today-btn" onClick={() => {
          setMonth(new Date().getMonth());
          setYear(new Date().getFullYear());
        }}>Today</button>
      </div>
    </div>
  );
};

export default Calendar;
