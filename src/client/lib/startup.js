import Promise from "bluebird";
import WebFont from "webfontloader";

const fonts = ["Roboto:400,500", "Alegreya Sans:400"];
let loadedFonts = 0;

const startup = () =>
  new Promise(resolve => {
    WebFont.load({
      google: {
        families: fonts
      },
      timeout: 2000,
      fontactive: () => {
        loadedFonts += 1;
        if (loadedFonts >= fonts.length) {
          resolve();
        }
      }
    });
  });

export default startup;
