export const getSnapPosition = (pos, ratio) => {
  const shapePercentage = getShapePercentage(ratio);

  const screenWidth = 800; // Assuming the ScreenContainer width is 800px
  const left = pos - (shapePercentage / 2) * screenWidth;
  const snapValues = {
    "144:9": [0],
    "64:9": Array.from({ length: 6 }, (_, i) => (i * 100) / 9),
    "32:9": Array.from({ length: 8 }, (_, i) => (i * 100) / 9),
    "16:9": Array.from({ length: 9 }, (_, i) => (i * 100) / 9),
  };

  const ratioKey = `${ratio[0]}:${ratio[1]}`;
  const possibleLefts = snapValues[ratioKey];

  let nearestLeft = possibleLefts[0];
  let minDistance = Math.abs((left / screenWidth) * 100 - nearestLeft);

  possibleLefts.forEach((snapLeft) => {
    const distance = Math.abs((left / screenWidth) * 100 - snapLeft);
    if (distance < minDistance) {
      nearestLeft = snapLeft;
      minDistance = distance;
    }
  });

  console.log(shapePercentage);

  return (nearestLeft * screenWidth) / 100; // Convert percentage to pixels
};

export function clientInsideRect(clientX, clientY, containerRect) {
  return (
    clientX < containerRect.left ||
    clientX > containerRect.right ||
    clientY < containerRect.top ||
    clientY > containerRect.bottom
  );
}

const getShapePercentage = (ratio) => {
  return 1 / (144 / ratio[0]); // i.e. 100 / 144 / 64 = 44,44%
};
