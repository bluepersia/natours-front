export default function ({type='submit', extraClass='', children, ...restProps})
{
    return (
        <div className={"form__group "+ extraClass}>
            <button type={type} className="btn btn--green" {...restProps}>{children}</button>
        </div>
    )
}