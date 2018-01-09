// const width = window.innerWidth;
// const height = window.innerHeight;

// const svg = d3.select("body").append("svg")

// const projection = d3.geoMercator()
//   .scale(width / 2 / Math.PI)
//   .translate([width / 2, height / 2])

// const path = d3.geoPath()
//   .projection(projection);

// const url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
// d3.json(url, function(err, geojson) {
//   svg.append("path")
//     .attr("d", path(geojson))
// })


/////




let width = window.innerWidth * .97;
let height = width / 2;
const svg = d3.select("body").append("svg")

//Define map projection
const projection = d3.geoMercator()
      .translate([780,360])
      .scale(300);

//Define path generator
const path = d3.geoPath().projection(projection);

//Resize function
const resize = () => {
  width = window.innerWidth * .97;
  height = width / 2;

  d3.selectAll("path").attr("transform", `scale(${width / 1900 })`);
  svg
    .attr("width", width)
    .attr("height", height);

  // projection
  //   .translate([780,360])
  //   .scale(300);

  //  d3.select("svg").attr("width", width).attr("height", height);

  //  d3.selectAll("path").attr('d', path);
}

const url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";

 d3.json(url, (err, geojson) => {

  svg
    .attr("width", width)
    .attr("height", height);

  //draw map
  const map = svg.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path(geojson))
    .style("fill", "#3498db");
  })


d3.select(window).on('resize', resize);

