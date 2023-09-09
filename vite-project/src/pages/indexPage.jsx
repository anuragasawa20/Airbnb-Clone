import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import Map from "../Map";

export default function IndexPage() {
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        axios.get('/places').then(({ data }) => {
            console.log(data);
            setPlaces(data);
        })
    }, [])

    return (
        <>
            <h1 className="mt-8 mx-10 mb-4 text-black font-medium text-l">WonderLust Travels: Where Dreams Meet Reality.</h1>
            <div className="  gap-x-6 mx-10 grid gap-y-10 grid-cols-2  md:grid-cols-3 lg:grid-cols-4">
                {
                    places.length > 0 && places.map(place => (
                        <Link to={'/place/' + place._id} key={place._id}>
                            <div className="bg-gray-500 rounded-2xl flex mb-2 ">
                                {place.photos?.[0] && (
                                    <img src={place.photos?.[0]} alt="" className="object-cover aspect-square rounded-2xl" />)
                                }
                            </div>
                            <h2 className="font-semibold text-sm ">{place.address}</h2>
                            <h3 className="text-gray-500 truncate">{place.title}</h3>
                            <div>
                                <span className="font-semibold">₹{place.price}</span> per night
                            </div>
                        </Link>
                    )
                    )
                }
            </div>

        </>

    )
}