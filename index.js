const CircleToPolygon = require('circle-to-polygon');
const fs = require('fs');

//coordinates tọa độ tâm, radius bán kính, numberOfEdges Số lượng điểm
function createCircle(coordinates, radius, numberOfEdges, doWrite = true) {
  let polygon = CircleToPolygon(coordinates, radius, numberOfEdges);
  polygon.coordinates[0].forEach((point, index) => {
    if (coordinates[2]) {
      polygon.coordinates[0][index] = [...point, coordinates[2]];
    } else {
      polygon.coordinates[0][index] = [...point, 0];
    }
  });
  doWrite && fs.writeFileSync('CoordinateCircle.json', JSON.stringify(polygon));
  return polygon;
}

function createPillar(coordinates, radius, numberOfPillars) {
  let circle = createCircle(coordinates, radius, numberOfPillars, false);
  let arr = [];
  for (let index = 0; index < circle.coordinates[0].length; ++index) {
    let pillar = createCircle(circle.coordinates[0][index], 1, 36);
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
  }
  fs.writeFileSync('CoordinatePillar.json', JSON.stringify(arr));
}

function createWall(coordinates, radius, numberOfPillars, height) {
  let wallCoordinate = [
    coordinates[0],
    coordinates[1],
    coordinates[2] + height / 2,
  ];
  let circle = createCircle(wallCoordinate, radius, numberOfPillars * 4, false);
  let arr = [];
  for (
    let i = 4, count = 1;
    i <= circle.coordinates[0].length - 1;
    i += 4, ++count
  ) {
    let feature = {
      type: 'Feature',
      properties: { 'Wall Number': count, height: height },
      geometry: {
        type: 'LineString',
        coordinates: [
          ...(i !== circle.coordinates[0].length - 1
            ? [
                circle.coordinates[0][i - 1],
                circle.coordinates[0][i],
                circle.coordinates[0][i + 1],
              ]
            : [
                circle.coordinates[0][circle.coordinates[0].length - 2],
                circle.coordinates[0][0],
                circle.coordinates[0][1],
              ]),
        ],
      },
      id: `wall${count}`,
    };
    arr.push(feature);
  }
  fs.writeFileSync('CoordinateWall.json', JSON.stringify(arr));
}

const coordinates = [12.4922309, 41.8902102, 0]; //[long, lat]
const radius = 80; // in meters
const numberOfEdges = 80; //optional that defaults to 32

// kết quả cho ra trong file CoordinateCircle.json và file CoordinatePillar.json
createPillar(coordinates, radius, numberOfEdges);
// kết quả cho ra trong file CoordinateWall.json
createWall(coordinates, radius, numberOfEdges, 15);
