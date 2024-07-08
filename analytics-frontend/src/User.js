import React from 'react'
import {useParams} from 'react-router-dom';

const qrCodes=[{id: 'use-32-23',imageUrl: "https://views.medibuddy.in/affinity/doctor.png", redirectWebsite: 'Google.com'},{id: 'use-32-23',imageUrl: "https://views.medibuddy.in/affinity/doctor.png", redirectWebsite: 'Google.com'},{id: 'use-32-23',imageUrl: "https://views.medibuddy.in/affinity/doctor.png", redirectWebsite: 'Google.com'},{id: 'use-32-23',imageUrl: "https://views.medibuddy.in/affinity/doctor.png", redirectWebsite: 'Google.com'}];

function User() {
    const {userId} = useParams();
  return (
    <>
    <div>
        <h1 className="text-indigo-600 m-12">User id is: {userId}</h1>
    </div>
     <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-300 px-4 py-8">
     <h1 className="text-xl font-bold text-center text-white">Your QR Codes</h1>
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
       {qrCodes.map((qr) => (
         <div key={qr.id} className="shadow-md rounded-lg overflow-hidden">
           <img src={qr.imageUrl} alt="QR Code" className="w-full h-48 object-cover" />
           <div className="px-4 py-2 text-white">
             <p className="font-medium">Redirect to: {qr.redirectWebsite}</p>
             <button
               className="px-2 py-1 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2">
            <a href='/analytics'> Go to Analytics </a>
               
             </button>
           </div>
         </div>
       ))}
     </div>
   </div>
   </>
  )
}

export default User

