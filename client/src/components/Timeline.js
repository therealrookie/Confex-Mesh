import React, { useEffect, useState } from "react";
import PixeraMatrix from "./PixeraMatrix";

const Timeline = ({ handle, name }) => {
  const [layers, setLayers] = useState([]);

  const fetchLayerDetails = async () => {
    try {
      const layerHandlesResponse = await fetch(`http://localhost:5000/pixera/get-layerhandles/${handle}`);
      const layerNamesResponse = await fetch(`http://localhost:5000/pixera/get-layernames/${handle}`);
      if (!layerHandlesResponse.ok || !layerNamesResponse.ok) {
        throw new Error("Failed to fetch layer details");
      }
      const layerHandles = await layerHandlesResponse.json();
      const layerNames = await layerNamesResponse.json();

      // Optionally fetch descriptions for each layer handle
      const layersData = await Promise.all(
        layerHandles.result.map(async (layerHandle, index) => {
          return fetchLayerDescription(layerHandle, layerNames.result[index]);
        })
      );

      setLayers(layersData); // Set the combined layer data
    } catch (error) {
      console.error("Error fetching layer details for timeline:", handle, error);
    }
  };

  const fetchLayerDescription = async (layerHandle, layerName) => {
    try {
      const descriptionResponse = await fetch(`http://localhost:5000/pixera/get-layerdescription/${layerHandle}`);
      if (!descriptionResponse.ok) {
        throw new Error("Failed to fetch layer description");
      }
      const descriptionData = await descriptionResponse.json();
      const description = JSON.parse(descriptionData.result);
      const offset = await fetchLayerOffsets(layerHandle);
      return {
        name: layerName,
        handle: layerHandle,
        description: description,
        offset: offset,
      };
    } catch (error) {
      console.error("Error fetching layer description:", layerHandle, error);
    }
  };

  const fetchLayerOffsets = async (layerHandle) => {
    try {
      const offsetResponse = await fetch(`http://localhost:5000/pixera/get-offset/${layerHandle}`);
      if (!offsetResponse.ok) {
        throw new Error("Failed to fetch layer offsets");
      }
      const offsetData = await offsetResponse.json();
      return offsetData.result;
    } catch (error) {
      console.error("Error fetching layer offsets:", layerHandle, error);
    }
  };

  const displayLayers = () => {
    layers.forEach((layer) => {
      let width = layer.description.Size.W;
      const xStart = layer.description.Position.X + layer.offset[0] * 500;
      if (layer.description.Cropping) {
        width = layer.description.Size.W - layer.description.Cropping.Left - layer.description.Cropping.Right;
      }
      //const xEnd = xStart + width;
    });
  };

  const handleInputChange = (index, field, value) => {
    const newLayers = [...layers];
    const layer = { ...newLayers[index] };
    const fields = field.split(".");

    // Handle nested fields like "Position.X"
    if (fields.length > 1) {
      if (!layer.description[fields[0]]) {
        layer.description[fields[0]] = {}; // Ensure nested object exists
      }
      layer.description[fields[0]][fields[1]] = parseFloat(value);
    } else {
      layer.description[field] = parseFloat(value);
    }

    newLayers[index] = layer;
    setLayers(newLayers);
  };

  const saveLayerDescription = async (layer) => {
    // Ensure Cropping.Mix[%] is set to 100
    layer.description.Cropping["Mix[%]"] = 100;

    try {
      const response = await fetch(`http://localhost:5000/pixera/set-layerdescription/${layer.handle}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(layer.description),
      });
      if (!response.ok) throw new Error("Failed to update layer description");
      alert("Layer description updated successfully!");
    } catch (error) {
      console.error("Failed to send layer description:", error);
      alert("Failed to update layer description.");
    }
  };

  const cropLayer = async (handle, amount, isLeft) => {
    if (isLeft) {
      try {
        const response = await fetch(`http://localhost:5000/pixera/crop-left/${handle}/${amount}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to update layer description");
      } catch (error) {
        console.error("Failed to send layer description:", error);
      }
    }
  };

  const setXOffset = async (handle, amount) => {
    try {
      const response = await fetch(`http://localhost:5000/pixera/set-x-offset/${handle}/${amount}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to update layer description");
    } catch (error) {
      console.error("Failed to send layer description:", error);
    }
  };

  useEffect(() => {
    fetchLayerDetails();
    displayLayers();
  }, []);

  return (
    <div>
      <h5>{`Name: ${name} - (handle: ${handle})`}</h5>
      <PixeraMatrix layers={layers} />
      {layers.length > 0 &&
        layers.map((layer, index) => (
          <div key={index}>
            <h6>Name: {layer.name}</h6>
            <p>Handle: {layer.handle}</p>
            <div>
              {Object.entries(layer.description).map(([key, value]) => (
                <p key={key}>{`${key}: ${typeof value === "object" ? JSON.stringify(value, null, 2) : value}`}</p>
              ))}
            </div>
            <p>Offsets: {layer.offset.join(", ")}</p>
            <input
              type="number"
              value={parseInt(layer.description.Position.X)}
              onChange={(e) => handleInputChange(index, "Position.X", e.target.value)}
            />
            <input
              type="number"
              value={0}
              onChange={(e) => handleInputChange(index, "Cropping.Left", e.target.value)}
            />
            <input
              type="number"
              value={0}
              onChange={(e) => handleInputChange(index, "Cropping.Right", e.target.value)}
            />
            <button onClick={() => saveLayerDescription(layer)}>Save Changes</button>
            <button onClick={() => cropLayer(layer.handle, 50, true)}>Crop 50% left</button>
            <button onClick={() => setXOffset(layer.handle, 1)}>X Offset: 1000</button>
          </div>
        ))}
    </div>
  );
};

export default Timeline;

/* 

const handleInputChange = (index, field, value) => {
    const newLayers = [...layers];
    const layer = { ...newLayers[index] };
    const fields = field.split(".");

    // Handle nested fields like "Position.X"
    if (fields.length > 1) {
      if (!layer.description[fields[0]]) {
        layer.description[fields[0]] = {}; // Ensure nested object exists
      }
      layer.description[fields[0]][fields[1]] = parseFloat(value);
    } else {
      layer.description[field] = parseFloat(value);
    }

    newLayers[index] = layer;
    setLayers(newLayers);
  };

  const saveLayerDescription = async (layer) => {
    // Ensure Cropping.Mix[%] is set to 100
    layer.description.Cropping["Mix[%]"] = 100;

    try {
      const response = await fetch(`http://localhost:5000/pixera/set-layerdescription/${layer.handle}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(layer.description),
      });
      if (!response.ok) throw new Error("Failed to update layer description");
      alert("Layer description updated successfully!");
    } catch (error) {
      console.error("Failed to send layer description:", error);
      alert("Failed to update layer description.");
    }
  };




<input
              type="number"
              value={layer.description.Position.X}
              onChange={(e) => handleInputChange(index, "Position.X", e.target.value)}
            />
            <input
              type="number"
              value={layer.description.Cropping.Left}
              onChange={(e) => handleInputChange(index, "Cropping.Left", e.target.value)}
            />
            <input
              type="number"
              value={layer.description.Cropping.Right}
              onChange={(e) => handleInputChange(index, "Cropping.Right", e.target.value)}
            />
            <button onClick={() => saveLayerDescription(layer)}>Save Changes</button>
*/
