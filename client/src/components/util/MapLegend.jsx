import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import './MapLegend.css';
import { getAllLegendsByMapId } from "../../store/GlobalStoreHttpRequestApi";
import { useParams } from "react-router-dom";

const MapLegend = (props) => {
  const map = useMap();
  const legendRef = useRef(null);
  const routeParams = useParams();

  useEffect(() => {
    if (map) {
      const fetchLegends = async () => {
        const allLegends = await getAllLegendsByMapId(routeParams.id);

        if (!legendRef.current) {
          legendRef.current = L.control({ position: 'bottomleft' });
  
          legendRef.current.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            return div;
          };
  
          legendRef.current.addTo(map);
        }

        const colors = Object.keys(props.currentLegend);
        const legendContent = allLegends.data.data
          .filter(({ color }) => colors.includes(color))
          .map(({ color, label }) => `<i style="background:${color}"></i> ${label}<br>`)
          .join('');
        
        legendRef.current.getContainer().innerHTML = legendContent;
      }
      fetchLegends().catch(console.error);
    }
  }, [map, props.currentLegend, legendRef]);

  return null;
};

export default MapLegend;