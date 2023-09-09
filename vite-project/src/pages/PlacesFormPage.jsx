import { useEffect, useState } from "react";
import axios from "axios";
import Perks from "../PerksPage";
import PhotoUploader from "./PhotoUploader";
import AccountNav from "./AccountNav";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';


export default function PlacesFormPage() {

    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [photos, setPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extrainfo, setExtrainfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [price, setPrice] = useState(100);
    const [selectedCategory, setSelectedCategory] = useState('');
    const token = Cookies.get("token");
    const navigate = useNavigate();

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const categoriesList = [
        'beach',
        'mountains',
        'farmhouse',
        'rooms',
        'tree-house',
        'camping',
        'historical-homes',
        'iconic-cities',
        'domes',
        'lake',
        'houseboats'
    ];


    useEffect(() => {
        if (!id) {
            return;
        }
        if (!token) {
            navigate('/login');
        }

        axios.get('/places/' + id).then(response => {
            const { data } = response;
            setTitle(data.title);
            setAddress(data.address);
            setPhotos(data.photos);
            setPerks(data.perks);
            setDescription(data.description);
            setExtrainfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setSelectedCategory(data.selectedCategory);
            setPrice(data.price)
        })

    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }

    function inputDescription(desc) {
        return (
            <p className="text-gray-400 text-sm">{desc}</p>

        )
    }

    function preInput(header, description) {

        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }

    async function savePlace(ev) {
        ev.preventDefault();

        const placeData = {
            title, address, photos,
            description, perks, extrainfo,
            checkIn, checkOut, maxGuests, price, selectedCategory
        }
        console.log(selectedCategory);
        if (id) {
            await axios.put('/places', { id, ...placeData });
            setRedirect(true);
        } else {
            await axios.post('/places', placeData);
            setRedirect(true);

        }
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }

    return (
        <div className="">
            <AccountNav />
            <form className="mx-auto" onSubmit={savePlace} >
                {preInput('Title', 'Title for your place should be catchy')}
                <input className=" -mt-4 " type="text" placeholder="title" value={title} onChange={(ev) => setTitle(ev.target.value)} />
                {preInput('Address', 'Address to this place')}
                <input type="text" placeholder="Address" value={address} onChange={(ev) => setAddress(ev.target.value)} />
                {preInput('Photos', 'Address to this place')}
                <PhotoUploader photos={photos} onChange={setPhotos} />
                {preInput('Description', 'description of the place')}
                <textarea className="border w-full mt-4 " value={description} onChange={(ev) => setDescription(ev.target.value)} />
                {preInput('Perks', 'select all the perks of your place')}
                <div className="grid mt-4 gap-2 md:grid-cols-3 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks} />

                </div>
                <div className="mt-4 ">
                    <label className="font-semi-bold text-xl mr-4">
                        Choose a Category:
                    </label>
                    <select value={selectedCategory} onChange={handleCategoryChange} className=" px-2 py-2 mt-1 rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <option value="">Select  Category </option>
                        {categoriesList.map((category) => (
                            <option key={category} value={category} className="py-2 px-4 bg-white hover:bg-indigo-500 hover:text-white">
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                {preInput('Extra Info', 'house rules,etc')}
                <textarea className="border mt-4 w-full " value={extrainfo} onChange={ev => setExtrainfo(ev.target.value)} />
                {preInput('Check in&out times', 'add check in and out time')}


                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-2">
                    <div>
                        <h2 className="-mb-4 mx-2">Check-In</h2>
                        <input type="Number" placeholder="14:00" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} />
                    </div>
                    <div>
                        <h2 className="-mb-4 mx-2">Check-Out</h2>
                        <input type="Number" placeholder="18:00" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                    <div>
                        <h2 className="-mb-4 mx-2">Max number of guests</h2>
                        <input type="number" placeholder="2" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} />
                    </div>
                    <div>
                        <h2 className="-mb-4 mx-2">Price per night</h2>
                        <input type="number" placeholder="2" value={price} onChange={ev => setPrice(ev.target.value)} />
                    </div>
                </div>
                <button className=" text-xl primary" >Save</button>

            </form>
            <ToastContainer />
        </div>
    )
}