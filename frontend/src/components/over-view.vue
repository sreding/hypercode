<template>
  <div id="over-view">
  <div class="container-menu-top">
   <router-link class="task-btn" to="/"><icon name="home" scale="1"></icon></router-link>
   <!--  <a id="zoomButton"  class="task-btn">Zoom</a> <a   id="backToOverview">
    <a id="rotateBack"  v-on:click="rotateBackToMainFile()" class="task-btn">RotateBack</a> -->
      </div>
    <svg id="over-view-svg"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons';

export default {
  components: {
    "icon":Icon
  },
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
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(150))
        .force("charge", d3.forceManyBody().strength(-1000).distanceMax(200).distanceMin(100))
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
        
      const node = gnodes.append("circle").style('cursor','pointer')     
          .attr("class", "node")
          .attr("r", 10).style('fill', '#990000')
          .on("click", (e) => {
            console.log(e.id)
            this.$router.push("/file/"+e.id)
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

      labels.style('fill','black')
      labels.style('font-family','sans-serif')
      labels.style('cursor','default')   

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
  /*background-color: #FFF;*/
}
#app{
  z-index: 100000;
}

#over-view, #over-view-svg {
  width: 100%;
  height: 100%;
}

.links line {
  stroke: #8c8c8c;
  stroke-opacity: 0.6;
}

text{
  color: blue;
}

.nodes circle {
  stroke: #FFF;
  stroke-width: 1.5px;
}

</style>