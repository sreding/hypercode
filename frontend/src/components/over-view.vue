<template>
  <div id="over-view">
    <svg id="over-view-svg"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  data() {
    return {
      nodes: [],
      links: [],
    }; 
  },
  mounted() {
    this
      .$http({ url: 'http://localhost:3000/api/files/', method: 'GET' })
      .then(
        (response) => {
          // success callback
          for (let i in response.body) {
            const file = response.body[i];
            this.nodes.push({
              id: file._id,
              label: file.name,
            });
            // Iterate relations
            for (let j in file.relations) {
              const relation = file.relations[j];
              this.links.push({
                source: file._id,
                target: relation,
                left: false,
                right: true,
              });
            }
          }
          this.renderSvg();
        },
        (response) => {
          // error callback
        
        }
      );
  },
  methods: {
    renderSvg() {
      const svg = d3.select('#over-view-svg');
      const elBounding = document.getElementById('over-view-svg').getBoundingClientRect();
      const width = +elBounding.width;
      const height = +elBounding.height;
      const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(60))
        .force("charge", d3.forceManyBody().strength(-100).distanceMax(200).distanceMin(100))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(this.links)
        .enter()
        .append("line")
        .attr("stroke-width", function(d) { return 1; });

      // const node = svg.append("g")
      //   .attr("class", "nodes")
      //   .selectAll("circle")
      //   .data(this.nodes)
      //   .enter()
      //   .append("circle")
      //   .attr("r", 5);

      const gnodes = svg.selectAll('g.gnode')
        .data(this.nodes)
        .enter()
        .append('g')
        .classed('gnode', true);
        
      const node = gnodes.append("circle")
          .attr("class", "node")
          .attr("r", 5)
          .on("click", (e) => {
            console.log(e.id)
          })
          .call(d3
                .drag()
                .on("start", (d) => {
                  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                  d.fx = d.x;
                  d.fy = d.y;
                })
                .on("drag", (d) => {
                  d.fx = d3.event.x;
                  d.fy = d3.event.y;
                })
                .on("end", (d) => {
                  if (!d3.event.active) simulation.alphaTarget(0);
                  d.fx = null;
                  d.fy = null;
                })
              );

      const labels = gnodes.append("text")
          .text(function(d) { return d.label; });

      simulation
        .nodes(this.nodes)
        .on("tick", ticked);

      simulation
        .force("link")
        .links(this.links);

      function ticked() {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        gnodes.attr("transform", function(d) {
          return 'translate(' + [d.x = Math.max(5, Math.min(width - 5, d.x)), d.y = Math.max(5, Math.min(height - 5, d.y))] + ')'; 
        });

        labels.attr("transform", function(d) { 
          return 'translate(' + [10, 5] + ')'; 
        });
      }
    }
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  background-color: #FFF;
}

#over-view, #over-view-svg {
  width: 100%;
  height: 100%;
}

.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}

</style>