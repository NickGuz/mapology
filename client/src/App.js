import './App.css';
import { React } from 'react'
import { BrowserRouter} from 'react-router-dom'

import RegisterScreen from './components/RegisterScreen';


const App = () => {   
    return (
        <BrowserRouter>
            <RegisterScreen/>
            
        </BrowserRouter>
    )
}

export default App