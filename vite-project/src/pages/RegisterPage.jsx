import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios";

export default function RegisterPage() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function registerUser(ev) {

        ev.preventDefault();
        try {
            axios.post('/register', {
                name,
                email,
                password
            });
            alert("registration Successful");
        }
        catch (e) {
            alert("Registration failed. Please try again later")
        }

    }

    return (
        <div className="mt-4 grow flex justify-around items-center  ">
            <div className=" mb-32 ">
                <h1 className="text-4xl text-center font-semibold  my-8 ">Register</h1>
                <form className="max-w-md mx-auto  " onSubmit={registerUser}>
                    <input type="text" placeholder="enter your Name" value={name} onChange={e => setName(e.target.value)} />
                    <input type="Email" placeholder="enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className="primary my-4 text-xl">Register</button>
                    <div className="text-md text-center text-gray-400">Already have account? <Link to={'/Login'} className="underline text-black"> Login</Link> </div>

                </form>
            </div>
        </div>
    )
}