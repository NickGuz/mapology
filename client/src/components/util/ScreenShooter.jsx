import * as L from 'leaflet';
import { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-simple-map-screenshoter';
import GlobalStoreContext from '../../store/store';
import { insertThumbnail } from '../../store/GlobalStoreHttpRequestApi';
// import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";

const ScreenShooter = () => {
  const [screenshoter, setScreenshoter] = useState(null);
  const [hasTakenSS, setHasTakenSS] = useState(false);
  const map = useMap();
  const { store } = useContext(GlobalStoreContext);

  let pluginOptions = {
    cropImageByInnerWH: true, // crop blank opacity from image borders
    hidden: false, // hide screen icon
    preventDownload: false, // prevent download on button click
    domtoimageOptions: {}, // see options for dom-to-image
    position: 'topleft', // position of take screen icon
    screenName: 'screen', // string or function
    // iconUrl: ICON_SVG_BASE64, // screen btn icon base64 or url
    hideElementsWithSelectors: [
      '.leaflet-control-container' /*, '.countryLabel'*/,
    ], // by default hide map controls All els must be child of _map._container
    mimeType: 'image/png', // used if format == image,
    caption: null, // string or function, added caption to bottom of screen
    captionFontSize: 15,
    captionFont: 'Arial',
    captionColor: 'black',
    captionBgColor: 'white',
    captionOffset: 5,
    // callback for manually edit map if have warn: "May be map size very big on that zoom level, we have error"
    // and screenshot not created
    onPixelDataFail: async function ({
      // node,
      plugin,
      // error,
      // mapPane,
      domtoimageOptions,
    }) {
      // Solutions:
      // decrease size of map
      // or decrease zoom level
      // or remove elements with big distanses
      // and after that return image in Promise - plugin._getPixelDataOfNormalMap
      return plugin._getPixelDataOfNormalMap(domtoimageOptions);
    },
  };

  useEffect(() => {
    const takeScreenshot = async () => {
      await new Promise((r) => setTimeout(r, 500));
      let format = 'image';
      screenshoter.takeScreen(format).then((base64) => {
        console.log('inserting thumbnail for map', store.currentMap.mapInfo.id);
        insertThumbnail(store.currentMap.mapInfo.id, base64);
      });
      setHasTakenSS(true);
    };

    if (!screenshoter) {
      let ss = L.simpleMapScreenshoter(pluginOptions).addTo(map);
      setScreenshoter(ss);
    } else if (store.currentMap && !hasTakenSS) {
      takeScreenshot();
    }
  }, [screenshoter, store.currentMap]);

  return <></>;
};

export default ScreenShooter;
