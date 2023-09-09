import { useState } from "react";
import PropTypes from 'prop-types';

export default function PlaceGallery({ place, mapOpen, onChange1 }) {

    const [showAllPhotos, setShowAllPhotos] = useState(false);

    if (showAllPhotos) {
        onChange1(false);
        return (
            <div className="absolute inset-0 max-w-full bg-black text-white  min-h-max ">
                <div className="py-8 px-32 grid gap-4  ">
                    <div className="">
                        <h2 className="text-3xl">{place.title}</h2>
                        <button onClick={() => { setShowAllPhotos(false), onChange1(true) }} className="rounded-2xl bg-white text-black fixed px-4 flex gap-2 py-2 shadow-gray-600 right-12 top-8 font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Close Photos
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map(photo => (
                        <div key={photo._id} className=" ">
                            <img src={photo} alt="" className="   object-cover " />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="relative mt-2  ">
            <div className="rounded-3xl grid gap-2   grid-cols-[2fr_1fr] overflow-hidden">
                <div >
                    {place.photos?.[0] && (
                        <div className="">
                            <img className="aspect-square h-full w-full cursor-pointer object-cover" src={place.photos[0]} alt="" onClick={() => showAllPhotos(true)} />
                        </div>
                    )}
                </div>
                <div className="grid ">
                    {place.photos?.[1] && (
                        <img className="aspect-square cursor-pointer  object-cover" src={place.photos[1]} alt="" onClick={() => showAllPhotos(true)} />
                    )}
                    <div className="overflow-hidden">
                        {place.photos?.[2] && (
                            <img className="aspect-square cursor-pointer  object-cover" src={place.photos[2]} alt="" onClick={() => showAllPhotos(true)} />
                        )}
                    </div>
                </div>
            </div>
            <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-2 right-2 px-4 py-2 rounded-2xl bg-white  shadow-md  shadow-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Show all Photos
            </button>
        </div>
    )
}

PlaceGallery.propTypes = {
    place: PropTypes.shape({
        title: PropTypes.string.isRequired,
        photos: PropTypes.array.isRequired,

    }),
    onChange1: PropTypes.bool.isRequired,

};


// PlaceGallery.defaultProps = {
//     place: {},
// };