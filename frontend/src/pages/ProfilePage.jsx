import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () =>{
    const { logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <nav className="p-4 bg-blue-500 text-white flex justify-between">
            <h1 className="text-xl font-bold">ProfilePage</h1>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg">
                Logout
            </button>
        </nav>
    );
}
export default ProfilePage

