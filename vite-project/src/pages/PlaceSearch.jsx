import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom";
import Map from "../Map";


export default function PlaceSearch() {
    const { location } = useParams();
    const [places, setPlaces] = useState([]);
    console.log(location);
    useEffect(() => {
        axios.get(`places/search/${location}`).then(({ data }) => {
            setPlaces(data);
            console.log(places);
        })

    }, [])

    // if (!places) {
    //     return (

    //     )
    // }

    return (
        <div >
            <div className="grid lg:grid-row-2 md:grid-rows-2">
                {
                    places.length > 0 ? (

                        <div className="mt-6 mx-4">
                            <h1 className="text-black font-medium text-2xl mt-4">{places.length} Place in {location} </h1>

                            {
                                places.length > 0 && (

                                    places.map((place) => (
                                        <Link to={"/place/" + place._id} key={place} className="rounded-2xl gap-4 shadow-md bg-gray-200 flex p-4 mt-2 mb-6">
                                            <div className="w-32 h-32  bg-gray-300 grow-0 shrink-0">
                                                {
                                                    place.photos.length > 0 && (
                                                        <img src={place.photos[0]} alt="image" className="w-32 h-32 object-cover" />
                                                    )
                                                }
                                            </div>
                                            <div className="grow-0 shrink">
                                                <h2 className="text-xl font-medium">{place.title}</h2>
                                                <p className="text-sm  font-bold mt-1">{place.address}</p>
                                                <p className="text-base mt-2">{place.description}</p>
                                            </div>

                                        </Link>
                                    ))
                                )

                            }

                        </div>

                    ) : (<div className="mt-8 mx-4 text-2xl font-semi-bold">
                        No place found in {location} 🥲. what else can I help ??
                    </div>)
                }

                {
                    places.length > 0 && (

                        <div className=" xl:min-w-[600px]">
                            <Map searchLocation={places[0]?.address} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}