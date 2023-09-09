import { useEffect, useState } from "react";
import AccountNav from "./AccountNav";
import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { Dialog } from '@headlessui/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BookingsPage() {

    const [bookings, setBookings] = useState([]);
    const [isOpen, setIsOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    const token = Cookies.get("token");
    const handleDelete = async (id, e) => {
        e.preventDefault();
        console.log(deleteId);
        console.log(id);
        setIsOpen(false)
        axios.delete(`/places/delete/${id}`).then((response) => {
            console.log(response.status);
            if (response.status === 200) {
                toast.success('place deleted Successfully', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            console.log(response.data);
            console.log("deleted successfully");
        })

    }


    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
        axios.get('/bookings').then(
            response => {
                setBookings(response.data);
            }
        )
    }, []);

    if (!bookings) {
        return '';
    }

    return (
        <div>
            <AccountNav />
            <div>
                {
                    bookings?.length > 0 && bookings.map(booking => (
                        <Link to={`/account/bookings/${booking._id}`} key={booking.id} className="flex mt-6 mx-32  gap-6 bg-gray-200 rounded-2xl overflow-hidden">
                            <div className="">
                                {booking.place.photos.length > 0 && (
                                    <img src={booking.place.photos[0]} alt="image" className="w-52 h-36 object-cover" />
                                )}
                            </div>
                            <div className="py-3 ">
                                <h2 className="font-semibold text-xl">{booking.place.title}</h2>
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
                                <div className=" flex items-center gap-1 text-xl mt-4 font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                    Total price: ₹{booking.price}
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                {/* The backdrop, rendered as a fixed sibling to the panel container */}
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                {/* Full-screen container to center the panel */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    {/* The actual dialog panel  */}
                    <Dialog.Panel className="max-w-md px-12 py-10 mx-auto bg-white rounded">
                        <Dialog.Title>Are you sure you want to delete the place</Dialog.Title>
                        <div className="flex items-center justify-end gap-4 mt-5">
                            <button onClick={(e) => handleDelete(deleteId, e)} className="px-4 py-2 text-white bg-red-700 rounded-[8px] cursor-pointer">Delete</button>
                            <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-white bg-gray-700 rounded-[8px] cursor-pointer">Cancel</button>
                        </div>

                        {/* ... */}
                    </Dialog.Panel>
                </div>
            </Dialog>
            <ToastContainer />
        </div>
    )
}