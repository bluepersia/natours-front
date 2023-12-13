import URL from '../../utils/URL';
export default function ({user})
{
    return (
        <div className="form__group form__photo-upload"><img className="form__user-photo" src={`${URL}/img/users/${user.photo}`} alt="User photo"/>
            <input className="form__upload" type="file" accept="image/*" id="photo" name="photo"/>
            <label htmlFor="photo">Choose new photo</label>
        </div>
    )
}