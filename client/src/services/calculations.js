export function scale(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function cropFactors(layer) {
  const left = layer.cropping.Left / 100;
  const right = layer.cropping.Right / 100;
  const top = layer.cropping.Top / 100;
  const bottom = layer.cropping.Bottom / 100;
  return [left, right, top, bottom];
}

export function calcDimensions(layer) {
  const width = layer.size.W;
  const height = layer.size.H;
  const scaleX = layer.offset[6];

  const [cropFactorLeft, cropFactorRight, cropFactorTop, cropFactorBottom] = cropFactors(layer);

  const newWidth = width - width * cropFactorLeft - width * cropFactorRight;
  const newHeight = height - height * cropFactorTop - height * cropFactorBottom;
  const ratio = `${Math.round((newWidth / newHeight) * 9)}:9`;

  return [scale(newWidth, 0, 7434, 0, 100) * scaleX, scale(newHeight, 0, 465, 0, 100), ratio];
}

export function calcPositions(layer) {
  const [cropFactorLeft, , cropFactorTop] = cropFactors(layer);
  const scaleX = layer.offset[6];

  const Width = layer.size.W;
  const Height = layer.size.H;

  const offsetX = layer.offset[0] * 500; // 500 = offset factor & offset[0] = x-offset
  const positionX = layer.position.X - (Width * scaleX) / 2; // (0|0) is in the center of the layer

  const offsetY = layer.offset[1] * 500; // 500 = offset factor & offset[1] = y-offset
  const positionY = layer.position.Y - Height / 2; // (0|0) is in the center of the layer

  const left = offsetX + positionX + Width * cropFactorLeft;
  const top = offsetY + positionY + Height * cropFactorTop;

  return [scale(left, -3717, 3717, 0, 100), scale(top, -232.5, 232.5, 0, 100)];
}

export function checkCropping(cropping) {
  if (cropping.Left === 0) {
    if (cropping.Right < 36) {
      return 1;
    } else if (cropping.Right < 57) {
      return 2.1;
    } else if (cropping.right === 75) {
      return 4.1;
    } else {
      return 0;
    }
  } else if (cropping.Left === 50) {
    if (cropping.Right < 14) {
      return 2.2;
    } else if (cropping.Right === 25) {
      return 4.3;
    } else {
      return 0;
    }
  } else if (cropping.Left === 25) {
    return 4.2;
  } else if (cropping.Left === 75) {
    return 4.4;
  } else {
    return 0;
  }
}
