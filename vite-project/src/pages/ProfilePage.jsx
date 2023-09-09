import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "./AccountNav";

export default function ProfilePage() {
    const { user, ready, setUser } = useContext(UserContext);
    const [redirect, setRedirect] = useState(null);
    let { subpage } = useParams();

    if (!ready) {
        return 'Loading...';
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (subpage === undefined) {
        subpage = 'profile';
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }


    return (
        <div>
            <AccountNav />
            {subpage === 'profile' && (
                <div className="bg-gray-400 bg-opacity-20 mt-20 h-60 max-w-md rounded-xl flex  flex-col justify-center  mx-auto  text-black">
                    <div className=" flex ml-32   ">
                        <div className="mr-8">
                            <div className="text-primary mb-4 font-semibold ">Name</div>
                            <div className=" text-primary font-semibold ">Email </div>
                        </div>

                        <div className=" flex flex-col  ">
                            <span className=" text-black mb-4 font-medium ">{user.name}</span>
                            <span className="text-black font-medium"> {user.email}</span>
                        </div>
                    </div>

                    <button onClick={logout} className="bg-primary text-white rounded-xl w-20 h-10 mt-8 ml-44">Logout</button>

                </div>
            )}
            {
                subpage === 'places' && (
                    <PlacesPage />
                )
            }

        </div>
    )
}