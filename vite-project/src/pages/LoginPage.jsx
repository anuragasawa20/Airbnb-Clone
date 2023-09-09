import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);

    async function LoginUser(ev) {
        ev.preventDefault();
        try {
            axios.post('/login', { email, password }).then(({ data }) => {
                toast.success('Successfully Logged in !', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setUser(data);

                setRedirect(true);
            });

        }
        catch (e) {
            alert('login failed');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex justify-around items-center  ">
            <div className=" mb-32 ">
                <h1 className="text-4xl text-center font-semibold  my-8 ">Login</h1>
                <form className="max-w-md mx-auto " onSubmit={LoginUser}>
                    <input type="Email" placeholder="enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className="primary my-4 text-xl">Login</button>
                    <div className="text-md text-center text-gray-400"> Don't have account yet? <Link to={'/Register'} className="underline text-black">Register here</Link> </div>
                    <ToastContainer />
                </form>
            </div>

        </div>
    )
}