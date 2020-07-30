let THEA = {
  debug: false,
  panoLinks: {}
};

document.addEventListener("DOMContentLoaded", () => {

  THEA.iframe = document.querySelector("#theasys-pano");
  THEA.iframe.addEventListener("load", async function () {

    //console.log("iframe loaded");
    const THEASYS = document.querySelector("#theasys-pano").contentWindow.THEASYS;
    const api = THEASYS.api;
    
    THEA.apiSet = async function (key, value) {
      return await new Promise((resolve) =>
        api.engine.execute("set", key, value, (x) => resolve(x))
      );
    };
    
    THEA.apiGet = async function (key) {
      return await new Promise((resolve) =>
        api.engine.execute("get", key, null, (x) => resolve(x))
      );
    };
 
    // create list of pano links
    // const panos = await THEA.apiGet("panoramas"); // not working locally
    let panos = Object.values(THEASYS.renderer.panoramas());
    panos.forEach((pano) => (THEA.panoLinks[pano.title] = pano.rnd));
    
  });
});
