import './App.css';
import { React } from 'react'
import { BrowserRouter} from 'react-router-dom'
import { AuthContextProvider } from './auth/AuthContextProvider';
import Navbar from './components/Navbar';


import RegisterScreen from './components/RegisterScreen';


const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <Navbar />
                <RegisterScreen/>
            </AuthContextProvider>  
        </BrowserRouter>
    )
}

export default App