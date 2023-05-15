import React from 'react';

const Banner = (props) => {
    return (
        <img src={props.src} alt="User Banner" style={{ width: '100%', height: '100px', objectFit: 'cover' }}></img>
    );
}

export default Banner;