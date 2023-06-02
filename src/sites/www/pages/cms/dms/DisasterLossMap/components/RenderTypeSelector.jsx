import React from "react";
export const RenderTypeSelector = ({label, types, type, setType}) => {
    return (
        <div className={'my-1 flex'}>
            <div className={'p-2 pl-0'}>{label}</div>
            <span className="isolate inline-flex rounded-md shadow-sm">
            {
                types.map((t, i) => (
                    <button
                        type="button"
                        className={`
                        ${i === 0 && `-ml-px`} 
                        ${t === type ? `bg-blue-100` : `bg-white`}
                        rounded-md min-w-[40px] min-h-[40px] uppercase
                        relative inline-flex items-center  px-3 py-2 text-sm 
                        font-semibold text-blue-900 ring-1 ring-inset ring-blue-300 hover:bg-blue-100 focus:z-10`}
                        onClick={() => setType(t)}
                    >
                        {t}
                    </button>
                ))
            }
    </span>
        </div>
    )
}