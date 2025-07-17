// Types for SpeerCheck Interview Scheduler

export type TimeSlot = {
  day: string; // e.g., 'Monday'
  start: string; // e.g., '09:00'
  end: string;   // e.g., '09:30'
};

export type Candidate = {
  id: string;
  name: string;
  preferred: {
    day: string;
    start: string;
    end: string;
  };
};

export type Engineer = {
  id: string;
  name: string;
  availability: TimeSlot[];
};

export type ScheduledInterview = {
  candidateId: string;
  engineerId: string;
  slot: TimeSlot;
  duration: number; // in minutes
};
