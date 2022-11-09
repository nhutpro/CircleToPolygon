const CircleToPolygon = require('circle-to-polygon');
const fs = require('fs');

//coordinates tọa độ tâm, radius bán kính, numberOfEdges Số lượng điểm
function createCircle(coordinates, radius, numberOfEdges) {
  let polygon = CircleToPolygon(coordinates, radius, numberOfEdges);
  polygon.coordinates[0].forEach((point, index) => {
    if (coordinates[2]) {
      polygon.coordinates[0][index] = [...point, coordinates[2]];
    } else {
      polygon.coordinates[0][index] = [...point, 0];
    }
  });
  fs.writeFileSync('CoordinateCircle.json', JSON.stringify(polygon));
  return polygon;
}

function createPillar(coordinates, radius, numberOfPillars) {
  let circle = createCircle(coordinates, radius, numberOfPillars);
  let arr = [];
  let index = 0;
  for (const pillarCenter of circle.coordinates[0]) {
    let pillar = createCircle(pillarCenter, 1, 36);
    let feature = {
      type: 'Feature',
      properties: { 'Pillar Number': index + 1, height: 40 },
      geometry: {
        type: 'Polygon',
        coordinates: [pillar.coordinates[0]],
      },
      id: `floor${index}`,
    };
    arr.push(feature);
    fs.writeFileSync('CoordinatePillar.json', JSON.stringify(arr));
    ++index;
  }
}

const coordinates = [12.4922309, 41.8902102, 0]; //[long, lat]
const radius = 80; // in meters
const numberOfEdges = 80; //optional that defaults to 32
createPillar(coordinates, radius, numberOfEdges); // kết quả cho ra trong file CoordinateCircle.json và file CoordinatePillar.json
