import axios from 'axios';
import React from 'react'
import {useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Modal } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function User() {
  const {userId} = useParams();
  let [qrCodes, setQrCodes] = useState([]);
  let [openModal , setOpenModal]= useState(false);
  let [newUrl , setNewUrl] = useState('');
  const headers = {
    "ngrok-skip-browser-warning": "69420"
  };

  useEffect(()=>{
    const fetchQRCodes = async()=>{
      console.log(userId);
      try{
       let {data} = await axios.get(`https://3e2d-2405-201-4008-42f3-4db1-ba9c-4286-669.ngrok-free.app/api/qr/all/${userId}`, {headers: headers});
       setQrCodes(data);
      }
      catch(err)
      {
        console.log(err);
      }
    }
    fetchQRCodes();
  }, [])

  function isValidURL(url) {
    // Regular expression for a valid URL
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    
    return !!pattern.test(url);
}
  
  let submitNewQR = async ()=>{
      // use the redirect url to create the qrcode image url
      // send these 3 things to the backend
      // add data to the qrcodes list for now
      console.log('called');
    try{
      if(!isValidURL(newUrl)) {
        toast('Please enter a valid redirect url');
        return;
      }
      let {data}= await axios.post('https://3e2d-2405-201-4008-42f3-4db1-ba9c-4286-669.ngrok-free.app/api/qr', {
        userId: userId,
        redirectUrl: newUrl,
        imgUrl: 'dummy'
      });
      console.log(data);
      // use the QR id to update the redirect url using a put call
      let qrid= data._id;
      let analytics_url = `http://localhost:3006/redirect/${qrid}`; // to be changed on hosting
      let imgUrl = `https://quickchart.io/qr?text=${analytics_url}`;
      // making the put request to update qrimg
      await axios.put(`https://3e2d-2405-201-4008-42f3-4db1-ba9c-4286-669.ngrok-free.app/api/qr/${qrid}`, {
        userId: userId,
        redirectUrl: newUrl,
        imgUrl: imgUrl
      })

      setQrCodes((prev)=>{
         return [...prev, {userId: userId, redirectUrl: newUrl, imgUrl: imgUrl}]; 
      });
      
    }
    catch(err){
      console.log(err);
    }
    setNewUrl('');
    setOpenModal(false);
  }

  return (
    <>
       <ToastContainer />
     <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-300 px-4 py-8">
    <div class="fixed bottom-4 right-4 z-50">
        <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl" onClick={()=>{setOpenModal(true)}}>
            +
        </div>
    </div>
     <h1 className="text-xl font-bold text-center text-white">Your QR Codes</h1>
     {qrCodes.length >0 ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {qrCodes.map((qr) => (
         <div key={qr.id} className="shadow-md rounded-lg overflow-hidden">
           <img src={qr.imgUrl === 'dummy' ? `${process.env.PUBLIC_URL}/no_img.jpg`: qr.imgUrl} alt="QR Code" className="w-full h-50 object-cover" />
           <div className="px-4 py-2 text-white">
             <p className="font-medium">Redirect to: {qr.redirectUrl}</p>
             <button
               className="px-2 py-1 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2">
            <a href={`/analytics/${qr._id}`}> Go to Analytics </a>
               
             </button>
           </div>
         </div>
       ))}
     </div>:
      <div className='mt-10 text-white font-bold text-center'>
      No QR Code created yet
      </div>
}
    <Modal
   title="Create a new QR Code"
   open= {openModal}
   onOk= {submitNewQR}
   onCancel={()=>{setOpenModal(false); setNewUrl('');}}
   >
   <input type="text" value={newUrl}  onChange={(e)=>{setNewUrl(e.target.value)}} id="redirect_url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your redirect url" />
   </Modal>
   </div>
   </>
  )
}

export default User

