import url from '../utils/URL';
import {Link} from 'react-router-dom';
export default function ({tours})
{
    return (
        <main className ='main'>
          <div className ='card-container'>
            {tours && tours.map (tour => {
              return (
                <Link key={tour.id} className='card' to={`/tour/${tour.id}`}>
                  <div className='card__header'>
                    <div className='card__picture'>
                      <div className='card__picture-overlay'>
                        <img className='card__picture-img' src={`${url}/img/tours/${tour.imageCover}`} alt={tour.name} />
                      </div>
                    </div>
                    <h3 className='heading-tertirary'>
                      <span>{tour.name}</span>
                    </h3>
                </div>
                <div className='card__details'>
                    <h4 className='card__sub-heading'>{tour.difficulty} {tour.duration}-day tour</h4>
                      <p className='card__text'>{tour.summary}</p>
                      <div className='card__data'>
                        <svg className='card__icon' xlinkHref={`${url}/img/icons.svg#icon-map-pin`} />
                        <span>{tour.startLocation.description}</span>
                      </div>
                      <div className='card__data'>
                        <svg className='card__icon' xlinkHref={`${url}/img/icons.svg#icon-calendar`} />
                        <span>{new Date (tour.startDates[0]).toLocaleString('en-us', {month: 'long', year: 'numeric'})}</span>
                      </div>
                      <div className='card__data'>
                        <svg className='card__icon' xlinkHref={`${url}/img/icons.svg#icon-flag`} />
                        <span>{`${tour.locations.length} stops`}</span>
                      </div>
                      <div className='card__data'>
                        <svg className='card__icon' xlinkHref={`${url}/img/icons.svg#icon-user`} />
                        <span>{tour.maxGroupSize} people</span>
                      </div>
                </div>
                <div className='card__footer'>
                    <p>
                      <span className='card__footer-value'>${tour.price}</span>
                      
                      <span className='card__footer-text'> per person</span>
                    </p>
                    <p className='card__ratings'>
                      <span className='card__footer-value'>{tour.ratingsAverage}</span>
                      
                      <span className='card__footer-text'> rating ({tour.ratingsQuantity})</span>
                    </p>
                    <Link className='btn btn--green btn--small' to={`/tour/${tour.id}`}>Details</Link>
                </div>
              </Link>
              )
            })}
          </div>
        </main>
      )
}