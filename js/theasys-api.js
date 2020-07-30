let THEA = {

    debug: true,
    panoLinks: {},

    apiSet(key, value) {
        THEA.iframe.postMessage(
            { type: "api", key, action: "set", value },
            "https://www.theasys.io"
        );
    },
    apiGet(key) {
        THEA.iframe.postMessage(
            { type: "api", key, action: "get" },
            "https://www.theasys.io"
        );
    },
    apiListen(key, fn) {
        const eventHandler = (event) => {
            const data = event.data;
            if (data[key]) fn(data[key]);
        };
        window.addEventListener("message", eventHandler, false);
    },
    init() {

        THEA.iframe = document.querySelector("#theasys-pano").contentWindow;

        // create list of pano-links
        THEA.apiListen("panoramas", (panos) => {
            panos.forEach((pano) => (THEA.panoLinks[pano.title] = pano.rnd));
            if (THEA.debug) console.log(panos);
        });

        // log stuff on the console
        const logfn = (tmplfn) => (data) => {
            if (THEA.debug) console.log(tmplfn(data));
        };

        THEA.apiListen(
            "move",
            logfn((_) => `move ${_.value}° ${_.direction}`)
        );
        THEA.apiListen(
            "lon",
            logfn((_) => `longitude: ${_}`)
        );
        THEA.apiListen(
            "lat",
            logfn((_) => `latitude: ${_}`)
        );
        THEA.apiListen(
            "fov",
            logfn((_) => `field of vision: ${_}`)
        );
        THEA.apiListen(
            "direction",
            logfn((_) => `direction: ${_}`)
        );

        // get panos
        THEA.apiGet("panoramas");

    }
}

// the theasys frame will issue a loaded event ...
THEA.apiListen("loaded", () => {
  console.log("Theasys loaded.");
  THEA.init();
});
