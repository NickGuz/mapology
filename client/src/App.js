import "./App.css";
import { React, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./auth/AuthContextProvider";
import Navbar from "./components/Navbar";
import MapListingScreen from "./components/MapListingScreen";
import RegisterScreen from "./components/RegisterScreen";
import HomeScreen from "./components/HomeScreen";
import ProfileScreen from "./components/ProfileScreen";
import AccountRecoveryScreen from "./components/AccountRecoveryScreen";
import { GlobalStoreContextProvider } from "./store/store";
import MapEditor from "./components/MapEditor";
import MapInfoScreen from "./components/MapInfoScreen";
import PasswordResetScreen from "./components/PasswordResetScreen";
import LoginScreen from "./components/LoginScreen";
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
