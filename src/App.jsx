import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./@/components/ui/dialog";
import { Button } from "./@/components/ui/button";
import { Input } from "./@/components/ui/input";
import { Label } from "./@/components/ui/label";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    id:"",
    title: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [edit, setEdit] = useState(false)

  // Custom date formatting and manipulation functions
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(date)
      .split("/")
      .reverse()
      .join("-");
  };

  const formatMonth = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(date);
  };

  // Get days in month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add previous month's days
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Add current month's days
    for (let date = 1; date <= lastDay.getDate(); date++) {
      days.push(new Date(year, month, date));
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  // Check for event time conflicts
  const hasTimeConflict = (
    newStart,
    newEnd,
    dateStr,
    excludeEventId = null
  ) => {
    const dayEvents = events[dateStr] || [];
    return dayEvents.some((event) => {
      if (excludeEventId && event.id === excludeEventId) return false;
      const eventStart = new Date(`2000-01-01T${event.startTime}`);
      const eventEnd = new Date(`2000-01-01T${event.endTime}`);
      const newStartTime = new Date(`2000-01-01T${newStart}`);
      const newEndTime = new Date(`2000-01-01T${newEnd}`);
      return (
        (newStartTime >= eventStart && newStartTime < eventEnd) ||
        (newEndTime > eventStart && newEndTime <= eventEnd) ||
        (newStartTime <= eventStart && newEndTime >= eventEnd)
      );
    });
  };

  // Navigation handlers
  const handlePreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // Add new event
  const handleAddEvent = () => {
    if (!selectedDate) return;
    const dateStr = formatDate(selectedDate);

    if (hasTimeConflict(newEvent.startTime, newEvent.endTime, dateStr)) {
      alert("Time conflict with existing event!");
      return;
    }

    const eventToAdd = {
      id: Date.now(),
      ...newEvent,
      date: dateStr,
    };

    setEvents((prev) => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), eventToAdd],
    }));

    setNewEvent({ title: "", startTime: "", endTime: "", description: "" });
    setShowEventModal(false);
  };

  // Delete event
  const handleDeleteEvent = (dateStr, eventId) => {
    setEvents((prev) => ({
      ...prev,
      [dateStr]: prev[dateStr].filter((event) => event.id !== eventId),
    }));
  };

  const SubmitEditEvent = ()=>{
    if (!selectedDate) return;
    const dateStr = formatDate(selectedDate);
    const editEvent = events[dateStr].filter((e)=>e.id === newEvent.id)[0]
     
    if(editEvent.startTime !== newEvent.startTime && editEvent.endTime !== newEvent.endTime){
      if (hasTimeConflict(newEvent.startTime, newEvent.endTime, dateStr)) {
        alert("Time conflict with existing event!");
        return;
      }
    }

    const editedEvent = {
      ...newEvent,
      date: dateStr,
    };

    setEvents((prev) => ({
      ...prev,
      [dateStr]: prev[dateStr].map((event) => {
          if(event.id == editedEvent.id){
               event = editedEvent
          }
          return event;
      }),
    }));
    setNewEvent({ title: "", startTime: "", endTime: "", description: "" });
    setShowEventModal(false);
    setEdit(false)
  }

  const handleEditEvent = (dateStr, eventId)=>{
    const editEvent = events[dateStr].filter((e)=>e.id === eventId)[0]
    setNewEvent({
      id: editEvent.id,
      title: editEvent.title,
      startTime: editEvent.startTime,
      endTime: editEvent.endTime,
      description: editEvent.description
    })
    setEdit(true)
    setShowEventModal(true);
  }

  // Filter events based on search term
  const getFilteredEvents = (dateStr) => {
    const dayEvents = events[dateStr] || [];
    if (!searchTerm) return dayEvents;
    return dayEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreviousMonth}>
            ←
          </Button>
          <h2 className="text-xl font-bold">{formatMonth(currentDate)}</h2>
          <Button variant="outline" onClick={handleNextMonth}>
            →
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">🔍</span>
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center font-semibold">
            {day}
          </div>
        ))}

        {getDaysInMonth().map((date) => {
          const dateStr = formatDate(date);
          const dayEvents = getFilteredEvents(dateStr);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();

          return (
            <div
              key={dateStr}
              className={`
                min-h-24 p-2 border rounded-lg cursor-pointer
                ${isToday(date) ? "bg-blue-300" : ""}
                ${
                  selectedDate && isSameDay(date, selectedDate)
                    ? "border-blue-500"
                    : ""
                }
                ${!isCurrentMonth ? "opacity-50" : ""}
                ${
                  date.getDay() === 0 || date.getDay() === 6 ? "bg-gray-50" : ""
                }
              `}
              onClick={() => setSelectedDate(date)}
            >
              <div className="flex justify-between items-start">
                <span className="font-medium">{date.getDate()}</span>
                {dayEvents.length > 0 && (
                  <span className="text-xs bg-blue-500 text-white rounded-full px-2">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 bg-blue-100 rounded truncate"
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Dialog */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-4 right-4"
            onClick={() => selectedDate && setShowEventModal(true)}
            disabled={!selectedDate}
          >
            + Add Event
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Event for {selectedDate ? formatDate(selectedDate) : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Event Title</Label>
              <Input
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter event title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter event description"
              />
            </div>
            <Button onClick={edit?SubmitEditEvent:handleAddEvent} className="w-full">
              {edit? "Edit Event": "Add Event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected Day Events Dialog */}
      {selectedDate && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="fixed bottom-4 left-4">📅 View Events</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Events for {formatDate(selectedDate)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {getFilteredEvents(formatDate(selectedDate)).map((event) => (
                <div key={event.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{event.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEvent(formatDate(selectedDate), event.id)}
                    >
                       ✏️
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDeleteEvent(formatDate(selectedDate), event.id)
                      }
                    >
                      🗑️
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {event.startTime} - {event.endTime}
                  </p>
                  {event.description && (
                    <p className="text-sm">{event.description}</p>
                  )}
                </div>
              ))}
              {getFilteredEvents(formatDate(selectedDate)).length === 0 && (
                <p className="text-center text-gray-500">
                  No events for this day
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Calendar;
