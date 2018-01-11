const initialWidth = window.innerWidth;
let width = initialWidth;
let height = width / 2;
const tooltip = d3.select('body').append('div').attr('class', 'tooltip').attr('id', 'tip');
const tip = document.getElementById('tip');
const meteorScale = d3.scalePow().exponent(.05).domain([0, 1000, 10000, 56000, 100000, 1000000, 23000000]);

const colorScale = d3.scaleLinear().domain([1400, 1800, 1860, 1940, 2015]);

const formatMass = (m) => {
  if (m >= 1000) {
    let sections = (m / 1000).toString().split(".");
    sections[0] = sections[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${sections.join(".")} kg`;
  } else {
    let sections = m.toString().split(".");
    sections[0] = sections[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${sections.join(".")} g`;
  }
}

const svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

const projection = d3.geoMercator()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const borders = svg.append("g")
  .attr('class', 'borders');

const resize = () => {
  let width = window.innerWidth;
  let height = width / 2;
  svg.attr('width', width).attr('height', height);
  projection.scale(width / 2 / Math.PI).translate([width / 2, height / 2]);
  d3.select("g").attr("transform", `scale(${width / initialWidth})`);
  d3.selectAll("circle")
    .attr('cx', d => projection([d.properties.reclong, d.properties.reclat])[0])
    .attr('cy', d => projection([d.properties.reclong,d.properties.reclat])[1]);
}


d3.queue()
  .defer(d3.json, 'https://unpkg.com/world-atlas@1/world/110m.json')
  .defer(d3.json, 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json')
  .await((error, world, meteorites) => {

    meteorScale
    .range([2.5, 3, 4, 5, 10]);

    colorScale
    .range(["#FFFF66", "#FFFF00", "#E68000", "#D94000", "#CC0000"]);

    borders.selectAll("path")
      .data(topojson.feature(world, world.objects.countries)
          .features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "border")
      .style("stroke", "white")
      .style("fill", "lightgray");

    svg.append('g')
      .selectAll('.meteorite')
      .data(meteorites.features)
      .enter().append('circle')
        .attr('class', 'meteorite')
        .attr('cx', d => projection([d.properties.reclong, d.properties.reclat])[0])
        .attr('cy', d => projection([d.properties.reclong,d.properties.reclat])[1])
        .attr("r",  d => meteorScale(d.properties.mass))
        .attr("id", d => `id${d.id}`)
        .attr('fill', d => {
          const year = (new Date(d.properties.year)).getFullYear();
          return colorScale(year)
        })
        .style('opacity', '0.5')
        .on('mouseover', (d) => {
          const year = (new Date(d.properties.year)).getFullYear();
          tooltip.transition()
            .duration(100)
            .style('opacity', .9);
          tooltip.html(`<span class="tip-name">${d.properties.name}</span><span class="tip-date">&nbsp;(${year})</span><br><span class="tip-mass">${formatMass(d.properties.mass)}</span>`)
            .style('left', `${d3.event.pageX - 87}px`)
            // keep tooltips from overlapping with circles
            .style('top', `${d3.event.pageY - (tip.clientHeight + 20)}px`);
        })
        .on('mouseout', () => {
          tooltip.transition()
          .duration(400)
          .style('opacity', 0);
        });
})

const zoom = d3.zoom()
  .scaleExtent([0.5, 10])
  .on('zoom', () => d3.selectAll('g').attr('transform', d3.event.transform));

svg.call(zoom);
d3.select(window).on("resize", resize);