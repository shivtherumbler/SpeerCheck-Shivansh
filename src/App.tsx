import { useState, useEffect, useMemo } from 'react'
import CandidateSelect from './components/CandidateSelect'
import EngineerFilter from './components/EngineerFilter'
import DurationSelect from './components/DurationSelect'
import Calendar from './components/Calendar'
import type { Candidate, Engineer } from './types/types'
import './App.css'

// Utility: Add minutes to a time string (HH:mm)
function addMinutes(time: string, mins: number) {
  const [h, m] = time.split(":").map(Number);
  const date = new Date(2000, 0, 1, h, m + mins);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function App() {
  // --- State ---
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [engineerFilter, setEngineerFilter] = useState('__all__')
  const [duration, setDuration] = useState(30)
  const [scheduled, setScheduled] = useState<{day: string, time: string, engineer: string, duration: number} | null>(null)
  const [lockedSlots, setLockedSlots] = useState<{day: string, time: string}[]>([])

  // --- Effects ---
  useEffect(() => {
    document.title = 'SpeerCheck | Interview Scheduler';
    fetch('/candidates.json')
      .then(res => res.json())
      .then(setCandidates)
    fetch('/engineers.json')
      .then(res => res.json())
      .then(setEngineers)
  }, [])

  // Reset state when selection changes
  useEffect(() => {
    setLockedSlots([])
    setScheduled(null)
  }, [selectedId, engineerFilter, duration])

  // --- Derived values ---
  const selectedCandidate = useMemo(() => candidates.find(c => c.id === selectedId), [candidates, selectedId])
  const filteredEngineers = useMemo(() => {
    if (engineerFilter === '') return [];
    if (engineerFilter === '__all__') return engineers;
    return engineers.filter(e => e.id === engineerFilter);
  }, [engineers, engineerFilter])

  // --- Handlers ---
  // Utility type for slot locking
  type Slot = { day: string; time: string };

  // Find available engineers for a slot
  const getAvailableEngineers = (day: string, time: string) =>
    filteredEngineers.filter(engineer =>
      engineer.availability.some(avail =>
        avail.day === day &&
        time >= avail.start &&
        addMinutes(time, duration) <= avail.end // ensure full duration fits
      )
    );

  // Handles clicking on a calendar slot
  const handleSlotClick = (day: string, time: string) => {
    const available = getAvailableEngineers(day, time);
    if (available.length > 0) {
      setScheduled({ day, time, engineer: available[0].name, duration });
      // Lock all slots covered by the duration
      const slotsToLock: Slot[] = [];
      let currentTime = time;
      for (let mins = 0; mins < duration; mins += 30) {
        slotsToLock.push({ day, time: currentTime });
        currentTime = addMinutes(currentTime, 30);
      }
      setLockedSlots(prev => [...prev, ...slotsToLock]);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-full w-full bg-gray-100 flex items-start justify-center">
      <div className="max-w-5xl w-full p-2 md:p-4">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-blue-700 drop-shadow">SpeerCheck Interview Scheduler</h1>
        <div className="bg-white rounded-lg shadow-lg p-2 md:p-4 mb-4 border border-gray-200 flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Left: Controls */}
          <div className="md:w-2/5 w-full flex flex-col gap-3 justify-start">
            {/* Candidate Dropdown with label */}
            <div className="mb-16">
              <label className="block text-lg font-bold" style={{color: '#111'}}>Candidate</label>
              <CandidateSelect
                candidates={candidates}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            {/* Engineer Dropdown with label */}
            <div className="mb-16">
              <label className="block text-lg font-bold" style={{color: '#111'}}>Engineer</label>
              <EngineerFilter
                engineers={engineers}
                selectedId={engineerFilter}
                onSelect={setEngineerFilter}
              />
            </div>
            {/* Time Slot Dropdown with label */}
            <div className="mb-16">
              <label className="block text-lg font-bold" style={{color: '#111'}}>Time Slot</label>
              <DurationSelect value={duration} onChange={setDuration} />
            </div>
            {/* Preferred availability */}
            {selectedCandidate && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm">
                <span className="font-semibold text-blue-800">Preferred Availability:</span>
                <span className="text-blue-900">{selectedCandidate.preferred.day} {selectedCandidate.preferred.start}–{selectedCandidate.preferred.end}</span>
              </div>
            )}
            {/* Reset button */}
            <div className="flex justify-end mt-1">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow border border-gray-300 transition text-sm"
                onClick={() => { setLockedSlots([]); setScheduled(null); }}
                disabled={!scheduled && lockedSlots.length === 0}
              >
                Reset
              </button>
            </div>
            {/* Confirmation message */}
            {scheduled && (
              <div className="mt-2 p-2 bg-green-50 border border-green-300 rounded-lg text-green-900 shadow text-sm">
                <div className="font-semibold mb-1">Interview Scheduled!</div>
                <div>
                  <span className="font-semibold">Candidate:</span> {selectedCandidate?.name}<br />
                  <span className="font-semibold">Engineer:</span> {scheduled.engineer}<br />
                  <span className="font-semibold">Day:</span> {scheduled.day}, <span className="font-semibold">Time:</span> {scheduled.time}<br />
                  <span className="font-semibold">Duration:</span> {scheduled.duration} min
                </div>
              </div>
            )}
          </div>
          {/* Right: Calendar */}
          <div className="md:w-3/5 w-full flex flex-col items-center justify-center">
            <div className="mb-2 text-lg font-bold" style={{color: '#111'}}>Engineer Slots</div>
            <div className="w-full">
              {/* No warning, just calendar and legend */}
              <Calendar
                engineers={filteredEngineers}
                candidate={selectedCandidate}
                onSlotClick={handleSlotClick}
                lockedSlots={lockedSlots}
                duration={duration}
                showEngineerSlots={!selectedCandidate}
              />
              {/* Legend */}
              <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-green-400 border border-green-700 rounded-sm" style={{backgroundColor:'#22c55e',borderColor:'#15803d'}}></span> <span style={{color:'#111'}}>Overlap</span></div>
                <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-blue-200 border border-blue-400 rounded-sm" style={{backgroundColor:'#60a5fa',borderColor:'#2563eb'}}></span> <span style={{color:'#111'}}>Engineer Available</span></div>
                <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-red-400 border border-red-600 rounded-sm" style={{backgroundColor:'#f87171',borderColor:'#b91c1c'}}></span> <span style={{color:'#111'}}>No Match</span></div>
                <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-gray-300 border border-gray-400 rounded-sm" style={{backgroundColor:'#d1d5db',borderColor:'#6b7280'}}></span> <span style={{color:'#111'}}>Locked</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
