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
  const [showThemeDropdown, setShowThemeDropdown] = useState(false); 
  const [themeColor, setThemeColor] = useState('purple'); 

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
  
  const changeTheme = (backgroundColor, textColor) => {
    setThemeColor(backgroundColor); // Update state with selected color
    document.documentElement.style.setProperty('--primary-bkg', backgroundColor); // Update background color CSS variable
    document.documentElement.style.setProperty('--primary-txt', textColor); // Update text color CSS variable
    setShowThemeDropdown(false); // Close the dropdown after selection
  };

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
		const token = session?.provider_token;
		if (!token) {
			alert("No valid OAuth token found.");
			return;
		}
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
				  Authorization: 'Bearer ' + session.provider_token, // Ensure the token is valid
				  'Content-Type': 'application/json',
				},
				body: JSON.stringify(event),
			  }
			);

			if (response.ok) {
			  alert('Event created successfully!');
			  eventWindow.close();
			} else {
			  const errorData = await response.json();
			  console.error('Failed to create event:', errorData);
			  alert(`Failed to create event: ${errorData.error.message}`);
			}
		  } catch (err) {
			console.error('Error creating event:', err);
			alert(`Error creating event: ${err.message}`);
		  }
		};


        return (
          <div style={{ padding: '20px', fontFamily: 'Arial', color: '#b38add', backgroundColor: '#4c2a56'}}>
            <h2>Add Google Calendar Event</h2>
            <p>Start of your event:</p>
			<DateTimePicker
				onChange={setStart} value={start}
			/>
            <p>End of your event:</p>
            <DateTimePicker 
				onChange={setEnd} value={end}
			/>
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
          <div className="dropdown-container">
            <button
              className="dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Dropdown
            </button>
            {showDropdown && (	
		<div className="dropdown-menu">
		{/* Google Calendar Event Option */}
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    openAddEventWindow();
                  }}
                >
                  Add Google Calendar Event
                </button>
		{/* Divider */}
		<div className="dropdown-divider"></div>
		{/*Sign in Button */}
		<button 
		  className="dropdown-item"
		  onClick={googleSignIn}
		>
		  Sign In With Google
		</button>
		{/* Divider */}
		<div className="dropdown-divider"></div>
		{/*Sign Out Button */}
		<button 
		  className="dropdown-item"
		  onClick={signOut}
		>
		  Google Sign Out 
		</button>
		{/* Divider */}
		<div className="dropdown-divider"></div>
                {/* Theme Color Selection Options */}
				<button
				  className="dropdown-item"
				  onClick={() => setShowThemeDropdown(!showThemeDropdown)} // Toggle theme dropdown
				>
				  Theme
				</button>
				
				{showThemeDropdown && (
				  <div className="theme-dropdown-menu">
					<button
					  className="dropdown-item"
					  onClick={() => changeTheme('#4c2a56', '#b38add')} // Purple theme
					>
					  Purple
					</button>
					<button
					  className="dropdown-item"
					  onClick={() => changeTheme('#150775', '#84a2ff')} // Blue theme
					>
					  Blue
					</button>
					<button
					  className="dropdown-item"
					  onClick={() => changeTheme('#053f1feb', '#16cc55')} // Green theme
					>
					  Green
					</button>
					<button
					  className="dropdown-item"
					  onClick={() => changeTheme('#5f0404eb', '#f18f9d')} // Red theme
					>
					  Red
					</button>
				  </div>
				)}		
              </div>
            )}
          </div> 
		  <div className="left">
            <Calendar />
          </div>
		  
          <div className="right">
            
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

  {/*Footer with developer information*/}	      
  <footer className="developer-banner">
        <div className="developer-info">
          <p>Developed by: OkState CS4273 Group 5</p>
          <p>Contact: Aidan Davenport | aidan.davenport@okstate.edu</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
