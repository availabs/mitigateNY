import React from "react";
export const ButtonSelector = ({label, types, type, setType, size='small'}) => {
    return (
        <div className='flex'>
            <div className='flex-1' />
            <div className={'my-1 flex'}>
                <div className={'p-2 pl-0'}>{label}</div>
                <span className={`isolate inline-flex rounded-md shadow-sm ${size === 'large' && `w-full`}`}>
                {
                    types.map((t, i) => (
                        <button
                            type="button"
                            key={i}
                            className={`
                            ${i !== 0 && `-ml-px`} 
                            ${i === 0 && `rounded-l-md`}
                            ${i === types.length - 1 && `rounded-r-md`}
                            ${(t?.value || t) === type ? `bg-blue-100` : `bg-white`}
                            min-w-[60px] min-h-[30px] uppercase
                            w-full
                            relative inline-flex items-center px-2 text-xs items-center justify-center text-center 
                             text-gray-700 ring-1 ring-inset ring-blue-300 hover:bg-blue-100 focus:z-10`}
                            onClick={() => setType(t?.value || t)}
                        >
                            {t?.label || t}
                        </button>
                    ))
                }
                </span>
            </div>
        </div>
    )
}