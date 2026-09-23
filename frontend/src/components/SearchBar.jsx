export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search by name"
      className="border p-3 rounded-lg w-full shadow-sm"
      value={value}
      onChange={onChange}
    />
  );
}