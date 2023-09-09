import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import Map from '../Map';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Review from "../Review";

export default function PlacePage() {
    const token = Cookies.get("token");
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const navigate = useNavigate();
    const [mapOpen, setMapOpen] = useState(true);
    const [reviews, setReviews] = useState([]);

    console.log(mapOpen);
    useEffect(() => {
        if (!id) {
            return;
        }
        if (!token) {
            toast.error('please Login !!!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            navigate('/login');
        }
        axios.get('/place/' + id).then(({ data }) => {
            setPlace(data);
        })

        axios.get(`/api/getReview/${id}`)
            .then(response => {
                // setReviews([...reviews, response.data]); // Add the new review to the list
                // console.log(response.data);
                setReviews(response.data);
            })
            .catch(error => {
                console.error('Error submitting review:', error);
            });

    }, [id]);

    if (!place)
        return '....Loading';


    return (
        <div className="bg-gray-100 -mx-8  border mt-2  ">
            <div className="mt-4 md:mx-40 px-3 py-8    ">
                <h1 className="text-3xl font-medium mb-2 ">  {place.title} </h1>
                <a target="_blank" rel="noreferrer" href={'https://maps.google.com/?q=' + place.address} className="my-2 flex gap-2 font-bold 8 underline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {place.address}</a>

                <PlaceGallery place={place} mapOpen={mapOpen} onChange1={setMapOpen} />
                <div className="mt-4 gap-8 grid grid-cols-1 md:grid-rows-1 lg:grid-cols-[2fr_1fr] font-normal">
                    <div>
                        <div className="my-4">
                            <h2 className="font-semibold text-2xl mt-1 mb-4">Description</h2>
                            <div className="text-md">
                                {place.description}
                            </div>
                        </div>
                        Check In: {place.checkIn}<br />
                        Check Out: {place.checkOut} <br />
                        Max no of Guests: {place.maxGuests}<br />
                    </div>
                    <div className="mx-2 mt-2">
                        <BookingWidget place={place} />
                    </div>

                </div>


                {
                    mapOpen && (<div className=" xl:min-w-[600px] border-xl">
                        <Map searchLocation={place.address} />
                    </div>)
                }
                <h2 className="font-semibold  mt-6 text-2xl mb-4 ">Extra Info</h2>
                <div className="-mx-28 px-8 grid lg:grid-cols-2 sm:grid-rows-1 ">
                    <div className="mx-20">
                        <div className="font-semi-bold">House Rules</div>
                        <div>
                            {place.extraInfo}
                        </div>
                    </div>
                    <div className="mb-4 mt-4 mx-4 md:mx-16   text-white leading-5  md:grid sm:hidden  md:grid-cols-3  gap-2  ">
                        <div className="text-xl font-medium rounded-xl bg-primary mx-10 px-2 py-1 md:px-1 my-12  text-center mt-4 md:mx-8 ">{place.perks[0]}</div>
                        <div className="text-xl font-medium bg-primary rounded-xl mx-10 px-2 py-1 md:px-1 my-12  md:py-1 text-center mt-4 md:mx-8">{place.perks[1]}</div>
                        <div className="text-xl font-medium bg-primary  rounded-xl mx-10 px-2 py-1 md:px-1 my-12  md:py-1 text-center mt-4 md:mx-8" >{place.perks[2]}</div>
                    </div>

                </div>
                {
                    reviews.length > 0 && (
                        <Review reviewss={reviews} />
                    )
                }
            </div>
            <ToastContainer />
        </div>

    )
}