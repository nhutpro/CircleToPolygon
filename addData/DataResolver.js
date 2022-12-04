import { featureCollection } from "./FeatureCollection.js";
import { render } from "./Render.js";
import axios from "axios";
const TypeData = {
  LINE: "line-3d",
  POLYGON: "polygon-3d",
};
class DataResolver {
  async addBodyLine() {
    const fetchArray = [];
    for (let feature of featureCollection.features) {
      fetchArray.push(
        axios
          .post("http://localhost:5000/bodyline/create", {
            coordinates: feature.geometry.coordinates,
            nameInfo: feature.properties.name,
            heightInfo: feature.properties.height,
            color: render.symbol.symbolLayers[0].material.color,
            height: render.symbol.symbolLayers[0].height,
            width: render.symbol.symbolLayers[0].width,
          })
          .then(() => {
            console.log(`add ${feature.properties.name} successfully`);
          })
          .catch(() => {
            console.log(`add ${feature.properties.name} fail`);
          })
      );
    }
    await Promise.all(fetchArray);
  }
  async addBodyPolygon() {
    const fetchArray = [];
    const { width, height, roll, type, resource, size } =
      render.symbol.symbolLayers[0];
    for (let feature of featureCollection.features) {
      fetchArray.push(
        axios
          .post("http://localhost:5000/bodypolygon/create", {
            coordinates: feature.geometry.coordinates[0],
            nameInfo: feature.properties.name,
            heightInfo: feature.properties.height,
            color: render.symbol.symbolLayers[0].material.color,
            width,
            height,
            roll,
            type,
            ...(resource && { resource: resource.primitive }),
            size,
          })
          .then(() => {
            console.log(`add ${feature.properties.name} successfully`);
          })
          .catch(() => {
            console.log(`add ${feature.properties.name} fail`);
          })
      );
    }
  }
  mainResolver() {
    try {
      console.log("running wait a minute!!!");
      if (render.symbol.type === TypeData.LINE) {
        console.log("running add body line");
        this.addBodyLine();
      } else {
        console.log("running add body polygon");
        this.addBodyPolygon();
      }
    } catch (error) {
      console.log("Error", error);
    }
  }
}

export default new DataResolver();
