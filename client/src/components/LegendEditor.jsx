import React from 'react'
import { TwitterPicker } from "react-color";

const LegendEditor = () => {
  return (
    <div style={{ paddingBottom: "20px", borderBottom: "1px solid", borderColor: "darkgray" }}>
      <p
        id="text-header"
        style={{
          paddingTop: "0px",
          color: "dimgray",
          fontSize: "120%",
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "darkgray",
          backgroundColor: "silver",
        }}
      >
        Legend
      </p>
      <div style={{ display: "flex", justifyContent: "center"}}>
        <TwitterPicker />
      </div>
    </div>
  );
}

export default LegendEditor