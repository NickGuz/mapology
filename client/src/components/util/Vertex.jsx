import { useState, useContext, useEffect } from "react";
import { useMap, CircleMarker } from "react-leaflet";
import GlobalStoreContext from "../../store/store";
import * as RequestApi from "../../store/GlobalStoreHttpRequestApi";

const Vertex = (props) => {
  const [point, setPoint] = useState(null);

  const map = useMap();
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    setPoint(props.center);
  }, []);

  const removeVertex = (vertex) => {
    if (!window.confirm("Are you sure you want to delete this vertex?")) {
      return;
    }

    const lat = vertex.lat;
    const lng = vertex.lng;

    // Get the vertices to remove
    let toRemove = [];
    store.currentMap.json.features.forEach((f) => {
      f.geometry.coordinates[0].forEach((xy) => {
        if (xy[0] === lng && xy[1] === lat) {
          // toRemove.push({ feature: f, coords: xy });
          toRemove.push(f);
        }
      });
    });

    if (toRemove.length >= 3) {
      window.alert("Cannot delete a vertex shared by more than 2 regions");
      return;
    }

    // Remove the vertices
    // store.currentMap.json.features.forEach((f) => {
    //   f.geometry.coordinates[0] = f.geometry.coordinates[0].filter(
    //     (xy) => !(xy[0] === lng && xy[1] === lat)
    //   );
    // });
    toRemove.forEach((f) => {
      f.geometry.coordinates[0] = f.geometry.coordinates[0].filter(
        (coords) => !(coords[0] === lng && coords[1] === lat)
      );
    });

    store.setCurrentMap(store.currentMap);
    toRemove.forEach((f) => {
      RequestApi.updateFeatureGeometry(f.id, f.geometry);
    });
  };

  const trackCursor = (event) => {
    setPoint(event.latlng);
  };

  const updateFeature = () => {
    if (!point.lat || !point.lng) {
      return;
    }

    // Get all features with this coordinate
    // Not very efficient but doesn't noticeably slow anything down yet??
    let features = [];
    store.currentMap.json.features.forEach((f) => {
      let exists = false;
      if (f.geometry.type === "MultiPolygon") {
        f.geometry.coordinates.forEach((polygon) => {
          exists = polygon[0].find((p) => p[0] === props.center[1] && p[1] === props.center[0]);
        });
      } else {
        f.geometry.coordinates.forEach((polygon) => {
          exists = polygon.find((p) => p[0] === props.center[1] && p[1] === props.center[0]);
        });
      }

      if (exists) {
        features.push(f);
      }
    });

    // Update this coordinate in all features that share it
    let pnt;
    features.forEach((feature) => {
      feature.geometry.coordinates.forEach((polygon) => {
        if (feature.geometry.type === "MultiPolygon") {
          pnt = polygon[0].find((p) => p[0] === props.center[1] && p[1] === props.center[0]);
        } else {
          pnt = polygon.find((p) => p[0] === props.center[1] && p[1] === props.center[0]);
        }
      });

      if (!pnt) {
        return;
      }

      pnt[0] = point.lng;
      pnt[1] = point.lat;

      store.setCurrentMap(store.currentMap);
      RequestApi.updateFeatureGeometry(feature.id, feature.geometry);
    });
  };

  return (
    <>
      {point && (
        <CircleMarker
          center={point}
          pathOptions={{
            color: "blue",
            fillColor: "blue",
            bubblingMouseEvents: false,
            fillOpacity: 1.0,
          }}
          radius={5}
          draggable={true}
          eventHandlers={{
            dblclick: (e) => {
              removeVertex(e.latlng);
            },
            mousedown: (e) => {
              map.on("mousemove", trackCursor);
              map.dragging.disable();
            },
            mouseup: (e) => {
              map.off("mousemove");
              map.dragging.enable();
              updateFeature();
            },
          }}
        ></CircleMarker>
      )}
    </>
  );
};

export default Vertex;
