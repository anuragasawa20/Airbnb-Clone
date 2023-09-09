import { Link } from "react-router-dom";
// import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "./AccountNav";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Dialog } from '@headlessui/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function PlacesPage() {

    const [isOpen, setIsOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(null);
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        axios.get('/user-places').then(({ data }) => {
            setPlaces(data);
        })
    }, []);

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

    return (
        <div>
            <AccountNav />
            <div className="text-center">
                <Link className="bg-primary text-white rounded-full mt-4 py-2 px-4 inline-flex gap-1" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new Place</Link>
            </div>

            <div className="mt-6 ">
                {
                    places.length > 0 && (
                        places.map((place) => (
                            <div key={place._id} className="bg-gray-100 flex mt-8 justify-between">
                                <Link to={"/account/places/" + place._id} key={place} className="rounded-2xl gap-4 bg-gray-100 flex p-4 my-4 ">
                                    <div className=" w-32 h-32 bg-gray-300 grow-0 shrink-0">
                                        {
                                            place.photos.length > 0 && (
                                                <img src={place.photos[0]} alt="image" className="w-32 h-32 object-cover" />
                                            )
                                        }
                                    </div>
                                    <div className="grow-0 shrink">
                                        <h2 className="text-xl font-medium">{place.title}</h2>
                                        <p className="text-sm  font-bold mt-1">{place.address}</p>
                                        <p className="text-base  mt-2">{place.description}</p>
                                    </div>


                                </Link>
                                <div onClick={() => {
                                    setDeleteId(place._id)
                                    setIsOpen(true)
                                    console.log(deleteId)
                                }} className="mr-6 my-8 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>

                                </div>
                            </div>
                        ))
                    )

                }
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

        </div>
    )
}