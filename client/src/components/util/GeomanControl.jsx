import { useEffect, useContext } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import GlobalStoreContext from '../../store/store';
import { merge } from '../../util/editing/merge';

const GeomanControl = (props) => {
  const map = useMap();
  const { store } = useContext(GlobalStoreContext);

  // A bit of a hacky workaround for store being stuck in a closure, but oh well
  useEffect(() => {
    const mergeButton = document.querySelector('.merge-button');
    if (!mergeButton) return;
    mergeButton.onclick = () => merge(store);
  }, [store]);

  useEffect(() => {
    map.pm.addControls({
      position: 'topright',
      drawCircle: false,
      drawText: true,
      rotateMode: false,
      drawMarker: false,
      drawPolyline: false,
      drawCircleMarker: false,
      drawRectangle: false,
      cutPolygon: false,
      dragMode: true,
      oneBlock: true,
    });

    if (!map.pm.Toolbar.options.split) {
      map.pm.Toolbar.copyDrawControl('Polyline', {
        name: 'split',
        block: 'draw',
        title: 'Split',
      });
    }

    map.pm.setGlobalOptions({
      limitMarkersToCount: 10,
      hideMiddleMarkers: false,
      snapDistance: 10000, // essentially force snapping
    });

    map.pm.setPathOptions({
      fillColor: 'blue',
    });

    // Create buttons for merge, edit attributes
    if (!map.pm.Toolbar.options.merge) {
      map.pm.Toolbar.createCustomControl({
        name: 'merge',
        block: 'edit',
        title: 'Merge',
        className: 'merge-button',
        toggle: false,
        // onClick: () => merge(store),
      });
    }

    if (!map.pm.Toolbar.options.editAttributes) {
      map.pm.Toolbar.createCustomControl({
        name: 'editAttributes',
        block: 'edit',
        title: 'Edit Attributes',
        className: 'edit-attributes-button',
        toggle: false,
        onClick: () => props.setPropOpen(true),
      });
    }

    map.pm.Toolbar.changeControlOrder([
      'drawPolygon',
      'split',
      'editMode',
      'merge',
      'dragMode',
      'removalMode',
      'editAttributes',
      'drawText',
    ]);
  }, []);

  return <></>;
};

export default GeomanControl;
