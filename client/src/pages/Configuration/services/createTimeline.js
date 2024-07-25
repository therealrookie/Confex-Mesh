import { createLayer, createTimeline, setTimelineName } from "../../../services/api";

export async function createNewTimeline(name) {
  const timelineHandle = await createTimeline();
  setTimelineName(timelineHandle, name);
  return timelineHandle;
}

function determineLargestResolution(resolutions) {
  if (resolutions.includes("144:9")) {
    return "144:9";
  } else if (resolutions.includes("64:9")) {
    return "64:9";
  } else if (resolutions.includes("32:9")) {
    return "32:9";
  } else if (resolutions.includes("16:9")) {
    return "16:9";
  }
}

export function createNewLayer(timelineHandle, left, player, zone) {
  let largestResolution = determineLargestResolution(Object.values(player.sections));

  switch (largestResolution) {
    case "144:9":
      return addFullscreenLayer(timelineHandle, player.resource_handle);
    case "64:9":
      return add64by9Layer(timelineHandle, left, player, zone);
    case "32:9":
      return add32by9Layer(timelineHandle, left, player, zone);
    case "16:9":
      return add16by9Layer(timelineHandle, left, player.resource_handle);
    default:
      console.log("No matching resolution found");
      return 0;
  }
}

function addFullscreenLayer(timelineHandle, resourceId) {
  const bodyLeft = {
    timelineHandle: timelineHandle,
    width: 3840,
    height: 2160,
    xPos: -1800,
    yPos: -849,
    resourceID: resourceId,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };
  const layerLeft = createLayer(bodyLeft);
  const bodyRight = {
    timelineHandle: timelineHandle,
    width: 3840,
    height: 2160,
    xPos: 2040,
    yPos: 231,
    resourceID: resourceId,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };
  const layerRight = createLayer(bodyRight);
  return `${layerLeft},${layerRight}`;
}

function add64by9Layer(timelineHandle, left, player, zone) {
  const body = {
    timelineHandle: timelineHandle,
    width: 3840,
    height: 2160,
    xPos: 0,
    yPos: -849,
    resourceID: player.resource_handle,
    left: 0,
    right: 0,
    top: 0,
    bottom: 78.47,
  };
  if (zone == 1) {
    body.xPos = scale(left, 0, 55.56, -1800, 2336); // most left and right possible postions
    body.right = 13.96;
  } else if (zone == 2.1) {
    body.xPos = scale(left, 0, 77.78, -1800, 3988); // most left and right possible postions
    body.right = 56.93;
  } else if (zone == 2.2) {
    body.xPos = scale(left, 0, 77.78, -3452, 2336); // most left and right possible postions
    body.left = 43.07;
    body.right = 13.96;
  } else if (zone == 4.1) {
    body.xPos = scale(left, 0, 88.89, -1800, 4814); // most left and right possible postions
    body.right = 78.46;
  } else if (zone == 4.2) {
    body.xPos = scale(left, 0, 88.89, -2626, 3988); // most left and right possible postions
    body.left = 21.54;
    body.right = 56.92;
  } else if (zone == 4.3) {
    body.xPos = scale(left, 0, 88.89, -3452, 3162); // most left and right possible postions
    body.left = 43.07;
    body.right = 35.38;
  } else if (zone == 4.4) {
    body.xPos = scale(left, 0, 88.89, -4278, 2336); // most left and right possible postions
    body.left = 64.62;
    body.right = 13.96;
  }
  return createLayer(body);
}

function add32by9Layer(timelineHandle, left, player, zone) {
  const body = {
    timelineHandle: timelineHandle,
    width: 1920,
    height: 1080,
    xPos: 0,
    yPos: -307,
    resourceID: player.resource_handle,
    left: 0,
    right: 0,
    top: 0,
    bottom: 56.94,
  };
  if (zone == 1) {
    body.xPos = scale(left, 0, 77.78, -2760, 3028); // most left and right possible postions
    body.right = 13.96;
  } else if (zone == 2.1) {
    body.xPos = scale(left, 0, 88.89, -2760, 3854); // most left and right possible postions
    body.right = 56.93;
  } else if (zone == 2.2) {
    body.xPos = scale(left, 0, 88.89, -3586, 3028); // most left and right possible postions
    body.left = 43.07;
    body.right = 13.96;
  }
  return createLayer(body);
}

function add16by9Layer(timelineHandle, left, resourceId) {
  const body = layerBody(timelineHandle, resourceId, 1920, 1080, -307);

  body.xPos = scale(left, 0, 88.89, -2760, 3854);
  body.right = 56.93;
  body.bottom = 56.94;

  return createLayer(body);
}

const layerBody = (timelineHandle, resourceId, width, height, yPos) => {
  return {
    timelineHandle: timelineHandle,
    width: width,
    height: height,
    xPos: 0,
    yPos: yPos,
    resourceID: resourceId,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };
};

export function scale(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
