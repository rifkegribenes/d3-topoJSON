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




let width = window.innerWidth;
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
  width = window.innerWidth;
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

const url = "https://unpkg.com/world-atlas@1/world/110m.json";

 d3.json(url, (err, world) => {

  svg
    .attr("width", width)
    .attr("height", height)
    .append('rect')
    .attr("width", width)
    .attr("height", height)
    .style("fill", "#4196f6");

  //draw map
  const map = svg.selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append('path')
    .attr('fill', '#ddd')
    .attr('stroke', '#266D98')
    .attr('d', path);
  })


d3.select(window).on('resize', resize);

