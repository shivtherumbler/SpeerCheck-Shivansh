import React from "react";

interface DurationSelectProps {
  value: number;
  onChange: (val: number) => void;
}

const DurationSelect: React.FC<DurationSelectProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block mb-2 font-semibold">Select Duration:</label>
    <select
      className="border rounded px-3 py-2 w-full"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    >
      <option value={15}>15 minutes</option>
      <option value={30}>30 minutes</option>
      <option value={60}>60 minutes</option>
    </select>
  </div>
);

export default DurationSelect;
