import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

const GeomanControl = () => {
  const map = useMap();

  useEffect(() => {
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawText: true,
      rotateMode: false,
      drawMarker: false,
      drawPolyline: false,
      drawCircleMarker: false,
      drawRectangle: false,
      cutPolygon: false,
      dragMode: false,
    });

    if (!map.pm.Toolbar.options.Split) {
      map.pm.Toolbar.copyDrawControl('Polyline', {
        name: 'Split',
        block: 'draw',
        title: 'Split',
      });
    }

    map.pm.setGlobalOptions({
      limitMarkersToCount: 10,
      hideMiddleMarkers: false,
    });
  }, []);

  return <></>;
};

export default GeomanControl;
