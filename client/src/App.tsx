import Signup from './components/Signup';
import Login from './components/Login';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/context';
import UpdateUserInfo from './components/UpdateUserInfo';


function App() {
  const { isLogin } = useAuth();
  return (
    <div>
      <Navbar></Navbar>
       
      <Routes>
        {
          isLogin ? (<Route path='/' element={<HomePage />} />) : (<Route path='/' element={<LandingPage />} />)
        }

        <Route path='/login' element={<Login />} />
        <Route path='signup' element={<Signup />} />

        <Route path="/updateUserInfo" element={<UpdateUserInfo />} />


      </Routes>
    </div>
  )
}

export default App
