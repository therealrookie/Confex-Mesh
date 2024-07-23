import { createTimeline, setTimelineName } from "../../../services/api";

export async function createNewTimeline(name) {
  const timelineHandle = await createTimeline();
  setTimelineName(timelineHandle, name);
  return timelineHandle;
}

export function createNewLayer(timelineHandle, left, player, zone) {
  console.log("DATA: ", timelineHandle, left, player, zone);
  return 1;
}

function calcDimensions(player) {
  if (player.player_id <= 3) {
    return { width: 3840, height: 2160 };
  } else {
    return { width: 1920, height: 1080 };
  }
}

function calcWidth(player, zone) {}

function calcHeight() {}

function calcXPos() {}

function calcYPos() {}

function getResourceId() {}

function calcCropFactors() {}

function calcScale() {}

/*
    const {cropLeft, cropRight, cropTop, cropBottom} = calcCropFactors();
    const body = {
        timelineHandle: timelineHandle,
        width: calcWidth(),
        height: calcHeight(),
        xPos: calcXPos(),
        yPos: calcYPos(),
        resourceID: getResourceId(player),
        left: cropLeft,
        right: cropRight,
        top: cropTop,
        bottom: cropBottom,
        scaleX: calcScale(),
        scaleY: calcScale()
    }

*/
