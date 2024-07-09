import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = ({logIn}) => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match. Please check and try again.');
      return; 
    }

    try {
      const response = await axios.post('${process.env.REACT_APP_BACKEND_URL}/api/register', {
        username,
        email,
        password,
      });

      // console.log(response)
      const userId=response.data._id;

      if (response.status === 201) {
        sessionStorage.setItem('loggedInUser', userId)
        navigate(`/user/${userId}`)
      } else if (response.status === 400) {
        alert('Registration failed. Please check your details.');
      } else {
        alert('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('API call error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  
  useEffect(() => {
    setErrorMessage(''); 
  }, [username, email, password, confirmPassword]);

  useEffect(()=>{
    const checkloggedIn= ()=>{
      console.log('checking');
      const userId = sessionStorage.getItem('loggedInUser')
      if(userId){ 
        navigate(`/user/${userId}`)
      }
    }
    checkloggedIn();
}, [])


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center">
      <div className="shadow-md rounded-lg p-8 bg-white max-w-md w-full">
        <div>
          <h1 className="text-xl font-bold text-center text-blue-700">Create Your Account</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={username}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-2 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-700">Already have an account?
          <a href="/login" className="text text-red-700"> Login Here</a>
          </span>
        </div>
        </div>
        </div>
    


  )}

  export default Register;