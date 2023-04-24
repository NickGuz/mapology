import React from 'react';

const Banner = (props) => {
    return (
        <img src={props.src} alt="User Banner" style={{ width: '100%', height: '200px', objectFit: 'cover' }}></img>
    );
}

export default Banner;