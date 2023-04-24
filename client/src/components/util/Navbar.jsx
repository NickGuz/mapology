import React, { useState, useContext } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import { Button, InputBase } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../auth/AuthContextProvider";
import GlobalStoreContext from "../../store/store";
import LoginModal from "../modals/LoginModal";
import ImportModal from "../modals/ImportModal";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsModal from "../modals/SettingsModal";

const Navbar = (props) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);

  const handleHome = (event) => {
    navigate("/");
  };
  const handleOpenUserMenu = (event) => {
    console.log(auth.user);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleRegister = () => {
    // close the user menu
    setAnchorElUser(null);
    navigate("/register/");
  };

  const handleLogin = () => {
    // close the user menu
    setAnchorElUser(null);
    navigate("/login/");
  };

  const handleLogout = () => {
    auth.logoutUser();
    setAnchorElUser(null);
  };

  const handleImport = () => {
    store.setOpenImportDialog(true);
  };

  const handleBrowse = () => {
    store.setCurrentMap(null);
    navigate("/map-listings/");
  };

  const handleProfile = () => {
    setAnchorElUser(null);
    navigate("/profile/");
  };

  const handleSettings = () => {
    store.setOpenSettingsModal(true);
    setAnchorElUser(null);
  };

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginRight: 10,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  const getGuestButtons = () => {
    return (
      <div>
        <MenuItem key={"Log In"} onClick={handleLogin}>
          <Typography textAlign="center">Log In</Typography>
        </MenuItem>
        <MenuItem key={"Register"} onClick={handleRegister}>
          <Typography textAlign="center">Register</Typography>
        </MenuItem>
        {/* TEMPORARY */}
        <MenuItem key="Profile" onClick={handleProfile}>
          <Typography textAlign="center">Profile</Typography>
        </MenuItem>
        <MenuItem key={"Settings"} onClick={handleSettings}>
          <Typography textAlign="center">Settings</Typography>
        </MenuItem>
      </div>
    );
  };

  const getLoggedInButtons = () => {
    return (
      <div>
        <MenuItem key={"Profile"} onClick={handleProfile}>
          <Typography textAlign="center">Profile</Typography>
        </MenuItem>
        <MenuItem key={"Settings"} onClick={handleSettings}>
          <Typography textAlign="center">Settings</Typography>
        </MenuItem>
        <MenuItem key={"Log Out"} onClick={handleLogout}>
          <Typography textAlign="center">Log out</Typography>
        </MenuItem>
      </div>
    );
  };

  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="100%">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={handleHome}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Mapology
            </Typography>

            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <Search sx={{ flexGrow: 0, height: "80%" }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search..." inputProps={{ "aria-label": "search" }} />
              </Search>

              <Button
                key="Import"
                onClick={handleImport}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Import
              </Button>

              <Button
                key="Browse"
                onClick={handleBrowse}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Browse
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexGrow: 0, alignItems: "center" }}>
              <DarkModeIcon sx={{ width: 30, height: 30, mr: 1 }} />
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Avatar" src="" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {auth.user ? getLoggedInButtons() : getGuestButtons()}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <LoginModal />
      <ImportModal />
      <SettingsModal />
    </div>
  );
};

export default Navbar;
