import logo from './logo.svg';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Register from './Register'
import User from './User';
import Redirect from './Redirect';
import Analytics from './Analytics';

// /user/id-> homepage
// /login
// /register



function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="user/:userId" element={<User />} />
          <Route path="redirect" element={<Redirect />} />
          <Route path="analytics/:qrId" element={<Analytics />} />



          {/* <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
