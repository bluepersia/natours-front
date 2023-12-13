export default function ({id, label, extraClass="", ...restProps})
{
    return (
        <div className="form__group">
            <label className="form__label" htmlFor={id}>Review</label>
            <textarea id={id} className="form__input" {...restProps}></textarea>
        </div>
    )
}