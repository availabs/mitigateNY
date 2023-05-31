export const RenderColumnControls = ({cols, filters, setFilters}) => {
    return (
        <div className={'flex flex-col sm:flex-row space-between'}>
            {
                cols.map((c, i) => (
                    <div className={'flex flex-col justify-between p-1 border border-dashed border-blue-300 rounded-md w-[500px]'}>
                        <div className={'font-normal'}>{c}</div>
                        <div className={'w-full'}>
                            <label className={'align-bottom'}> Filter: </label>
                            <select
                                className={'p-1 bg-white rounded-md align-bottom w-full'}
                                value={i===0 ? 'text' : filters[c]}
                                onChange={e => setFilters({...filters, ...{[c]: e.target.value}})}
                                disabled={i === 0}
                            >
                                <option value={null}>None</option>
                                <option value={'text'}>Text</option>
                            </select>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}