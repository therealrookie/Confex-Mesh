import { createLayer, createTimeline } from "./api";
import { newLayerValues } from "./layerCalculations";

const layers = [{ left: 0, width: 100 / 9, inputResId: 3977257971353616, zone: "1" }];

export async function newTimeline() {
  const timelineHandle = await createTimeline();

  layers.forEach((layer) => {
    newLayer(timelineHandle, layer);
  });

  console.log("TIMELINEHANDLE: ", timelineHandle);
}

async function newLayer(timelineHandle, layer) {
  const ratio = getRatioFromWidth(layer.width);
  console.log("NEWLAYERVALS: ", newLayerValues(layer.left, layer.width, ratio, layer.zone));

  const { width, height, xPos, yPos, cropLeft, cropRight, cropBottom } = newLayerValues(
    layer.left,
    layer.width,
    ratio,
    layer.zone
  );

  const layerData = {
    timelineHandle: timelineHandle,
    width: width,
    height: height,
    xPos: xPos,
    yPos: yPos,
    resourceID: layer.inputResId,
    left: cropLeft,
    right: cropRight,
    top: 0,
    bottom: cropBottom,
    scaleX: 1.0,
    scaleY: 1.0,
  };

  createLayer(timelineHandle, layerData);
}

function getRatioFromWidth(width) {
  switch (width) {
    case 100 / 9:
      return "16:9";
    case 200 / 9:
      return "32:9";
    case 400 / 9:
      return "64:9";
    case 50:
      return "72:9";
    case 100:
      return "144:9";
  }
}

/*
const replaceInput = async (playerIndex, zone) => {
  const player = playersQuery.data.find((player) => player.id === playerIndex);
  const { left, top, widthCSS, heightCSS, ratio } = editLayer.props;

  const { width, height, xPos, yPos, cropLeft, cropRight, cropBottom } = newLayerValues(left, widthCSS, ratio, zone);
  //const { scaleX, scaleY, yPos } = newLayerScale(player.id);

  const newLayerData = {
    timelineHandle: timelineHandle,
    width: width,
    height: height,
    xPos: xPos,
    yPos: yPos,
    resourceID: player.resid[0],
    left: cropLeft,
    right: cropRight,
    top: 0,
    bottom: cropBottom,
    scaleX: 1.0,
    scaleY: 1.0,
  };

  if (editLayer.handle) {
    await removeLayerMutation.mutateAsync(editLayer.handle);
  }

  const newLayer = await createLayerMutation.mutateAsync(newLayerData);
  queryClient.invalidateQueries(["layer", newLayer.layerHandle]);
  window.location.reload();
};

*/
