import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RegisterPage() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    function registerUser(ev) {

        ev.preventDefault();
        try {
            axios.post('/register', {
                name,
                email,
                password
            }).then(({ data }) => {
                if (data.status) {
                    toast.success('Successfully registered !', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                }
                else {
                    toast.error('error during submitting registration !', {
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
            });
        }
        catch (e) {
            //alert("Registration failed. Please try again later")
            toast.error('Registration failed. Please try again later !', {
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

    }

    return (
        <div className="mt-4 grow flex justify-around items-center  ">
            <div className=" mb-32 bg-gray-100 rounded-lg px-32 py-8">
                <h1 className="text-4xl text-center font-semibold  my-8 ">Register</h1>
                <form className="max-w-md mx-auto  " onSubmit={registerUser}>
                    <input type="text" placeholder="enter your Name" value={name} onChange={e => setName(e.target.value)} />
                    <input type="Email" placeholder="enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className="primary my-4 text-xl">Register</button>
                    <div className="text-md text-center text-gray-400">Already have account? <Link to={'/Login'} className="underline text-black"> Login</Link> </div>
                    <ToastContainer />
                </form>
            </div>
        </div>
    )
}