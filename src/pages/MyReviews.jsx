import URL from '../utils/URL';
import useFetch from '../hooks/useFetch';
import { useEffect } from 'react';
import Review from '../components/Review';
import { useNavigate } from 'react-router-dom';
export default function ()
{
  const {data, run} = useFetch ();
  const deleteReview = useFetch ();

  useEffect (() => {
    fetchReviews ();
  }, []);

  function fetchReviews ()
  {
    run (`${URL}/api/v1/reviews/my-reviews`);
  }

  const navigate = useNavigate ();

  if (data?.result <= 0)
    navigate ('/account');

  





  return (
    <main className ='main'>
        {data && data.data.docs.map (review => <Review key={review._id} review={review} fetchReviews={fetchReviews}/>)}
    </main>
  )
}