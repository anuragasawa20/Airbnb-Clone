import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// dotenv.config();

export default function BookingWidget({ place }) {

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [name, setName] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { user } = useContext(UserContext);
    const [orderId, setOrderId] = useState('');
    const [amount, setAmount] = useState(1);

    let razorpayScriptLoaded = false;
    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    let noOfNights = 0;
    // console.log(place);

    if (!place) {
        return <div>Loading...</div>;
    }

    if (checkIn && checkOut) {
        noOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    const loadRazorpayScript = () => {
        if (!razorpayScriptLoaded) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => {
                razorpayScriptLoaded = true;
            };
            document.head.appendChild(script);
        }
    };

    const initiatePayment = async () => {

        if (!razorpayScriptLoaded) {
            loadRazorpayScript();
        }

        const token = localStorage.getItem('token');

        const headers = {
            'auth': token
        };

        const response1 = await axios.post('/api/payment/order', {
            amount: noOfNights * place.price,
        });
        const { id, amount } = response1.data;
        setAmount(amount);
        setOrderId(id);
        console.log(amount);

        const { data: { key } } = await axios.get("/payment/razorpaykey", { headers });
        console.log(amount);
        const options = {
            key: key,
            amount: amount * 100,
            currency: 'INR',
            name: 'Airbnb',
            description: 'Hotel Booking',
            order_id: orderId,
            handler: function (response) {
                // Handle the success response, usually by confirming the payment on your server
                console.log('Payment Successful:', response);
                axios.post('/booking', {
                    checkIn, checkOut, maxGuests, name,
                    PhoneNumber, price: noOfNights * place.price, place: place._id
                }).then((response) => {
                    const bookingId = response.data._id;
                    //console.log(bookingId);
                    setRedirect(`/account/bookings/${bookingId}`);
                })
            },
            prefill: {
                name: name,
                // email: 'john@example.com',
                Nights: noOfNights,
                contact: PhoneNumber,
            },
        };
        console.log(noOfNights * place.price);
        const rzp = new window.Razorpay(options);
        rzp.open();
    };


    async function bookThisPlace() {
        if (!(noOfNights * place.price)) {
            toast.error('please enter Dates', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        try {

            await initiatePayment();

        }
        catch (error) {
            console.error(error);
        }

    }
    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="bg-white p-4 shadow-md rounded-2xl mt-6">
            <div className="text-2xl font-semibold text-center">
                Price:  ₹{place.price} per night
            </div>
            <div className="border rounded-2xl  mt-4">
                <div className="flex">
                    <div className="md:py-3 md:px-4 py-1 px-1" value={checkIn} onChange={ev => setCheckIn(ev.target.value)}>
                        <label>Check in:</label>
                        <input type="date" />
                    </div>
                    <div className="md:py-3 md:px-4 py-1 px-1 border-l" value={checkOut} onChange={ev => setCheckOut(ev.target.value)}>
                        <label>Check out:</label>
                        <input type="date" />
                    </div>
                </div>
                <div className='py-3 px-4 border-t '>
                    <label>Max no of Guests:</label>
                    <input type="number" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} />
                </div>
                {noOfNights > 0 && (
                    <div className='py-3 px-4 border-t '>
                        <label>Your full name:</label>
                        <input type="text" value={name} onChange={ev => setName(ev.target.value)} />
                        <label>Phone Number:</label>
                        <input type="text" value={PhoneNumber} onChange={ev => setPhoneNumber(ev.target.value)} />
                    </div>
                )}
            </div>
            <ToastContainer />
            <button onClick={bookThisPlace} className="primary text-xl mt-4"> Book Place </button>
        </div>
    );
}

BookingWidget.propTypes = {
    place: PropTypes.shape({
        price: PropTypes.number.isRequired,
        _id: PropTypes.string.isRequired,
    }),

};

BookingWidget.defaultProps = {
    place: {},
};