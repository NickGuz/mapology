import "./App.css";
import { React, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./auth/AuthContextProvider";
import Navbar from "./components/util/Navbar";
import MapListingScreen from "./components/screens/MapListingScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import HomeScreen from "./components/screens/HomeScreen";
import ProfileScreen from "./components/screens/ProfileScreen";
import AccountRecoveryScreen from "./components/screens/AccountRecoveryScreen";
import { GlobalStoreContextProvider } from "./store/store";
import MapEditor from "./components/screens/MapEditor";
import MapInfoScreen from "./components/screens/MapInfoScreen";
import PasswordResetScreen from "./components/screens/PasswordResetScreen";
import LoginScreen from "./components/screens/LoginScreen";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const App = () => {
  useEffect(() => {
    document.title = "Mapology";
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <AuthContextProvider>
          <GlobalStoreContextProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/register/" element={<RegisterScreen />} />
              <Route path="/map-listings/" element={<MapListingScreen />} />
              <Route path="/profile/:id" element={<ProfileScreen />} />
              <Route path="/account-recovery/" element={<AccountRecoveryScreen />} />
              <Route path="/map-editor/:id" element={<MapEditor />} />
              <Route path="/map-info/:id" element={<MapInfoScreen />} />
              <Route path="/password-reset/" element={<PasswordResetScreen />} />
              <Route path="/login/" element={<LoginScreen />} />
            </Routes>
          </GlobalStoreContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
