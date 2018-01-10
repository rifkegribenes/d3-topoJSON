const width = window.innerWidth;
const height = width / 2;
const tooltip = d3.select('body').append('div').attr('class', 'tooltip');
const metorScale = d3.scalePow().exponent(.5).domain([0, 1000, 10000, 56000, 23000000]);

const colorScale = d3.scaleLinear().domain([1400, 1800, 1860, 1940, 2015]);

const svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

const projection = d3.geoMercator()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const water = svg.append('rect')
  .attr("width", width)
  .attr("height", height)
  .style("fill", "#4196f6");

const borders = svg.append("g")
  .attr('width', width)
  .attr('height', height)


d3.queue()
  .defer(d3.json, 'https://unpkg.com/world-atlas@1/world/110m.json')
  .defer(d3.json, 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json')
  .await((error, world, meteorites) => {

    metorScale
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
        // .attr("cx", d => projection([d.long, d.lat])[0])
        // .attr("cy", d => projection([d.long, d.lat])[1])
        .attr("r",  d => metorScale(d.properties.mass))
        .attr("id", d => `id${d.id}`)
        .attr('fill', d => {
          const year = (new Date(d.properties.year)).getFullYear();
          return colorScale(year)
        })
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