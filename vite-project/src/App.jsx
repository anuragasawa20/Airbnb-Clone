import './App.css'
import { Routes, Route } from 'react-router-dom';
import IndexPage from './pages/indexPage';
import Layout from './layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios'
import { UserContextProvider } from './UserContext';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';
import PlaceSearch from './pages/PlaceSearch';
import PlaceByCategory from './pages/PlaceByCategory';

axios.defaults.baseURL = import.meta.env.VITE_Server_Base_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route index element={<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/Register' element={<RegisterPage />} />
          <Route path='/account/' element={<ProfilePage />} />
          <Route path='/account/places' element={<PlacesPage />} />
          <Route path='/account/places/new' element={<PlacesFormPage />} />
          <Route path='/account/places/:id' element={<PlacesFormPage />} />
          <Route path='/place/:id' element={<PlacePage />} />
          <Route path='/place/search/:location' element={<PlaceSearch />} />
          <Route path='/placeType/:category' element={<PlaceByCategory />} />

          <Route path='/account/bookings/' element={<BookingsPage />} />
          <Route path='/account/bookings/:id' element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
