const CircleToPolygon = require('circle-to-polygon');
const fs = require('fs');

/**
 * Tạo tạo độ hình tròn và viết kết quả vào file CoordinateCircle.json nếu doWrite là true
 * @param {number[]} coordinates tạo đọ tâm của đường tròn
 * @param {number} radius bán kính đường tròn
 * @param {number} numberOfEdges số điểm trên đường tròn
 * @param {boolean} doWrite Có viết kết quả ra file hay không
 * @returns GeoJson.Polygon
 */
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
/**
 * Hàm trả về tạo đọ của các trụ cột nằm trên đường tròn
 * @param {number[3]} coordinates tạo độ tâm của đường tròn
 * @param {number} radius bán kính của đường tròn
 * @param {number} numberOfPillars số trụ cột
 * @param {number} pillarRadius bán kính của mỗi trụ cột, mặc định là 1
 *
 */
function createPillar(coordinates, radius, numberOfPillars, pillarRadius = 1) {
  let circle = createCircle(coordinates, radius, numberOfPillars, false);
  let arr = [];
  for (let index = 0; index < circle.coordinates[0].length; ++index) {
    let pillar = createCircle(circle.coordinates[0][index], pillarRadius, 36);
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

/**
 * Hàm viết kết quả các bức tường nằm trên đường tròn
 * @param {number[]} coordinates tạo độ tâm của đường tròn
 * @param {number} radius bán kính của đường tròn
 * @param {number} numberOfPillars số bưc tường
 * @param {number} height chiều cao của bức tường
 */
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
                circle.coordinates[0][i - 1],
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

/**
 * Hàm xuất kết quả các cung nằm giữa 2 cột
 * @param {number[]} coordinates tạo đọ tâm của đường tròn
 * @param {number} radius bán kính đường tròn
 * @param {number} numberOfPillars số các cung
 * @param {number} pillarHeight chiều cao của các trụ cột nằm 2 bên cung
 * @param {number} arcHeight chiều bao của mỗi cung
 */
function createArc(
  coordinates,
  radius,
  numberOfPillars,
  pillarHeight,
  arcHeight
) {
  let arcCoordinate = [
    coordinates[0],
    coordinates[1],
    coordinates[2] + pillarHeight - arcHeight,
  ];
  numberOfPillars *= 8;
  let arr = [],
    circle = createCircle(
      arcCoordinate,
      radius,
      numberOfPillars
    ).coordinates[0].splice(0, numberOfPillars);
  for (let i = 0, count = 1; i < circle.length; ++count, i += 8) {
    let feature = {
      type: 'Feature',
      properties: { 'Arc Number': count },
      geometry: {
        type: 'LineString',
        coordinates: [],
      },
      id: `wall${count}`,
    };
    for (let j = 0; j <= 8; ++j) {
      console.log(i, j);
      // console.log(circle[i + j] + ' ');
      let arc = Math.sin((j * 3.1415) / 8) * arcHeight;
      // console.log(arc);
      feature.geometry.coordinates.push(
        i + j !== circle.length
          ? [circle[i + j][0], circle[i + j][1], arc + circle[i + j][2]]
          : [circle[0][0], circle[0][1], arc + circle[0][2]]
      );
    }
    arr.push(feature);
  }
  // console.log(circle[i + j]);
  fs.writeFileSync('CoordinateArc.json', JSON.stringify(arr));
}

const coordinates = [12.4922309, 41.8902102, 30]; //[long, lat]
const radius = 80; // in meters
const numberOfEdges = 60; //optional that defaults to 32

// kết quả cho ra trong file CoordinateCircle.json và file CoordinatePillar.json
createPillar(coordinates, radius, numberOfEdges);
// kết quả cho ra trong file CoordinateWall.json
createWall(coordinates, radius, numberOfEdges, 15);

createArc(coordinates, radius, numberOfEdges, 15, 2);
