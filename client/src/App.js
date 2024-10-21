import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import { useState } from 'react';
import Calendar from './Calendar'; // Import your Calendar component
import Weather from './Weather'; // Import Weather component

function App() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to Supabase
  const { isLoading } = useSessionContext();

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

  async function createCalendarEvent() {
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

    await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + session.provider_token,
      },
      body: JSON.stringify(event),
    })
      .then((data) => data.json())
      .then((data) => {
        alert('Event created, check your Google Calendar');
      })
      .catch((err) => console.error('Error creating event', err));
  }

  return (
    <div className="App">
      <div style={{ width: '400px', margin: '30px auto' }}>
        {session ? (
          <>
            <h2>Hey there {session.user.email}</h2>

            {/* Google Calendar Event Creation Form */}
            <p>Start of your event</p>
            <DateTimePicker onChange={setStart} value={start} />
            <p>End of your event</p>
            <DateTimePicker onChange={setEnd} value={end} />
            <p>Event name</p>
            <input type="text" onChange={(e) => setEventName(e.target.value)} />
            <p>Event description</p>
            <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
            <hr />
            <button onClick={createCalendarEvent}>Create Google Calendar Event</button>
            <button onClick={signOut}>Sign out</button>

            {/* Embed the Calendar Component */}
            <Calendar />

            {/* Embed the Weather Component */}
            <Weather />
          </>
        ) : (
          <button onClick={googleSignIn}>Sign In With Google</button>
        )}
      </div>
    </div>
  );
}

export default App;















// import logo from './logo.svg';
// import './App.css';
// import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
// import DateTimePicker from 'react-datetime-picker';
// import {useState} from 'react';

// function App() {
//   const [start, setStart] = useState(new Date());
//   const [end, setEnd] = useState(new Date());
//   const [eventName, setEventName] = useState('');
//   const [eventDescription, setEventDescription] = useState('');



//   const session = useSession(); //tokens, when session exists we have a user
//   const supabase = useSupabaseClient(); // talk to supabase
//   const {isLoading} = useSessionContext();

//   if (isLoading) {
//     return <></>
//   }

//   async function googleSignIn(){
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         scopes: 'https://www.googleapis.com/auth/calendar'
//       }
//     });
//     if(error) {
//       alert('Error logging in to Google provider with supabase');
//       console.log(error);
//     }
//   }

//   async function signOut(){
//     await supabase.auth.signOut();
//   }


//   async function createCalendarEvent() {
//     console.log("creating calendar event");
//     const event = {
//       'summary': eventName,
//       'description': eventDescription,
//       'start': {
//         'dateTime': start.toISOString(),
//         'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
//       },
//       'end': {
//         'dateTime': end.toISOString(),
//         'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
//       }
//     }
//     await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
//       method: "POST",
//       headers: {
//         'Authorization': 'Bearer ' + session.provider_token
//       },
//       body: JSON.stringify(event)
//     }).then((data) => {
//       return data.json();
//     }).then((data) => {
//       console.log(data);
//       alert("Event created, check your Google Calendar");
//     })
//   }


//   console.log(session);
//   console.log(start);
//   console.log(eventName);
//   console.log(eventDescription);


//   return (
//     <div className="App">
//       <div style={{width: '400px', margin: '30px auto'}}>
//         {session ?
//           <>
//             <h2>Hey there {session.user.email}</h2>
//             <p>Start of your event</p>
//             <DateTimePicker onChange={setStart} value={start} />
//             <p>End of your event</p>
//             <DateTimePicker onChange={setEnd} value={end} />
//             <p>Event name</p>
//             <input type = 'text' onChange={(e) => setEventName(e.target.value)} />
//             <p>Event description</p>
//             <input type = 'text' onChange={(e) => setEventDescription(e.target.value)} />
//             <hr />
//             <button onClick={() => createCalendarEvent()}>Create Google Calendar Event</button>
//             <p></p>
//             <button onClick={() => signOut()}>Sign out</button>
//           </>
//           :
//           <>
//             <button onClick={() => googleSignIn()}>Sign In With Google</button>
//           </>
//         }
//       </div>
//     </div>
//   );
// }

// export default App;
