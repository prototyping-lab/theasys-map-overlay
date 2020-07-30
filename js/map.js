const svgMaps = document.querySelectorAll(".overlay-map");
const svgGui = document.querySelector(".overlay-gui");

window.svgGui = svgGui;

let maps = {};
let panoLinks = {};

// hilite: transparent hilite color
// lolite: opaque lolight color
// hilite2: opaque hilight color

const palette = {
  darkgray: { lolite: "#aaa", hilite: "#dda", hilite2: "#dda" },
  lightgray: { lolite: "#d1d1d1", hilite: "#ffc", hilite2: "#ffc" },
  blue: { lolite: "#66c3f9", hilite: "#0cf", hilite2: "#a3dbfb" },
  purple: { lolite: "#908ac6", hilite: "#a6b", hilite2: "#bcb9dd" },
  green: { lolite: "#b1db66", hilite: "#9e6", hilite2: "#c2f5a3" },
  orange: { lolite: "#ffa266", hilite: "#f86", hilite2: "#ffb7a3" },
};

const styles = {
  Hu: {
    /*
          ".cls-1": palette.lightgray,
          ".cls-2": palette.darkgray,
          */
  },
  H0: {
    /*
          ".cls-1": palette.blue,
          ".cls-2": palette.purple,
          ".cls-3": palette.darkgray,
          ".cls-4": palette.lightgray
          */
  },
  H1: {
    /*
          ".cls-1": palette.lightgray,
          ".cls-3": palette.darkgray,
          ".cls-4": palette.green,
          ".cls-5": palette.orange
          */
  },
  H2: {
    /*
          ".cls-1": palette.lightgray,
          ".cls-2": palette.darkgray
          */
  },
  H3: {
    /*
          ".cls-1": palette.lightgray,
          ".cls-2": palette.darkgray
          */
  },
  Elevator: {
    ".st0": {
      fill: "#ccc",
      current: "#ddd",
      hilite: "#fff",
      stroke: "#000",
      strokeWidth: "1px",
      opacity: ".4",
    },
    ".st2": {
      fill: "#000",
      opacity: ".7",
    },
  },
};

////////////////////////////////////////////////////////////////////////////////
// elevator

let currentFloorElement = null;
let currentRoomElement = null;
let currentFloor = "EG";

// load elevator svg (map switching gui) , adding custom css and click handlers
svgGui.addEventListener("load", () => {
  const svg = svgGui.contentDocument;
  const stylesheet = svg.styleSheets[0];
  const title = svg.querySelector("title").innerHTML;
  const style = styles[title];

  // inject font into SVG using the fontFace API (too experimental?)
  const svgFont = new FontFace(
    "AtlasGrotesk-Black",
    "url(./fonts/AtlasGrotesk-Black-Web.woff)"
  );
  svgFont.load().then((font) => {
    svg.fonts.add(font);
  });

  // adjust box style
  const st0 = style[".st0"];
  stylesheet.insertRule(
    `.st0 { opacity: ${st0.opacity} ; fill: ${st0.fill} !important; stroke-width: ${st0.strokeWidth} !important;  stroke: ${st0.stroke} !important  }`
  );

  // additional styles for hovering
  stylesheet.insertRule(
    `.st0:hover { fill: ${st0.hilite} !important; opacity: 1 }`,
    0
  );

  // additional style for the current floor
  stylesheet.insertRule(
    `.current-floor > .st0 { fill: ${st0.current} !important; opacity: 1;}`,
    0
  );

  // adjust text style
  const st2 = style[".st2"];
  stylesheet.insertRule(
    `.st2 { opacity: ${st2.opacity} !important; fill: ${st2.fill} !important; }`,
    0
  );
  stylesheet.insertRule(`.st2 { pointer-events: none; }`);

  // add transitions
  stylesheet.insertRule(`* {transition: fill 0.2s !important; }`, 0);
  //stylesheet.insertRule(`* {transition: all 0.1s !important; }`, 0);

  // add click handlers for every single floor
  SVG = svg;
  const floors = svg.querySelectorAll("#floors > g");
  floors.forEach((floorElement) => {
    floorElement.addEventListener("click", () => {
      if (floorElement === currentFloorElement) {
        toggleCurrentMap();
      } else {
        // activate other map
        currentFloor = floorElement.id.replace(/^floor-/, "");
        console.log(`Go to floor: ${currentFloor}`);
        showMap(currentFloor);

        if (currentFloorElement) {
          currentFloorElement.classList.remove("current-floor");
        }
        currentFloorElement = floorElement;
        currentFloorElement.classList.add("current-floor");
      }
    });
  });
});

////////////////////////////////////////////////////////////////////////////////
// maps

function showMap(floor) {
  for (const [id, map] of Object.entries(maps)) {
    if (id === floor) {
      // show this map
      map.classList.add("visible");
    } else {
      // hide all other maps
      map.classList.remove("visible");
    }
  }
}

function hideCurrentMap() {
  // hide all the maps
  for (const [id, map] of Object.entries(maps)) {
    map.classList.remove("visible");
  }
}

function toggleCurrentMap() {
  for (const [id, map] of Object.entries(maps)) {
    if (id === currentFloor) {
      map.classList.toggle("visible");
    }
  }
}

// load svg maps, adding custom css and click handlers
svgMaps.forEach((svgElement) => {
  svgElement.addEventListener("load", () => {
    const svg = svgElement.contentDocument;
    const floor = svg.querySelector("g > g").id;

    // register map
    maps[floor] = svgElement;

    // show the current floor
    if (floor === currentFloor) {
      svgElement.classList.add("visible");
    }

    // inject styles
    const stylesheet = svg.styleSheets[0];

    // this kinda sucks 🤷‍♂
    stylesheet.insertRule(
      '#Room g .current-room, #Rooms g .current-room, [data-name="Rooms"] g .current-room { opacity: 1; }',
      0
    );
    stylesheet.insertRule(
      '#Room g :not(.current-room):hover, #Rooms g :not(.current-room):hover, [data-name="Rooms"] g :not(.current-room):hover { opacity: 1;  }',
      0
    );

    // Disable interaction for background
    stylesheet.insertRule(
      '#Grundriss, [data-name="Grundriss"] { pointer-events: none }'
    );

    /*

          const style = styles[floor];

          // set style for each entry in our style object
          for (const [selector, color] of Object.entries(style)) {
            // additional styles for the current room
            stylesheet.insertRule(
              `${selector}.current-room { fill: ${color.hilite2} !important; }`,
              0
            );

            // remove transparency, use corresponding color
            stylesheet.insertRule(
              `${selector} { opacity: 1 !important; fill: ${color.lolite} !important; }`,
              0
            );

            // additional styles for hovering
            stylesheet.insertRule(
              `${selector}:not(.current-room):hover { opacity: 1; fill: ${color.hilite2} !important; }`,
              0
            );

            // add transitions for fill colors
            stylesheet.insertRule(
              `${selector} {transition: fill 0.1s !important; }`,
              0
            );
   
          };
          */

    // add click handlers for every single room ( make sure they have an id )
    let rooms = svg.querySelectorAll(
      '#Room g[id], #Rooms g[id], [data-name="Rooms"] g[id]'
    );

    rooms.forEach((room) => {
      // click handler
      room.addEventListener("click", () => {
        panoLink = panoLinks[room.id];
        if (panoLink) {
          console.log(`Go to room: ${room.id} (${panoLink})  `);

          if (currentRoomElement) {
            currentRoomElement.classList.remove("current-room");
          }
          currentRoomElement = room.querySelector("path, polygon, rect");
          currentRoomElement.classList.add("current-room");

          THEA.apiSet("panorama", panoLink);

          hideCurrentMap();
        } else {
          console.warn(`No valid Pano-Link for Room  ${room.id}`);
          alert(`No valid Pano-Link for Room  ${room.id}`);
        }
      });
    });
  });
});
