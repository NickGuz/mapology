import React from 'react';
import MapGrid from './MapGrid';
import Banner from './Banner';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Avatar, Grid } from '@mui/material';

const InfoBanner = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'left',
    backgroundColor: '#d7d7d7',
    height: 60,
    lineHeight: '60px',
    marginTop: '-5px', // Hide whitespace on top 
    paddingLeft: '5%',
    paddingTop: '1%',
    paddingBottom: '1%'
}));

const ProfileScreen = (props) => {
    return (
        <>
        <Banner src={require('../assets/tree.jpg')} />
        <InfoBanner key='user-info' elevation={4}>
            <Grid container spacing={2}>
                <Grid item xs={1}>
                    <Avatar 
                        sx={{ 
                            height: 70,
                            width: 70
                        }} 
                        alt="User Profile Image" 
                        src={require('../assets/sample_avatar.png')} 
                    />
                </Grid>
                <Grid item >
                    <Typography variant="h5">BonJon</Typography>  
                    <Typography>Hi, I'm John and I like reading books and eating chips in my free time.</Typography>
                </Grid>
            </Grid>
        </InfoBanner>
        <MapGrid mapData={data} />
        </>
    );
}

const data = [
    {
        title: "Italy",
        description: "A map of Italy",
        imgPath: ""
    },
    {
        title: "Germany",
        description: "A map of Germany",
        imgPath: ""
    },
    {
        title: "USA",
        description: "A map of the USA",
        imgPath: ""
    },
    {
        title: "China",
        description: "A map of China",
        imgPath: ""
    },
    {
        title: "Japan",
        description: "A map of Japan",
        imgPath: ""
    },
    {
        title: "Russia",
        description: "A map of Russia",
        imgPath: ""
    },
];

export default ProfileScreen;
