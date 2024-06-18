import { scale } from "./calculations";

function getPercentages() {
  return {
    Content16: 64.53,
    Content32: 86.04,
    CropRight16: 35.47,
    CropRight32: 13.96,
    CropBottom16: 35.42,
    CropBottom32: 56.94,
    Width64: 3304,
    Width32: 1920,
    Width16: 1280,
  };
}

const { Content16, Content32, CropRight16, CropRight32, CropBottom16, CropBottom32, Width64, Width32, Width16 } =
  getPercentages();

function calcNewXPosition(left, width, cutPercentage) {
  return left + ((width / cutPercentage) * 100) / 2;
}

function calc64(left, width) {
  return {
    width: Width64,
    height: 465,
    xPos: scale(calcNewXPosition(left, width, 100), 0, 100, -3717, 3717),
    yPos: 0,
    cropLeft: 0,
    cropRight: 0,
    cropBottom: 0,
  };
}

function calc32_1(left, width) {
  return {
    width: Width32,
    height: 1080,
    xPos: scale(calcNewXPosition(left, width, Content32), 0, 100, -3717, 3717),
    yPos: -307,
    cropLeft: 0,
    cropRight: CropRight32,
    cropBottom: CropBottom32,
  };
}

function calc32_2_1(left, width) {
  return {
    width: Width64,
    height: 465,
    xPos: scale(calcNewXPosition(left, width, 50), 0, 100, -3717, 3717),
    yPos: 0,
    cropLeft: 0,
    cropRight: 50,
    cropBottom: 0,
  };
}

function calc32_2_2(left, width) {
  return {
    width: Width64,
    height: 465,
    xPos: scale(left, 0, 100, -3717, 3717),
    yPos: 0,
    cropLeft: 50,
    cropRight: 0,
    cropBottom: 0,
  };
}

function calc16_1(left, width) {
  return {
    width: Width16,
    height: 720,
    xPos: scale(calcNewXPosition(left, width, Content16), 0, 100, -3717, 3717),
    yPos: -128,
    cropLeft: 0,
    cropRight: CropRight16,
    cropBottom: CropBottom16,
  };
}

function calc16_2_1(left, width) {
  return {
    width: Width32,
    height: 1080,
    xPos: scale(calcNewXPosition(left, width, Content32 * 0.5), 0, 100, -3717, 3717),
    yPos: -307,
    cropLeft: 0,
    cropRight: 50 + CropRight32 * 0.5,
    cropBottom: CropBottom32,
  };
}

function calc16_2_2(left, width) {
  return {
    width: Width32,
    height: 1080,
    xPos: scale(calcNewXPosition(left, width, Content32 * 0.5), 0, 100, -3717, 3717),
    yPos: -307,
    cropLeft: Content32 * 0.5,
    cropRight: CropRight32,
    cropBottom: CropBottom32,
  };
}

function calc16_4_1(left, width) {
  return {
    width: Width64,
    height: 465,
    xPos: scale(calcNewXPosition(left, width, 25), 0, 100, -3717, 3717),
    yPos: 0,
    cropLeft: 0,
    cropRight: 75,
    cropBottom: 0,
  };
}

function calc16_4_2(left, width) {
  return {
    width: Width64,
    height: 465,
    xPos: scale(calcNewXPosition(left, width, 25), 0, 100, -3717, 3717),
    yPos: 0,
    cropLeft: 25,
    cropRight: 50,
    cropBottom: 0,
  };
}

function calc16_4_3(left, width) {
  return {
    width: Width64,
    height: 465,
    xPos: scale(calcNewXPosition(left, width, 25), 0, 100, -3717, 3717),
    yPos: 0,
    cropLeft: 50,
    cropRight: 25,
    cropBottom: 0,
  };
}

function calc16_4_4(left, width) {
  return {
    width: Width64,
    height: 465,
    xPos: scale(calcNewXPosition(left, width, 25), 0, 100, -3717, 3717),
    yPos: 0,
    cropLeft: 75,
    cropRight: 0,
    cropBottom: 0,
  };
}

export function newLayerValues(left, width, ratio, zone) {
  if (ratio === "64:9") {
    return calc64(left, width);
  } else if (ratio === "32:9") {
    switch (zone) {
      case "1": // Full 32:9
        return calc32_1(left, width);

      case "2.1": // Left Half 64:9
        return calc32_2_1(left, width);

      case "2.2": // Right Half 64:9
        return calc32_2_2(left, width);
    }
  } else if (ratio == "16:9") {
    switch (zone) {
      case "1": // Full 16:9
        return calc16_1(left, width);
      case "2.1": // Left Half 32:9
        return calc16_2_1(left, width);
      case "2.2": // Right Half 32:9
        return calc16_2_2(left, width);
      case "4.1":
        return calc16_4_1(left, width);
      case "4.2":
        return calc16_4_2(left, width);
      case "4.3":
        return calc16_4_3(left, width);
      case "4.4":
        return calc16_4_4(left, width);
    }
  }
}
