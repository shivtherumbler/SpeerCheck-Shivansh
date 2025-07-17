import { describe, it, expect } from 'vitest';
import type { Candidate, Engineer } from '../../types/types';

// Helper functions from Calendar.tsx (copy here for test)
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
  if (lockedSlots.some(s => s.day === day && s.time === time)) return false;
  const candidateOk = candidate && day === candidate.preferred.day && isRangeWithin(time, slotEnd, candidate.preferred.start, candidate.preferred.end);
  const engineerOk = engineers.some(e => e.availability.some(a => a.day === day && isRangeWithin(time, slotEnd, a.start, a.end)));
  return candidateOk && engineerOk;
}

describe('isSlotAvailable', () => {
  const candidate: Candidate = {
    id: 'c1',
    name: 'Test',
    preferred: { day: 'Monday', start: '10:00', end: '12:00' }
  };
  const engineers: Engineer[] = [
    {
      id: 'e1',
      name: 'Eng1',
      availability: [
        { day: 'Monday', start: '09:00', end: '11:00' },
        { day: 'Tuesday', start: '10:00', end: '12:00' }
      ]
    }
  ];

  it('returns true for overlapping slot', () => {
    expect(isSlotAvailable('Monday', '10:00', candidate, engineers, 60)).toBe(true);
  });

  it('returns false if candidate not available', () => {
    expect(isSlotAvailable('Monday', '09:00', candidate, engineers, 30)).toBe(false);
  });

  it('returns false if engineer not available', () => {
    expect(isSlotAvailable('Monday', '11:30', candidate, engineers, 30)).toBe(false);
  });

  it('returns false if slot is locked', () => {
    expect(isSlotAvailable('Monday', '10:00', candidate, engineers, 30, [{day: 'Monday', time: '10:00'}])).toBe(false);
  });

  it('returns true for 60min slot if both available', () => {
    expect(isSlotAvailable('Monday', '10:00', candidate, engineers, 60)).toBe(true);
    expect(isSlotAvailable('Monday', '09:30', candidate, engineers, 30)).toBe(false); // candidate only from 10:00
  });
});
