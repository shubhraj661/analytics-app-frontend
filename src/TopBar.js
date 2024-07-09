import React from 'react';
import { useNavigate } from 'react-router-dom';


const TopBar = () => {

    const navigate = useNavigate();
    const logout= ()=>{
        console.log('called');
        sessionStorage.removeItem('loggedInUser');
        navigate('/login');
    }
    return (
        <div className="sticky top-0 flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300 z-50">
            <div className="flex items-center space-x-2 text-2xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <img src={`${process.env.PUBLIC_URL}/logo.jpg`} width="30px" alt="logo" />
                <span>QRSIGHT</span>
            </div>
            <div className="text-lg text-blue-600 cursor-pointer" onClick={()=>{logout()}}>Logout</div>
        </div>
    );
}

export default TopBar;
