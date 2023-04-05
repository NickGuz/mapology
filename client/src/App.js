import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import { AuthContextProvider } from './auth/AuthContextProvider';
import Navbar from './components/Navbar';
import MapListingScreen from './components/MapListingScreen'
import RegisterScreen from './components/RegisterScreen';


const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <Navbar />
                <Routes>
                    <Route path = '/' element = {<RegisterScreen/>}/>
                    <Route path = "/map-listings/" element = {<MapListingScreen/>}/>

                </Routes>
                
            </AuthContextProvider>  
        </BrowserRouter>
    )
}

export default App