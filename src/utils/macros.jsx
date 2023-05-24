import get from "lodash/get";

export const isJson = (str)  => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const HoverComp = ({ data, keys, indexFormat, keyFormat, valueFormat }) => {
    return (
        <div className={`
      flex flex-col px-2 pt-1 rounded bg-white
      ${keys.length <= 1 ? "pb-2" : "pb-1"}`}>
            <div className="font-bold text-lg leading-6 border-b-2 mb-1 pl-2">
                {indexFormat(get(data, "index", null))}
            </div>
            {keys.slice()
                // .filter(k => get(data, ["data", k], 0) > 0)
                .filter(key => data.key === key)
                .reverse().map(key => (
                    <div key={key} className={`
            flex items-center px-2 border-2 rounded transition
            ${data.key === key ? "border-current" : "border-transparent"}
          `}>
                        <div className="mr-2 rounded-sm color-square w-5 h-5"
                             style={{
                                 backgroundColor: get(data, ["barValues", key, "color"], null),
                                 opacity: data.key === key ? 1 : 0.2
                             }} />
                        <div className="mr-4">
                            {keyFormat(key)}:
                        </div>
                        <div className="text-right flex-1">
                            {valueFormat(get(data, ["data", key], 0))}
                        </div>
                    </div>
                ))
            }
            {keys.length <= 1 ? null :
                <div className="flex pr-2">
                    <div className="w-5 mr-2" />
                    <div className="mr-4 pl-2">
                        Total:
                    </div>
                    <div className="flex-1 text-right">
                        {valueFormat(keys.reduce((a, c) => a + get(data, ["data", c], 0), 0))}
                    </div>
                </div>
            }
        </div>
    );
};

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
