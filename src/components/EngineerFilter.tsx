import React from "react";
import type { Engineer } from "../types/types";

interface EngineerFilterProps {
  engineers: Engineer[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const EngineerFilter: React.FC<EngineerFilterProps> = ({ engineers, selectedId, onSelect }) => (
  <div className="mb-4 relative z-20">
    <label className="block mb-2 font-semibold">Filter by Engineer:</label>
    <select
      className="border rounded px-3 py-2 w-full z-10 relative"
      value={selectedId}
      onChange={e => onSelect(e.target.value)}
    >
      <option value="">-- Choose --</option>
      {engineers.map(e => (
        <option key={e.id} value={e.id}>{e.name}</option>
      ))}
      <option value="__all__">-- All Engineers --</option>

    </select>
  </div>
);

export default EngineerFilter;
