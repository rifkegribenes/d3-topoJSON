// source code for creating orthographic projection with rotate on click:
// https://bl.ocks.org/austinczarnecki/fe80afa64724c9630930

const width = 950;
const height = 700;

const colors = { clickable: 'darkgreen', hover: 'green', clicked: "mediumvioletred", clickhover: "deeppink" };

const projection = d3.geoOrthographic()
    .scale(300)
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .precision(10);

const path = d3.geoPath()
    .projection(projection);

const graticule = d3.geoGraticule();

const map = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");

map.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

map.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

map.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

map.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

d3.queue()
    .defer(d3.json, "https://unpkg.com/world-atlas@1/world/110m.json")
    .defer(d3.tsv, "countrynames.tsv")
    .await(ready);

function ready(error, world, names) {
  if (error) throw error;

  var globe = {type: "Sphere"},
    land = topojson.feature(world, world.objects.land),
    countries = topojson.feature(world, world.objects.countries).features,
    borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

  countries = countries.filter(function(d) {
    return names.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  map.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

  for(i = 0; i < names.length; i++) {
    for (j = 0; j < countries.length; j++) {
      if (countries[j].id == names[i].id) {
        map.insert("path", ".graticule")
          .datum(countries[j])
          .attr("fill", colors.clickable)
          .attr("d", path)
          .attr("class", "clickable")
          .attr("data-country-id", j)
          .on("click", function() {
            d3.selectAll(".clicked")
              .classed("clicked", false)
              .attr("fill", colors.clickable);
            d3.select(this)
              .classed("clicked", true)
              .attr("fill", colors.clicked);

            (function transition() {
              d3.select(".clicked").transition()
              .duration(1250)
              .tween("rotate", function() {
                var p = d3.geo.centroid(countries[d3.select(this).attr("data-country-id")]),
                    r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                return function (t) {
                  projection.rotate(r(t));
                  map.selectAll("path").attr("d", path);
                }
              });
            })();
          })
          .on("mousemove", function() {
            var c = d3.select(this);
            if (c.classed("clicked")) {
              c.attr("fill", colors.clickhover);
            } else {
              c.attr("fill", colors.hover);
            }
          })
          .on("mouseout", function() {
            var c = d3.select(this);
            if (c.classed("clicked")) {
              c.attr("fill", colors.clicked);
            } else {
              d3.select(this).attr("fill", colors.clickable);
            }
          });
      }
    }
  }

  map.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
};

d3.select(self.frameElement).style("height", height + "px");