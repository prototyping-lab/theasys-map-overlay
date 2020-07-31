// wrap it
(function () {
  const svgMaps = document.querySelectorAll(".overlay-map");
  const svgGui = document.querySelector(".overlay-gui");

  const minHeightLegend = "360px";
  const minHeight = 250;
  const minHeightMap = minHeight * 0.96 + "px";
  const minHeightGui = minHeight * 0.65 + "px";
  window.svgGui = svgGui;

  let maps = {};

  ////////////////////////////////////////////////////////////////////////////////
  // elevator

  let currentFloorElement = null;
  let currentRoomElement = null;
  let currentFloor = 'H0';

  // load elevator svg (map switching gui) , adding custom css and click handlers
  svgGui.addEventListener("load", () => {
    const svg = svgGui.contentDocument;
    const stylesheet = svg.styleSheets[0];

    // style hover
    stylesheet.insertRule(".cls-1:hover { fill: #fff; opacity: 0.5 }");

    // no interaction with the text
    stylesheet.insertRule(".cls-2 { pointer-events: none }");

    // style current floor
    stylesheet.insertRule(".current-floor rect { fill: #fff; opacity: 0.5 }");

    // add transition
    stylesheet.insertRule(`* {transition: all 0.1s !important; }`, 0);

    // hide if the gui is too small
    stylesheet.insertRule(
      `@media (max-height:${minHeightGui}) { :root { visibility: hidden ; }}`,
      0
    );

    
    const floors = svg.querySelectorAll("#floors > g");
    floors.forEach((floorElement) => {

      const id = floorElement.id.replace(/^floor-/, "");

      // set currentFloorElement on init
      if(id === currentFloor) {
        currentFloorElement = floorElement;
        currentFloorElement.classList.add("current-floor");
      }

      // add click handlers for every single floor
      floorElement.addEventListener("click", () => {
        if (floorElement === currentFloorElement) {
          toggleCurrentMap();
        } else {
          // activate other map
          currentFloor = id;
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

      // hightlight current room
      stylesheet.insertRule(
        '#Room g .current-room, #Rooms g .current-room, [data-name="Rooms"] g .current-room { opacity: 1; }',
        0
      );

      // hightlight hovered room
      stylesheet.insertRule(
        '#Room g :not(.current-room):hover, #Rooms g :not(.current-room):hover, [data-name="Rooms"] g :not(.current-room):hover { opacity: 1;  }',
        0
      );

      // do transitions
      stylesheet.insertRule(`* {transition: all 0.1s !important; }`, 0);

      // hide complete map if the map is too small
      stylesheet.insertRule(
        `@media (max-height:${minHeightMap}) { * { visibility: hidden ; }}`,
        0
      );

      // hide map legends if the map is too small
      [
        "H0Hintergrund",
        "H1Hintergurnd",
        "H2Hintergrund",
        "H3Hintergrund",
        "HuHintergrund",
      ].forEach((id) => {
        stylesheet.insertRule(
          `@media (max-height:${minHeightLegend}) {  #${id} :not(.cls-1) { visibility: hidden ; }}`,
          0
        );
      });

      // Disable interaction for background
      stylesheet.insertRule(
        '#Grundriss, [data-name="Grundriss"] { pointer-events: none }'
      );

      // add click handlers for every single room ( make sure they have an id )
      let rooms = svg.querySelectorAll(
        '#Room g[id], #Rooms g[id], [data-name="Rooms"] g[id]'
      );

      rooms.forEach((room) => {
        // click handler
        room.addEventListener("click", () => {
          panoLink = THEA.panoLinks[room.id];
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
})();
