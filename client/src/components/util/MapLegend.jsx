import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import './MapLegend.css';

const MapLegend = (props) => {
  const map = useMap();
  const legendRef = useRef(null);

  useEffect(() => {
    if (map) {
      if (!legendRef.current) {
        legendRef.current = L.control({ position: 'bottomleft' });

        legendRef.current.onAdd = () => {
          const div = L.DomUtil.create('div', 'info legend');
          return div;
        };

        legendRef.current.addTo(map);
      }

      const legendContent = props.currentFill
        .map((color) => `<i style="background:${color}"></i> ${color}<br>`)
        .join('');

      legendRef.current.getContainer().innerHTML = legendContent;
    }
  }, [map, props.currentFill]);

  return null;
};

export default MapLegend;