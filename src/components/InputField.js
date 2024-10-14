export default function InputField({
  label, value, onChange, type = "text", readOnly = false, step, min, unit, units = [], onUnitChange
}) {
  // Style for calculated (read-only) fields
  const calculatedFieldStyle = readOnly
    ? "bg-purple-100 text-purple-700 border-purple-500"
    : "bg-white border-purple-500";

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium">{label}</label>
      <div className={`flex items-stretch border ${calculatedFieldStyle} rounded overflow-hidden mt-1`}>
        {/* Input Field */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`block w-full p-3 focus:outline-none ${readOnly ? "cursor-not-allowed bg-purple-100 text-purple-700" : ""}`} 
          step={step}
          min={min}
          readOnly={readOnly}
        />
        {/* Unit Selector Dropdown */}
        {unit && (
          <select
            value={unit}
            onChange={onUnitChange}
            className={`block p-3 bg-gray-100 focus:outline-none ${readOnly ? 'bg-purple-100 text-purple-700' : ''}`} 
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
