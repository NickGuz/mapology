import React, { useState, useContext } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import { Button, InputBase } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../auth/AuthContextProvider';
import GlobalStoreContext from '../../store/store';
import LoginModal from '../modals/LoginModal';
import ImportModal from '../modals/ImportModal';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsModal from '../modals/SettingsModal';
import SearchBar from '@mkyy/mui-search-bar';
import * as RequestApi from '../../store/GlobalStoreHttpRequestApi';

const Navbar = (props) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const location = useLocation();

  const handleHome = (event) => {
    store.setCurrentMap(null);
    navigate('/');
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleRegister = () => {
    // close the user menu
    setAnchorElUser(null);
    store.setCurrentMap(null);
    navigate('/register/');
  };

  const handleLogin = () => {
    // close the user menu
    setAnchorElUser(null);
    store.setCurrentMap(null);
    navigate('/login/');
  };

  const handleLogout = () => {
    auth.logoutUser();
    store.setCurrentMap(null);
    setAnchorElUser(null);
  };

  const handleImport = () => {
    store.setOpenImportDialog(true);
  };

  const handleBrowse = () => {
    store.setCurrentMap(null);
    store.setSearchTerm(null);
    // store.setSearchTags([]);
    console.log('setting search term to null');
    navigate('/map-listings/');
  };

  const handleProfile = () => {
    setAnchorElUser(null);
    store.setCurrentMap(null);
    navigate('/profile/');
  };

  const handleSettings = () => {
    store.setOpenSettingsModal(true);
    setAnchorElUser(null);
  };

  const handleSearch = () => {
    store.setCurrentMap(null);
    store.setDisplayedMaps([]);
    console.log('setting search term', searchValue);
    store.setSearchTerm(searchValue);
    // if (location.pathname !== "/map-listings/") {
    //   store.setSearchTags([]);
    // }
    navigate('/map-listings/');
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
    // store.setSearchTerm(value);
  };

  const getGuestButtons = () => {
    return (
      <div>
        <MenuItem key={'Log In'} onClick={handleLogin}>
          <Typography textAlign="center">Log In</Typography>
        </MenuItem>
        <MenuItem key={'Register'} onClick={handleRegister}>
          <Typography textAlign="center">Register</Typography>
        </MenuItem>
        {/* TEMPORARY */}
        <MenuItem key="Profile" onClick={handleProfile}>
          <Typography textAlign="center">Profile</Typography>
        </MenuItem>
        <MenuItem key={'Settings'} onClick={handleSettings}>
          <Typography textAlign="center">Settings</Typography>
        </MenuItem>
      </div>
    );
  };

  const getLoggedInButtons = () => {
    return (
      <div>
        <MenuItem key={'Profile'} onClick={handleProfile}>
          <Typography textAlign="center">Profile</Typography>
        </MenuItem>
        <MenuItem key={'Settings'} onClick={handleSettings}>
          <Typography textAlign="center">Settings</Typography>
        </MenuItem>
        <MenuItem key={'Log Out'} onClick={handleLogout}>
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
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Mapology
            </Typography>

            <Box sx={{ display: 'flex', flexGrow: 0}}>
            <Button
                key="Home"
                onClick={handleHome}
                sx={{ mt: 2, color: 'white', display: 'block' }}
              >
                Home
              </Button>
              <Button
                key="Import"
                onClick={handleImport}
                sx={{ mt: 2, color: 'white', display: 'block' }}
              >
                Import
              </Button>

              <Button
                key="Browse"
                onClick={handleBrowse}
                sx={{ mt: 2, color: 'white', display: 'block' }}
              >
                Browse
              </Button>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 20, // I literally can't figure out how to center it so doing this idk
              }}
            >
              <SearchBar
                value={searchValue}
                placeholder={'Search...'}
                style={{
                  color: 'black',
                  backgroundColor: '#6bb5ff',
                }}
                onChange={handleSearchChange}
                onSearch={handleSearch}
              />
            </Box>

            <Box sx={{ display: 'flex', flexGrow: 0, alignItems: 'center' }}>
              <DarkModeIcon sx={{ width: 30, height: 30, mr: 1 }} />
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Avatar" src="" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
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
