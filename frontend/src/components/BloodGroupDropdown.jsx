export default function BloodGroupDropdown({ value, onChange }) {
  const groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  return (
    <select
      className="border p-3 rounded-lg w-full shadow-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Blood Group</option>
      {groups.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
    </select>
  );
}