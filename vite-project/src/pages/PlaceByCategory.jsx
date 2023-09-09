import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom";
import Map from "../Map";


export default function PlaceByCategory() {
    const { category } = useParams();
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    console.log(category);
    useEffect(() => {
        if (!places.length) {
            axios.get('/places').then(({ data }) => {
                console.log(data);
                setPlaces(data);
            })
        }
        console.log(places);
        if (places) {
            const filteredData = places.filter(place => place.selectedCategory === category);
            setPlaces(places);
            setFilteredPlaces(filteredData);
            console.log(filteredData);
        }
        // axios.get(`places/searchbyCategory/${category}`).then(({ data }) => {
        //     console.log(data);
        //     setPlaces(data);
        //     setIsLoading(false);
        //     console.log(places);
        // })

    }, [category, places]);

    // if (!places) {
    //     return (

    //     )
    // }

    return (
        <div >

            <h1 className="mt-8 mx-10 mb-4 text-black font-medium text-2xl">{category} Places </h1>
            <div className="  gap-x-6 mx-10 grid gap-y-10 grid-cols-2  md:grid-cols-3 lg:grid-cols-4">
                {
                    filteredPlaces.length > 0 && filteredPlaces.map(place => (
                        <Link to={'/place/' + place._id} key={place._id}>
                            <div className="bg-gray-500 rounded-2xl flex mb-2 ">
                                {place.photos?.[0] && (
                                    <img src={place.photos?.[0]} alt=""
                                        className="object-cover aspect-square rounded-2xl " />)
                                }
                            </div>
                            <h2 className="font-semibold text-sm ">{place.address}</h2>
                            <h3 className="text-gray-500 truncate">{place.title}</h3>
                            <div>
                                <span className="font-semibold">₹{place.price}</span> per night
                            </div>
                        </Link>
                    )
                    )}

            </div>
        </div>

    )
}