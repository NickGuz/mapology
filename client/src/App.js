import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import { AuthContextProvider } from './auth/AuthContextProvider';
import Navbar from './components/Navbar';
import MapListingScreen from './components/MapListingScreen'
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
import AccountRecoveryScreen from './components/AccountRecoveryScreen';
import { GlobalStoreContextProvider } from './store/store';
import MapEditor from './components/MapEditor';


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
                        <Route path='/account-recovery/' element={<AccountRecoveryScreen/>}/>
                        <Route path='/map-editor/' element = {<MapEditor/>}/>
                    </Routes>
                </GlobalStoreContextProvider>
            </AuthContextProvider>  
        </BrowserRouter>
    )
}

export default App