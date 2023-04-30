import {useEffect } from 'react';
import L from 'leaflet';
import { useMap } from "react-leaflet";
import "./MapLegend.css";

const MapLegend = (props) => {
    const map = useMap();    
    useEffect(() => {
      if (map) {
        const legend = L.control({ position: "bottomleft" });

        legend.onAdd = () => {
          const div = L.DomUtil.create("div", "info legend");
          div.innerHTML += 'asdsdd TESTING';
          return div;
        };
        legend.addTo(map);
      }
    }, [map]);
    return null;
  }

export default MapLegend;