export default function ({id, label, extraClass="", ...restProps})
{
    return (
        <div className={"form__group " + extraClass}>
            <label className="form__label" htmlFor={id}>{label}</label>
            <input id={id} className="form__input" {...restProps}/>
        </div>
    )
}