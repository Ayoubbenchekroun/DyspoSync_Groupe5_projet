import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css"; // Import CSS file here
import { format, parse, startOfWeek, getDay } from "date-fns";

const locales = {
  "fr": require("date-fns/locale/fr"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const availabilities = [];

function App() {
  const [newAvailability, setNewAvailability] = useState({
    lastName: "",
    firstName: "",
    email: "",
    position: "",
    dayOfWeek: undefined,
    timeSlots: [], // Store time slots as an array
  });

  const [checkAvailabilityData, setCheckAvailabilityData] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  function handleAddAvailability() {
    const { lastName, firstName, email, position, dayOfWeek, timeSlots } = newAvailability;
    if (!lastName || !firstName || !email || !position || !dayOfWeek || timeSlots.length === 0) {
      alert("Veuillez remplir tous les champs et ajouter au moins un créneau horaire.");
      return;
    }

    // Store the new availability entry
    availabilities.push(newAvailability);

    // Clear the form fields after adding availability
    setNewAvailability({
      lastName: "",
      firstName: "",
      email: "",
      position: "",
      dayOfWeek: undefined,
      timeSlots: [],
    });
  }

  function handleDeletePersonAvailabilities(lastName, firstName, email, position) {
    const filteredAvailabilities = availabilities.filter((availability) => {
      // Check if the availability matches the provided details
      return (
        availability.lastName === lastName &&
        availability.firstName === firstName &&
        availability.email === email &&
        availability.position === position
      );
    });

    // Remove all availabilities for the person
    filteredAvailabilities.forEach((availability) => {
      const index = availabilities.indexOf(availability);
      if (index !== -1) {
        availabilities.splice(index, 1);
      }
    });

    // Refresh the UI by forcing re-render
    setNewAvailability({ ...newAvailability });
  }

  function checkAvailability() {
    const { date, startTime, endTime } = checkAvailabilityData;
  
    const filteredAvailabilities = availabilities.filter((availability) => {
      // Check if the provided time range overlaps with the availability slot
      return availability.timeSlots.some(slot => {
        return (
          (slot.startTime <= startTime && slot.endTime >= startTime) || // Start time overlaps
          (slot.startTime <= endTime && slot.endTime >= endTime) ||     // End time overlaps
          (slot.startTime >= startTime && slot.endTime <= endTime)      // Time range falls within the availability slot
        );
      });
    });
  
    if (filteredAvailabilities.length > 0) {
      const availableEmployees = filteredAvailabilities
          .map((availability) => `${availability.lastName} ${availability.firstName}`)
          .join(", ");
      alert(`Employés disponibles à ce moment : ${availableEmployees}`);
    } else {
      alert("Aucun employé disponible à ce moment.");
    }
  }

  return (
    <div className="App">
      <h1>DispoSync :  Gérez vos disponibilités en toute simplicité</h1>
      <h2>Ajouter la disponibilité d'un employé</h2>
      <div className="container">
        <div className="form-section">
          <input
            type="text"
            placeholder="Nom de famille"
            value={newAvailability.lastName}
            onChange={(e) =>
              setNewAvailability({ ...newAvailability, lastName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Prénom"
            value={newAvailability.firstName}
            onChange={(e) =>
              setNewAvailability({ ...newAvailability, firstName: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={newAvailability.email}
            onChange={(e) =>
              setNewAvailability({ ...newAvailability, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Poste"
            value={newAvailability.position}
            onChange={(e) =>
              setNewAvailability({ ...newAvailability, position: e.target.value })
            }
          />
          <select
            value={newAvailability.dayOfWeek}
            onChange={(e) =>
              setNewAvailability({ ...newAvailability, dayOfWeek: parseInt(e.target.value) })
            }
          >
            <option value="">Sélectionnez le jour de la semaine</option>
            <option value="1">Lundi</option>
            <option value="2">Mardi</option>
            <option value="3">Mercredi</option>
            <option value="4">Jeudi</option>
            <option value="5">Vendredi</option>
          </select>
          <button onClick={() => setNewAvailability({ ...newAvailability, timeSlots: [...newAvailability.timeSlots, { startTime: "", endTime: "" }] })}>Ajouter une plage horaire</button>
          {newAvailability.timeSlots.map((slot, index) => (
            <div key={index}>
              <DatePicker
                placeholderText="Heure de début"
                selected={slot.startTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Heure"
                dateFormat="h:mm aa"
                minTime={new Date().setHours(8, 0)}
                maxTime={new Date().setHours(17, 0)}
                onChange={(startTime) =>
                  setNewAvailability({
                    ...newAvailability,
                    timeSlots: newAvailability.timeSlots.map((s, i) =>
                      i === index ? { ...s, startTime } : s
                    ),
                  })
                }
              />
              <DatePicker
                placeholderText="Heure de fin"
                selected={slot.endTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Heure"
                dateFormat="h:mm aa"
                minTime={new Date().setHours(8, 0)}
                maxTime={new Date().setHours(17, 0)}
                onChange={(endTime) =>
                  setNewAvailability({
                    ...newAvailability,
                    timeSlots: newAvailability.timeSlots.map((s, i) =>
                      i === index ? { ...s, endTime } : s
                    ),
                  })
                }
              />
            </div>
          ))}
          <button onClick={handleAddAvailability}>Ajouter la disponibilité</button>
        </div>
      </div>
      <h2>Vérifier la disponibilité d'un employé</h2>
      <div className="container">
        <div className="form-section">
          <DatePicker
            placeholderText="Date"
            selected={checkAvailabilityData.date}
            onChange={(date) => setCheckAvailabilityData({ ...checkAvailabilityData, date })}
          />
          <DatePicker
            placeholderText="Heure de début"
            selected={checkAvailabilityData.startTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Heure"
            dateFormat="h:mm aa"
            minTime={new Date().setHours(8, 0)}
            maxTime={new Date().setHours(17, 0)}
            onChange={(startTime) =>
              setCheckAvailabilityData({ ...checkAvailabilityData, startTime })
            }
          />
          <DatePicker
            placeholderText="Heure de fin"
            selected={checkAvailabilityData.endTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Heure"
            dateFormat="h:mm aa"
            minTime={new Date().setHours(8, 0)}
            maxTime={new Date().setHours(17, 0)}
            onChange={(endTime) =>
              setCheckAvailabilityData({ ...checkAvailabilityData, endTime })
            }
          />
          <button onClick={checkAvailability}>Vérifier la disponibilité</button>
        </div>
      </div>
      <h2>Supprimer les disponibilités d'une personne</h2>
      <div className="container">
        <div className="form-section">
          <input
            type="text"
            placeholder="Nom de famille"
            value={newAvailability.lastName}
            onChange={(e) =>
              setNewAvailability({ ...newAvailability, lastName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Prénom"
            value={newAvailability.firstName}
            onChange={(e) =>
              setNewAvailability({ ...newAvailability, firstName: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={newAvailability.email}
            onChange={(e) =>
              setNewAvailability({ ...newAvailability, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Poste"
            value={newAvailability.position}
            onChange={(e) =>
              setNewAvailability({ ...newAvailability, position: e.target.value })
            }
          />
          <button onClick={() => handleDeletePersonAvailabilities(newAvailability.lastName, newAvailability.firstName, newAvailability.email, newAvailability.position)}>Supprimer les disponibilités de la personne</button>
        </div>
      </div>
      <h2>Disponibilités</h2>
      <div>
        {availabilities.map((availability, index) => (
          <div key={index}>
            <p>{availability.lastName} {availability.firstName} - {availability.position} ({availability.timeSlots.map(slot => `${format(slot.startTime, 'h:mm aa')} - ${format(slot.endTime, 'h:mm aa')}`).join(", ")})</p>
          </div>
        ))}
      </div>
      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={availabilities.flatMap(event => {
          const { timeSlots, dayOfWeek, lastName, firstName, position } = event;
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const startDate = new Date(currentYear, 0, 1); // January 1st of the current year
          const endDate = new Date(currentYear, 11, 31); // December 31st of the current year
          const events = [];

          for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            if (getDay(date) === dayOfWeek) {
              timeSlots.forEach(slot => {
                events.push({
                  ...event,
                  startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), slot.startTime.getHours(), slot.startTime.getMinutes()),
                  endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), slot.endTime.getHours(), slot.endTime.getMinutes()),
                  title: `${lastName} ${firstName} - ${position} (${format(slot.startTime, 'h:mm aa')} - ${format(slot.endTime, 'h:mm aa')})`
                });
              });
            }
          }

          return events;
        })}
        startAccessor={(event) => event.startTime}
        endAccessor={(event) => event.endTime}
        style={{ height: 500, margin: "50px" }}
        eventPropGetter={(event) => ({
          style: {
            fontSize: '10px' // Adjust the font size here
          }
        })}
      />
    </div>
  );
}

export default App;
