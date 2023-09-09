import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { format, differenceInCalendarDays } from "date-fns";
import PlaceGallery from "../PlaceGallery";

export default function BookingPage() {

    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [newReview, setNewReview] = useState({ name: '', content: '' });
    const [showInput, setShowInput] = useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();

        // Submit the new review to the API
        axios.post(`/api/reviewPlace/${booking?.place._id}`, newReview)
            .then(response => {
                // setReviews([...reviews, response.data]); // Add the new review to the list
                console.log(response.data);
                setNewReview({ name: '', content: '' });
                setShowInput(false); // Reset the input field
            })
            .catch(error => {
                console.error('Error submitting review:', error);
            });
    };

    useEffect(() => {
        if (id) {
            axios.get('/bookings').then((response) => {
                const foundBooking = response.data.find(({ _id }) => _id === id);
                if (foundBooking) {
                    setBooking(foundBooking);
                }

            })
        }
    }, [id]);

    if (!booking)
        return 'Loading....';

    return (
        <div className="my-8 mx-16">
            <div>
                <h1 className="text-3xl font-medium mb-2 ">{booking.place.title} </h1>
                <a target="_blank" rel="noreferrer" href={'https://maps.google.com/?q=' + booking.place.address} className="my-2 flex gap-2 font-bold 8 underline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {booking.place.address}</a>
            </div>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl mb-5 font-medium">Your booking information:</h2>
                        <div className="mt-3 flex items-center gap-3  text-gray-500 ">
                            <div className="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>

                                <div className="bg-gray-300">  {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights: <br />
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                </svg>
                                {format(new Date(booking.checkIn), 'dd-MM-yyyy')}
                            </div>
                            &rarr;
                            <div className="flex gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                </svg>
                                {format(new Date(booking.checkOut), 'dd-MM-yyyy')}
                            </div>
                        </div>
                    </div>
                    <div className=" bg-primary text-white p-4 rounded-2xl font-medium">
                        <div>Total price:</div>
                        <div className="text-3xl">₹{booking.price}</div>
                    </div>

                </div>
            </div>
            <PlaceGallery place={booking.place} />
            <div className="my-4">
                <h2 className="font-semibold text-2xl mt-6 mb-2">Description</h2>
                <div className="text-md">
                    {booking.place.description}
                </div>
            </div>
            <div className="review-section">
                <h2 className="text-xl font-semibold mb-4">Review Place</h2>
                {showInput ? (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="border rounded p-2 mb-2 w-full"
                            value={newReview.name}
                            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        />
                        <textarea
                            placeholder="Your Review"
                            className="border rounded p-2 mb-2 w-full"
                            value={newReview.content}
                            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-primary text-white px-4 py-2 rounded"
                            >
                                Submit Review
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        className="bg-primary text-white  px-4 py-2 rounded"
                        onClick={() => setShowInput(true)}
                    >
                        Review Your Experience
                    </button>
                )}
            </div >
        </div >
    )
}