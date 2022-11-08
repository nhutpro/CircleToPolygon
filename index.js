const CircleToPolygon = require("circle-to-polygon");
const fs = require("fs");
//coordinates tọa độ tâm, radius bán kính, numberOfEdges Số lượng điểm
function createCircle(coordinates, radius, numberOfEdges) {
  let polygon = CircleToPolygon(coordinates, radius, numberOfEdges);
  polygon.coordinates[0].forEach((point, index) => {
    if (coordinates[2]) {
      polygon.coordinates[0][index] = [...point, coordinates[2]];
    } else {
      polygon.coordinates[0][index] = [...point, 0];
    }
    fs.writeFileSync("CoordinateCircle.json", JSON.stringify(polygon));
  });
}
const coordinates = [12.4922309, 41.8902102, 5]; //[lon, lat]
const radius = 40; // in meters
const numberOfEdges = 500; //optional that defaults to 32
createCircle(coordinates, radius, numberOfEdges); // kết quả cho ra trong file CoordinateCircle.json
