import get from "lodash/get";

export const fnumIndex = (d, fractions = 2, currency = false) => {
    if (d >= 1000000000000) {
      return `${currency ? '$' : ``} ${(d / 1000000000000).toFixed(fractions)} T`;
    } else if (d >= 1000000000) {
      return `${currency ? '$' : ``} ${(d / 1000000000).toFixed(fractions)} B`;
    } else if (d >= 1000000) {
      return `${currency ? '$' : ``} ${(d / 1000000).toFixed(fractions)} M`;
    } else if (d >= 1000) {
      return `${currency ? '$' : ``} ${(d / 1000).toFixed(fractions)} K`;
    } else {
      return typeof d === "object" ? `` : `${currency ? '$' : ``} ${parseInt(d)}`;
    }
  }
;

export const fnum = (number, currency = false) => (currency ? '$ ' : '') + parseInt(number).toLocaleString();

export const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  };
  return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : ``;
};

export const range = (start, end) => Array.from({length: (end + 1 - start)}, (v, k) => k + start);

export const RenderVersions = ({ value, setValue, versions, type }) => {
  return (
    <div className="flex justify-between group">
      <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500 py-5">Select {type} version:</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <div className="pt-3 pr-8">
            <select
              className="w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300"
              value={value || ""}
              onChange={e => {
                setValue(e.target.value);
              }}>
              <option value="" disabled key={type}>Select your option</option>
              {(versions.views || versions)
                .sort((a, b) => (b.view_id) - (a.view_id))
                .map(v =>
                  <option
                    key={v.view_id || v}
                    value={v.view_id || v}
                    className={`p-2 ${get(v, ["metadata", "authoritative"]) === "true" ? `font-bold` : ``}`}>
                    {get(v, "version") || v}
                    {v.view_id && ` (${v.view_id || ``} ${formatDate(v._modified_timestamp)})`}
                  </option>)
              }
            </select>
          </div>
        </dd>
      </div>
    </div>
  );
}

export const RenderCheckbox = ({ label, checked, setChecked }) => {
  return (
    <div className="flex justify-between group">
      <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        
        <dt className="text-sm font-medium text-gray-500 py-5">
          {label}
        </dt>

        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <div className="pt-3 pr-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
            </label>
          </div>
        </dd>

      </div>
    </div>
  );
};


export const RenderMultiVersions = ({ value, setValue, versions, type }) => {
  const handleSelect = (e) => {
    const selectedId = parseInt(e.target.value);
    if (!value.includes(selectedId)) {
      setValue([...value, selectedId]);
    }
  };

  const handleRemove = (id) => {
    setValue(value.filter(v => v !== id));
  };

  // Filter out already selected options
  const availableOptions = (versions.views || []).filter(v => !value.includes(v.view_id));

  return (
    <div className="flex justify-between group w-full">
      <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500 py-5">Select {type} versions:</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <div className="flex flex-col gap-2 pt-3 pr-8">
            {/* Selected tags */}
            <div className="flex flex-wrap gap-2 min-h-[38px] p-1">
              {value.map(id => {
                const v = (versions.views || []).find(vv => vv.view_id === id);
                if (!v) return null;
                return (
                  <div key={id} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {get(v, "version") || v.view_id}
                    <button
                      type="button"
                      className="ml-1 font-bold"
                      onClick={() => handleRemove(id)}
                    >×</button>
                  </div>
                );
              })}
            </div>

            {/* Dropdown select */}
            <select
              className="w-full p-2 border border-gray-300 rounded bg-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              onChange={handleSelect}
              value=""
              disabled={availableOptions.length === 0} // disable if nothing left
            >
              <option value="" disabled>
                {availableOptions.length === 0 ? "All selected" : `Select ${type} version`}
              </option>
              {availableOptions
                .sort((a, b) => b.view_id - a.view_id)
                .map(v => (
                  <option key={v.view_id} value={v.view_id}>
                    {get(v, "version") || v.view_id} {v._modified_timestamp ? `(${formatDate(v._modified_timestamp)})` : ""}
                  </option>
                ))}
            </select>
          </div>
        </dd>
      </div>
    </div>
  );
};

export const getType = (source, defaultType) => {
  return source?.categories?.[0]?.[0] ?? defaultType;
}