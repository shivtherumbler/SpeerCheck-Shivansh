import React from "react";
import type { Engineer, Candidate } from "../types/types";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const START_HOUR = 9;
const END_HOUR = 18;

// Utility to generate time slots
function getTimeSlots() {
  const slots: string[] = [];
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

const timeSlots = getTimeSlots();

function addMinutes(time: string, mins: number) {
  const [h, m] = time.split(":").map(Number);
  const date = new Date(2000, 0, 1, h, m + mins);
  return date.toTimeString().slice(0, 5);
}

function isRangeWithin(start: string, end: string, rangeStart: string, rangeEnd: string) {
  return start >= rangeStart && end <= rangeEnd;
}

function isSlotAvailable(day: string, time: string, candidate?: Candidate, engineers: Engineer[] = [], duration = 30, lockedSlots: {day: string, time: string}[] = []) {
  const slotEnd = addMinutes(time, duration);
  // Check if any slot in the range is locked
  let currentTime = time;
  for (let mins = 0; mins < duration; mins += 30) {
    if (lockedSlots.some(s => s.day === day && s.time === currentTime)) return false;
    currentTime = addMinutes(currentTime, 30);
  }
  // Candidate availability
  const candidateOk = candidate && day === candidate.preferred.day && isRangeWithin(time, slotEnd, candidate.preferred.start, candidate.preferred.end);
  // At least one engineer available
  const engineerOk = engineers.some(e => e.availability.some(a => a.day === day && isRangeWithin(time, slotEnd, a.start, a.end)));
  return candidateOk && engineerOk;
}

// Helper: check if any engineer is available for a slot
function isEngineerAvailable(day: string, time: string, engineers: Engineer[], duration = 30) {
  const slotEnd = addMinutes(time, duration);
  return engineers.some(e =>
    e.availability.some(a => a.day === day && isRangeWithin(time, slotEnd, a.start, a.end))
  );
}

interface CalendarProps {
  engineers: Engineer[];
  candidate?: Candidate;
  onSlotClick?: (day: string, time: string) => void;
  lockedSlots?: { day: string; time: string }[];
  duration?: number;
  showEngineerSlots?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ engineers, candidate, onSlotClick, lockedSlots = [], duration = 30 }) => {
  const showOnlyCandidate = engineers.length === 0;
  return (
    <div className="overflow-x-auto">
      <div className="overflow-hidden rounded-lg shadow-lg border-2 border-black">
        <table className="min-w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="border border-black p-2 bg-gray-100 !text-gray-800"></th>
              {DAYS.map(day => (
                <th key={day} className="border border-black p-2 bg-gray-100 !text-gray-800">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot}>
                <td className="border border-black p-1 bg-gray-50 w-20 text-right pr-2 !text-gray-800 font-mono">{slot}</td>
                {DAYS.map((day) => {
                  const locked = lockedSlots.some(s => s.day === day && s.time === slot);
                  const available = isSlotAvailable(day, slot, candidate, engineers, duration, lockedSlots);
                  const engineerAvailable = isEngineerAvailable(day, slot, engineers, duration);
                  let cellContent = null;
                  let cellClass = "border border-black p-1 cursor-pointer";
                  if (locked) {
                    cellClass += " bg-gray-300";
                    cellContent = <span className="text-red-600">Locked</span>;
                  } else if (showOnlyCandidate && candidate && day === candidate.preferred.day && slot >= candidate.preferred.start && addMinutes(slot, duration) <= candidate.preferred.end) {
                    cellClass += " bg-green-400 hover:bg-green-500";
                  } else if (available) {
                    cellClass += " bg-green-400 hover:bg-green-500";
                  } else if (engineerAvailable) {
                    cellClass += " bg-blue-200 hover:bg-blue-300";
                  } else {
                    cellClass += " bg-white";
                  }
                  return (
                    <td
                      key={day}
                      className={cellClass}
                      onClick={() => !locked && ((showOnlyCandidate && candidate && day === candidate.preferred.day && slot >= candidate.preferred.start && addMinutes(slot, duration) <= candidate.preferred.end) || available) && onSlotClick && onSlotClick(day, slot)}
                      style={{ minWidth: 60, height: 36 }}
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
