export default function LocationDropdown({ value, onChange }) {
  return (
    <select value={value} onChange={onChange} className="border p-2 rounded-lg">
      <option value="">All Locations</option>
      <option value="Chennai">Chennai</option>
      <option value="Bangalore">Bangalore</option>
      <option value="Coimbatore">Coimbatore</option>
    </select>
  );
}