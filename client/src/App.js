import './App.css';
import { React } from 'react'
import { BrowserRouter} from 'react-router-dom'
import { AuthContextProvider } from './auth';


import RegisterScreen from './components/RegisterScreen';


const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <RegisterScreen/>
            </AuthContextProvider>  
        </BrowserRouter>
    )
}

export default App