import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import React, { useState } from 'react';
import Calendar from './Calendar';
import Weather from './Weather';

function App() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();
  const [showDropdown, setShowDropdown] = useState(false);

  if (isLoading) {
    return <></>; // Loading state
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
      },
    });
    if (error) {
      alert('Error logging in with Google');
      console.error(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const openAddEventWindow = () => {
    const eventWindow = window.open(
      '',
      '_blank',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    if (eventWindow) {
      eventWindow.document.title = 'Add Google Calendar Event';
      eventWindow.document.body.innerHTML = `
        <div id="event-form-root"></div>
      `;

      const ReactDOM = require('react-dom');
      const AddEventForm = () => {
        const [start, setStart] = useState(new Date());
        const [end, setEnd] = useState(new Date());
        const [eventName, setEventName] = useState('');
        const [eventDescription, setEventDescription] = useState('');

        const createCalendarEvent = async () => {
          const event = {
            summary: eventName,
            description: eventDescription,
            start: {
              dateTime: start.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
              dateTime: end.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          };

          try {
            const response = await fetch(
              'https://www.googleapis.com/calendar/v3/calendars/primary/events',
              {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + session.provider_token,
                },
                body: JSON.stringify(event),
              }
            );

            if (response.ok) {
              alert('Event created successfully!');
              eventWindow.close();
            } else {
              alert('Failed to create event. Please check your Google credentials.');
            }
          } catch (err) {
            console.error('Error creating event:', err);
          }
        };

        return (
          <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Add Google Calendar Event</h2>
            <p>Start of your event</p>
            <DateTimePicker onChange={setStart} value={start} />
            <p>End of your event</p>
            <DateTimePicker onChange={setEnd} value={end} />
            <p>Event name</p>
            <input
              type="text"
              onChange={(e) => setEventName(e.target.value)}
              value={eventName}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <p>Event description</p>
            <input
              type="text"
              onChange={(e) => setEventDescription(e.target.value)}
              value={eventDescription}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <button onClick={createCalendarEvent} style={{ padding: '10px 20px', marginRight: '10px' }}>
              Create Event
            </button>
            <button onClick={() => eventWindow.close()} style={{ padding: '10px 20px' }}>
              Close
            </button>
          </div>
        );
      };

      ReactDOM.render(<AddEventForm />, eventWindow.document.getElementById('event-form-root'));
    }
  };

  return (
    <div className="App">
      {session ? (
        <div className="container">
          <div className="left">
            <Calendar />
          </div>
          <div className="right">
            <div className="dropdown-container">
              <button
                className="dropdown-toggle"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Dropdown
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowDropdown(false);
                      openAddEventWindow();
                    }}
                  >
                    Add Google Calendar Event
                  </button>
                </div>
              )}
            </div>
            <div className="weather-section">
              <h1>Current Weather</h1>
              <Weather />
            </div>
          </div>
        </div>
      ) : (
        <div className="login-container">
          <button onClick={googleSignIn}>Sign In With Google</button>
        </div>
      )}
    </div>
  );
}

export default App;