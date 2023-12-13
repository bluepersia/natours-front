import { useState } from "react";
import Form from './form';
import useFetch from "../hooks/useFetch";
import URL from '../utils/URL';

export default function Review ({review, fetchReviews})
{
    const [formData, setFormData] = useState ({
        review: review.review,
        rating: review.rating
    })
    const updateReview = useFetch ();
    const deleteReview = useFetch ();

    function handleReviewSubmit (e)
    {
        e.preventDefault ();
        updateReview.run (`${URL}/api/v1/reviews/${review._id}`, 'PATCH', formData);
    }

    function handleInputChange ({target})
    {
        const {name, value} = target;

        setFormData (prev => ({...prev, [name]: value}));
    }

    async function handleDeleteClick ()
    {
        await deleteReview.run (`${URL}/api/v1/reviews/${review._id}`, 'DELETE', formData);
        fetchReviews ();
    }

    return (
        <Form key={review._id} title={review.tour.name} onSubmit={handleReviewSubmit}>
            <Form.TextArea id='review' label='Review' placeholder="Review..." required={true} value={formData.review} name="review" onChange={handleInputChange}/>
            <Form.Field id='rating' label='Rating' type='number' placeholder="Rating" required={true} value={formData.rating} name='rating' onChange={handleInputChange} max={5} min={1}/>
            <div className="flex">
                <Form.Btn>Submit</Form.Btn>
                <Form.Btn type='button' extraClass='right' onClick={handleDeleteClick}>Delete</Form.Btn>
            </div>
        </Form>
    )
}