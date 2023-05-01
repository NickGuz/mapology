import {React, useState} from 'react'
import { CirclePicker } from "react-color";
import ChangeLegendModal from "../modals/ChangeLegendModal";

const LegendEditor = (props) => {
  const [editOpen, setEditOpen] = useState(false);
  const [color, setColor] = useState('');

  const handleChange = (hexCode, e) => {
    setColor(hexCode.hex);
    setEditOpen(true);
  };


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
        <CirclePicker
        colors={props.currentFill}
        onChangeComplete={handleChange}
        />
      </div>
      <ChangeLegendModal
              rename={(color, name) => props.rename(color, name)}
              show={editOpen}
              color={color}
              close={() => setEditOpen(false)}
            />
    </div>
  );
}

export default LegendEditor