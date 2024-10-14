export default function DropdownField({ label, value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex items-stretch border border-purple-500 rounded overflow-hidden mt-1">
        {/* Dropdown Field */}
        <select
          value={value}
          onChange={onChange}
          className="block w-full p-3 bg-gray-100 border-none focus:outline-none" // Same padding and height as InputField
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
