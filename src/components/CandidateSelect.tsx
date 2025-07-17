import React from "react";
import type { Candidate } from "../types/types";

interface CandidateSelectProps {
  candidates: Candidate[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const CandidateSelect: React.FC<CandidateSelectProps> = ({ candidates, selectedId, onSelect }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">Select Candidate:</label>
      <select
        className="border rounded px-3 py-2 w-full"
        value={selectedId}
        onChange={e => onSelect(e.target.value)}
      >
        <option value="">-- Choose --</option>
        {candidates.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
};

export default CandidateSelect;
