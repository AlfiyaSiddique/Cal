export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date).split('/').reverse().join('-');
  };
  
  export const getDaysInMonth = (currentDate) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
  
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
  
    for (let date = 1; date <= lastDay.getDate(); date++) {
      days.push(new Date(year, month, date));
    }
  
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
  
    return days;
  };
  
  export const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  
  export const isToday = (date) => {
    const today = new Date();
    return isSameDay(date, today);
  };
  
  // Fixed time conflict check function
  export const hasTimeConflict = (newStart, newEnd, existingEvents, excludeEventId = null) => {
    // Convert times to minutes for easier comparison
    const getMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
  
    const newStartMins = getMinutes(newStart);
    const newEndMins = getMinutes(newEnd);
  
    return existingEvents.some(event => {
      if (excludeEventId && event.id === excludeEventId) return false;
      
      const eventStartMins = getMinutes(event.startTime);
      const eventEndMins = getMinutes(event.endTime);
  
      return (
        (newStartMins >= eventStartMins && newStartMins < eventEndMins) ||
        (newEndMins > eventStartMins && newEndMins <= eventEndMins) ||
        (newStartMins <= eventStartMins && newEndMins >= eventEndMins)
      );
    });
  };
