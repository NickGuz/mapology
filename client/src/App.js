import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import { AuthContextProvider } from './auth/AuthContextProvider';
import Navbar from './components/Navbar';
import MapListingScreen from './components/MapListingScreen'
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
import { GlobalStoreContextProvider } from './store/store';


const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<HomeScreen/>}/>
                        <Route path = '/register/' element = {<RegisterScreen/>}/>
                        <Route path = "/map-listings/" element = {<MapListingScreen/>}/>
                        <Route path='/profile/' element={<ProfileScreen/>}/>
                    </Routes>
                </GlobalStoreContextProvider>
            </AuthContextProvider>  
        </BrowserRouter>
    )
}

export default App