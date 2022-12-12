import React, { useState } from 'react';
import Calendar from 'react-calendar';

import './Calendar.css';

export default function Calendario() {
  const [value, onChange] = useState(new Date());

  return (
    <Calendar onChange={onChange} value={value} calendarType='Hebrew' showNavigation={false} showNeighboringMonth={false}/>
  );
}