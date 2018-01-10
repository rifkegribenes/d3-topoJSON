const width = window.innerWidth;
const height = width / 2;
const tooltip = d3.select('body').append('div').attr('class', 'tooltip');

const svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

const projection = d3.geoMercator()
  .translate([780,360])
  .scale(300);

const path = d3.geoPath().projection(projection);
const borders = svg.append("g")
  .attr('width', width)
  .attr('height', height)
  // .append('rect')
  // .attr("width", width)
  // .attr("height", height)
  // .style("fill", "#4196f6");

d3.queue()
  .defer(d3.json, 'https://unpkg.com/world-atlas@1/world/110m.json')
  .defer(d3.json, 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json')
  .await((error, world, meteorites) => {

    borders.selectAll("path")
      .data(topojson.feature(world, world.objects.countries)
          .features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "border")

    svg.append('g')
      .selectAll('.meteorite')
      .data(meteorites.features)
      .enter().append('path')
        .attr('class', 'meteorite')
        .attr('d', path.pointRadius((d) => Math.cbrt(d.properties.mass * 3 / (4 * Math.PI)) / 10 ))
        .attr('fill', 'red')
        .style('opacity', '0.5')
        .on('mouseover', (d) => {
          tooltip.transition()
            .duration(100)
            .style('opacity', .9);
          tooltip.text(`${(new Date(d.properties.year)).getFullYear()} ${d.properties.name} ${d.properties.mass}kg`)
            .style('left', `${d3.event.pageX - 87}px`)
            .style('top', `${d3.event.pageY - 80}px`);
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