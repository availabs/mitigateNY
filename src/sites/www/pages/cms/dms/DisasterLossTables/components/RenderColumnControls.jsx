export const RenderColumnControls = ({cols, filters, setFilters}) => {
    return (
        <div className={'flex space-between'}>
            {
                cols.map((c, i) => (
                    <div className={'flex flex-col p-1'}>
                        <label>{c} Filter: </label>
                        <select
                            className={'p-1 bg-blue-100'}
                            value={i===0 ? 'text' : filters[c]}
                            onChange={e => setFilters({...filters, ...{[c]: e.target.value}})}
                            disabled={i === 0}
                        >
                            <option value={null}>None</option>
                            <option value={'text'}>Text</option>
                        </select>
                    </div>
                ))
            }
        </div>
    )
}