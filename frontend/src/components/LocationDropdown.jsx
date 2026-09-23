import React from "react";
import { CHENNAI_AREAS } from "../constants/locations";

export default function LocationDropdown({ value, onChange, className = "" }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 ${className}`}
    >
      <option value="">All Chennai Areas</option>
      {CHENNAI_AREAS.map((area) => (
        <option key={area} value={area}>
          {area}
        </option>
      ))}
    </select>
  );
}
