import { useParams, Link, useLocation, useSearchParams, useNavigate } from "react-router-dom"
import useFetch from "../hooks/useFetch";
import {useRef, useEffect, useState, useContext } from "react";
import URL from "../utils/URL";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import { GlobalContext } from "../App";
import Form from '../components/form';
const stripe = Stripe('pk_test_51OLX2kJuxDXmx7U8586aLgyvEtdvEu9Vn45pn72DPBvbqrGgWWM57K40efg6uxcTeKCWEFIgQkiwGqfiODUZWn5500IHuhIUng')

export default function ()
{
    const {tourId} = useParams ();
    const {data, run} = useFetch ();
    const checkoutFetch = useFetch ();
    const bookFetch = useFetch ();
    const bookingFetch = useFetch ();
    const reviewCreateFetch = useFetch ();
    const reviewFetch = useFetch ();
    const tourLikeFetch = useFetch ();
    const likeFetch = useFetch ();
    const unlikeFetch = useFetch ();
    const [booking, setBooking] = useState (null);
    const {user} = useContext (GlobalContext);
    const [date, setDate] = useState (null);
    const [reviewForm, setReviewForm] = useState({
      review: '',
      rating: 5
    })
    const location = useLocation ();
    const navigate = useNavigate ();
    const [searchParams, setSearchParams] = useSearchParams ();

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(6);  

    mapboxgl.accessToken = 'pk.eyJ1IjoiYmx1ZXBlcnNpYSIsImEiOiJja2VleDU5dHEwNXR6MnNyend3MjRrZ2VkIn0.2_HzTRlfZ_gmXljYxQ4C2g';
    useEffect (() => {
        const url = `${URL}/api/v1/tours/${tourId}`;
        
        run (url);

        if (searchParams.has ('user') && searchParams.has ('tour')&& searchParams.has ('price') && searchParams.has ('date'))
          addBooking ();
    }, [])

    async function addBooking ()
    {
      await bookFetch.run (`${URL}/api/v1/bookings/book`, 'POST', {
        user: searchParams.get ('user'),
        tour: searchParams.get ('tour'),
        price: searchParams.get ('price'),
        date :searchParams.get ('date')
      });
      fetchBooking ();
    }

    useEffect (() =>{
      navigate (location.pathname);
    },[bookFetch.data])

    useEffect (() => 
    {
        fetchBooking ();
        fetchLike();
        fetchReview ();
    }, [])

    useEffect (() =>
    {
      if (bookingFetch.data)
      {
        setBooking (bookingFetch.data.data.booking);
        console.log (bookingFetch.data);
      }

    }, [bookingFetch.data])
    useEffect (() => {
      if (data)
      {
      
        const tour = data.data?.doc;

        if (map.current) return;

        let locations = [tour.startLocation, ...tour.locations];
        locations = locations.map (location => location.coordinates);

        let averages = locations.reduce ((prev, curr) => [prev[0] + curr[0], prev[1] + curr[1]],[0, 0]);
        averages[0] /= locations.length;
        averages[1] /= locations.length;

        map.current = new mapboxgl.Map ({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [averages[0], averages[1]],
          zoom,
          minZoom: 6,
          scrollZoom: false
        })

        for (const location of tour.locations)
        {
            const marker = new mapboxgl.Marker ().setLngLat (location.coordinates).addTo (map.current); 
        }
    
      }
    },[data])

    function handleBookClick ()
    {
      if (date)
        checkoutFetch.run (`${URL}/api/v1/bookings/checkout-session/${tourId}/${date}`);
    }

    useEffect (() =>
    {
      async function run ()
      {
        if (checkoutFetch.data)
        {
          const {session} = checkoutFetch.data;
          console.log (checkoutFetch.data);
          await  stripe.redirectToCheckout ({
            sessionId: session.id
          })
        }
      }
      run ()
    },[checkoutFetch.data])
    

    function handleDateChange ({target})
    {
      setDate (target.value);
    }

    function handleReviewInputChange ({target})
    {
      const {name, value} = target;
      setReviewForm (prev => ({...prev, [name]: value}));
    }

    async function handleReviewSubmit (e)
    {
      e.preventDefault ();

      try {
        const res = await fetch (`${URL}/api/v1/reviews`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify ({...reviewForm, tour: tourId}),
          credentials: 'include'
        })

        if (!res.ok)
          throw Error (res.statusText);

        fetchReview ();
      }
      catch(err)
      {
        console.error(err);
      }
    }

    function fetchBooking ()
    {
      bookingFetch.run (`${URL}/api/v1/bookings/my-booking/${tourId}`);
    }

    function fetchReview ()
    {
        reviewFetch.run (`${URL}/api/v1/reviews/mine-for-tour/${tourId}`);
    }

    
    function fetchLike ()
    {
      tourLikeFetch.run (`${URL}/api/v1/likes/for-tour/${tourId}`);
    }

    async function like ()
    {
      await likeFetch.run (`${URL}/api/v1/likes`, 'post', {tour: tourId})
      fetchLike ();
    }

    async function dislike ()
    {
      await unlikeFetch.run (`${URL}/api/v1/likes/${tourLikeFetch.data.data.like._id}`, 'delete');
      fetchLike ();
    }


    const tour = data?.data.doc || null;

    let dates = [];
    let soldOut = false;
    if (tour)
    {
      for (const startDate of tour.startDates)
      {
          const start = tour.starts.find (start => start.date == startDate);
          if (!start || !start.soldOut)
            dates.push (new Date(startDate))
      }
      if (tour.starts.length >= tour.startDates)
      {
        soldOut = true;
        for (const start of tour.starts) 
        {
          if (!start.soldOut)
          {
            soldOut = false;
            break;
          }
        }
      }
      
  }



    return tour && (<>
        <section className="section-header">
            <div className="header__hero">
                <div className="header__hero-overlay">
                    &nbsp;
                </div>
                <img className="header__hero-img" src={`${URL}/img/tours/${tour.imageCover}`}/>
            </div>
      <div className="heading-box">
        <h1 className="heading-primary">
          {tour.name}
        </h1>
        <div className="heading-box__group">
          <div className="heading-box__detail">
            <svg className="heading-box__icon">
              <use xlinkHref="../src/img/icons.svg#icon-clock"></use>
            </svg>
            <span className="heading-box__text">{tour.locations[tour.locations.length - 1].day} days</span>
          </div>
          <div className="heading-box__detail">
            <svg className="heading-box__icon">
              <use xlinkHref="../src/img/icons.svg#icon-map-pin"></use>
            </svg>
            <span className="heading-box__text">{tour.startLocation.description}</span>
          </div>
          <div className="heading-box__detail">
           {tourLikeFetch.data && tourLikeFetch.data.data.like ? <i onClick={dislike} className="fa-solid fa-heart"></i> : <i onClick={like} className="fa-regular fa-heart"></i>}
          </div>
        </div>
      </div>
    </section>

    <section className="section-description">
      <div className="overview-box">
        <div>
          <div className="overview-box__group">
            <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
            <div className="overview-box__detail">
              <svg className="overview-box__icon">
                <use crossOrigin="user-credentials" xlinkHref="../src/img/icons.svg#icon-calendar"></use>
              </svg>
              <span className="overview-box__label">Next date</span>
              <span className="overview-box__text">{new Date(tour.startDates[0]).toLocaleString('en-us', {month: 'long', year: 'numeric'})}</span>
            </div>
            <div className="overview-box__detail">
              <svg className="overview-box__icon">
                <use xlinkHref="../src/img/icons.svg#icon-trending-up"></use>
              </svg>
              <span className="overview-box__label">Difficulty</span>
              <span className="overview-box__text">{tour.difficulty}</span>
            </div>
            <div className="overview-box__detail">
              <svg className="overview-box__icon">
                <use xlinkHref="../src/img/icons.svg#icon-user"></use>
              </svg>
              <span className="overview-box__label">Participants</span>
              <span className="overview-box__text">{tour.maxGroupSize} people</span>
            </div>
            <div className="overview-box__detail">
              <svg className="overview-box__icon">
                <use xlinkHref="../src/img/icons.svg#icon-star"></use>
              </svg>
              <span className="overview-box__label">Rating</span>
              <span className="overview-box__text">{tour.ratingsAverage}/ 5</span>
            </div>
          </div>

          <div className="overview-box__group">
            <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
            {tour.guides.map ((guide,index) => (
                <div key={index} className="overview-box__detail">
                    <img
                    src={`${URL}/img/users/${guide.photo}`}
                    alt={guide.role}
                    className="overview-box__img"
                    />
                    <span className="overview-box__label">{guide.role.replace ('-', ' ')}</span>
                    <span className="overview-box__text">{guide.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="description-box">
        <h2 className="heading-secondary ma-bt-lg">About {tour.name} tour</h2>
        <p className="description__text">
          {tour.description}
        </p>
      </div>
    </section>

    <section className="section-pictures">
        {tour.images.map ((img, index) => (
            <div key={index} className="picture-box">
                <img
                className={`picture-box__img picture-box__img--${index + 1}`}
                src={`${URL}/img/tours/${img}`}
                alt={`${tour.name} Tour ${index + 1}`}
                />
          </div>
        ))}
    </section>

    <section className="section-map">
      <div id="map" ref={mapContainer}></div>
    </section>

    <section className="section-reviews">
      <div className="reviews">
      {tour.reviews.map (({user, review, rating}, index) => (
        <div key={index} className="reviews__card">
        <div className="reviews__avatar">
          <img
            src={`${URL}/img/users/${user.photo}`}
            alt={user.name}
            className="reviews__avatar-img"
          />
          <h6 className="reviews__user">{user.name}</h6>
        </div>
        <p className="reviews__text">
          {review}
        </p>
        <div className="reviews__rating">
          <svg className={`reviews__star ${rating >= 1 && 'reviews__star--active'}`}>
            <use xlinkHref="../src/img/icons.svg#icon-star"></use>
          </svg>
          <svg className={`reviews__star ${rating >= 2 && 'reviews__star--active'}`}>
            <use xlinkHref="../src/img/icons.svg#icon-star"></use>
          </svg>
          <svg className={`reviews__star ${rating >= 3 && 'reviews__star--active'}`}>
            <use xlinkHref="../src/img/icons.svg#icon-star"></use>
          </svg>
          <svg className={`reviews__star ${rating >= 4 && 'reviews__star--active'}`}>
            <use xlinkHref="../src/img/icons.svg#icon-star"></use>
          </svg>
          <svg className={`reviews__star ${rating >= 5 && 'reviews__star--active'}`}>
            <use xlinkHref="../src/img/icons.svg#icon-star"></use>
          </svg>
        </div>
      </div>
      ))}
      </div>
    </section>

      {(booking == null && (
    <section className="section-cta">
      <div className="cta">
        <div className="cta__img cta__img--logo">
          <img src='../src//img/logo-white.png' alt="Natours logo" className="" />
        </div>
        <img src={`${URL}/img/tours/${tour.images[1]}`} alt="" className="cta__img cta__img--1" />
        <img src={`${URL}/img/tours/${tour.images[0]}`} alt="" className="cta__img cta__img--2" />

        <div className="cta__content">
          <h2 className="heading-secondary">What are you waiting for?</h2>
          <p className="cta__text">
            {tour.locations[tour.locations.length -1].day} days. 1 adventure. Infinite memories. Make it yours today!
          </p>
          {user && (<>
          <select value={date} onChange={handleDateChange}>
            {dates.map ((date, i) => <option key={date} value={i}>{date.toLocaleString('en-us', {month: 'long', year: 'numeric', day: 'numeric'})}</option>)}
          </select>
          <button disabled={soldOut} className="btn btn--green span-all-rows" onClick={handleBookClick}>{checkoutFetch.isLoading ? "...Processing" : "Book tour now!"}</button>
          </>) || <Link to ='/login' state={{from: location.pathname}} className="btn btn--green span-all-rows">Log in to book tour</Link>}
        </div>
      </div>
    </section> )) || (Date.now () >= new Date(booking.date).getTime () && reviewFetch.data?.result <= 0 && (
      <section className="section-cta">
        <Form title='Review' onSubmit={handleReviewSubmit}>
          <Form.TextArea id='review' label='Review' placeholder="Review..." required={true} value={reviewForm.review} name="review" onChange={handleReviewInputChange}/>
          <Form.Field id='rating' label='Rating' type='number' placeholder="Rating" required={true} value={reviewForm.rating} name='rating' onChange={handleReviewInputChange} max={5} min={1}/>
          <Form.Btn>Submit</Form.Btn>
        </Form>
      </section>
    )) }
    </>
    )
}