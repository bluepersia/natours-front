export default function ({className='login-form', headingClass='ma-bt-lg', formClass='form--login', title, onSubmit, children})
{
    return (
    <div className={className}>
        <h2 className={`heading-secondary ${headingClass}`}>{title}</h2>
        <form className={`form ${formClass}`} onSubmit={onSubmit}>
            {children}
        </form>
    </div>)
}