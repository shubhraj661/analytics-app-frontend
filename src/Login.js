import axios from 'axios';
import React, { useState,useEffect } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    try{
      const response=await axios.post('https://3e2d-2405-201-4008-42f3-4db1-ba9c-4286-669.ngrok-free.app/api/login',{
        email,
        password
      })

      // console.log(response);
      const userId=response.data._id;

      if (response.status === 200) {
        localStorage.setItem('userloggedin', true);
        window.location.href = '/user/' + userId; 
      } else if (response.status === 401) {
        alert('Invalid username or password');
      }

    }
    catch (error) {
      console.error('API call error:', error);
      alert('An error occurred. Please try again later.');
    }

    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    setErrorMessage(''); 
  }, [email,password]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center">
      <div className="shadow-md rounded-lg p-8 bg-white max-w-md w-full">
        <div>
          <h1 className="text-xl font-bold text-center text-blue-700">Login</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-700">Don't have an account?
          <a href="/register" className="text text-red-700"> Register Here</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
