import { useState } from "react";
import PropTypes from 'prop-types';


export default function Review({ reviewss }) {
    // const [reviews, setReviews] = useState([]);
    // setReviews(reviewss);
    const reviews = reviewss;
    console.log(reviews);
    return (
        <div className="review-section">
            <h1 className="text-2xl font-semibold mt-4">Reviews </h1>
            <div className="grid lg:grid-cols-3 sm:grid-cols-2  gap-12 mt-4 mx-8">
                {reviews?.map((review, index) => (

                    <div key={index} className="review bg-white text-black rounded-lg p-4  gap-2 shadow-lg border border-gray-200">
                        <div className="flex items-center gap-2  mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-700 ">
                                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold text-xl text-black">{review.userName}</span>
                        </div>
                        <div className="text-black">{review.content}</div>
                    </div>


                ))}
            </div>
        </div>
    )
}

Review.propTypes = {
    reviewss: PropTypes.array.isRequired,

};