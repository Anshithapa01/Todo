import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavBar = () => {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    const getProfileInitial = () => {
        return auth?.user?.username?.charAt(0).toUpperCase() || "U";
    };

    const getRandomColor = () => {
        const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <nav className="flex justify-between items-center bg-white shadow-md p-4">
            {/* Logo */}
            <div className="text-xl flex font-bold items-stretch rounded-full text-fuchsia-800">
                <img className="rounded-full h-12 w-12" src="/todo.png" alt="Logo" />
                <h1 className="pl-2 h-12 pt-1 self-center font-serif">To Do</h1>
            </div>

            {/* Profile and Gists Link */}
            <div className="flex items-center gap-4">
                <Link to="/exported-gists" className="text-fuchsia-800 font-semibold no-underline" style={{ textDecoration: "none", color:'#c208b9'}}>
                    View Exported Gists
                </Link>

                <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold cursor-pointer ${getRandomColor()}`}
                    onClick={() => navigate("/profile")}
                >
                    {getProfileInitial()}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
