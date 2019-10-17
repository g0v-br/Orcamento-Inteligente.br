<template>
  <div id="container" class="cds-container">
    <h4>{{title}}</h4>
    <template v-if="breakdown.length!=0">
      <svg class="chart js-chart pie-chart" />
      <div class="detail">
        <p class="desc">{{ bd_title }}</p>
        {{ totalizer(bd_amount, bd_filtered) }}
        <!-- <Totalizer :total="bd_amount" :filtered="bd_filtered" :options="totalizerOptions" /> -->
      </div>
    </template>
  </div>
</template>
<script>
import * as d3 from "d3";
import Totalizer from "@/components/Totalizer";
import _debounce from "lodash/debounce";
//---------------------------------------------------------
//BUILDER
let cdsSpeed = 4000;
let currentElement = 0;
let intervalID;
let width;
let height;
let outerRadius;
let innerRadius;
let slices;
let debouncedUpdate;
let updateDetail = function(context, overed_index) {
  for (let index = 0; index < slices.length; index++) {
    slices[index].classList.remove("selected");
  }
  if (overed_index != -1) {
    currentElement = overed_index;
  }
  slices[currentElement].classList.add("selected");
  context.bd_amount = context.total;
  context.bd_filtered = slices[currentElement].__data__.data.amount;
  context.bd_title = slices[currentElement].__data__.data.title;
  currentElement = (currentElement + 1) % slices.length;
};
const computeBoundaries = function() {
  let container = d3.select("#container")._groups[0][0];
  width = container.offsetWidth;
  height = container.offsetHeight;

  outerRadius =
    (Math.min(width, height) - (Math.min(width, height) * 25) / 100) / 2;
  innerRadius = outerRadius - 70;
  height = 2 * outerRadius;
};
const drowPieChart = function(context) {
  let chart_obj = pieChart()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);
  let svg = d3
    .select(".js-chart")
    .attr("width", width)
    .attr("height", height);
  let domPieChart = svg
    .append("g")
    .attr("class", "pie-chart")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .call(chart_obj.data(context.breakdown));
  domPieChart.call(chart_obj.data(context.breakdown));
  //UPDATE CDS DETAIL
  slices = d3.selectAll(".slice")._groups[0];
  d3.selectAll(".slice")
    .on("mouseenter", (actual, i) => {
      window.clearInterval(intervalID);
      updateDetail(context, i);
    })
    .on("mouseleave", () => {
      intervalID = window.setInterval(() => {
        updateDetail(context, -1);
      }, cdsSpeed);
    });
};
const centerPieChart = function() {
  let chart = d3.select("g");
  let svg = d3
    .select(".js-chart")
    .attr("width", width)
    .attr("height", height);

  chart.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
};
function pieChart(options) {
  var animationDuration = 750,
    color = d3.scaleOrdinal(d3.schemeCategory10),
    data = [],
    innerRadius = 0,
    outerRadius = 100,
    arc = d3.arc(),
    pie = d3
      .pie()
      .sort(null)
      //.padAngle(0.02)
      .value(function(d) {
        return d.amount;
      });

  function updateTween(d) {
    var i = d3.interpolate(this._current, d);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  }

  function joinKey(d) {
    return d.data.title;
  }

  function pieChart(context) {
    var slices = context.selectAll(".slice").data(pie(data), joinKey);
    var newSlices = slices
      .enter()
      .append("path")
      .each(function(d) {
        this._current = Object.assign({}, d, { startAngle: d.endAngle });
      })
      .attr("class", "slice")
      .style("fill", function(d) {
        return color(joinKey(d));
      });
    var t = d3.transition().duration(animationDuration);

    arc.innerRadius(innerRadius).outerRadius(outerRadius);

    var t2 = t.transition();
    slices.transition(t2).attrTween("d", updateTween);
  }

  pieChart.data = function(_) {
    return arguments.length ? ((data = _), pieChart) : data;
  };

  pieChart.innerRadius = function(_) {
    return arguments.length ? ((innerRadius = _), pieChart) : innerRadius;
  };

  pieChart.outerRadius = function(_) {
    return arguments.length ? ((outerRadius = _), pieChart) : outerRadius;
  };
  return pieChart;
}
export default {
  props: {
    breakdown: Array,
    title: {
      type: String,
      default: "Bar chart"
    },
    total: {
      type: Number,
      default: 0
    },
    totalizer: Function,
    formatters: Object,
    totalizerOptions: {
      type: Object
    }
  },
  components: {
    Totalizer
  },
  data() {
    return {
      bd_title: undefined,
      bd_filtered: 0,
      bd_amount: 0
    };
  },
  mounted() {
    if (this.breakdown.length != 0) {
      computeBoundaries();
      drowPieChart(this);
      updateDetail(this, -1);
      intervalID = window.setInterval(() => {
        updateDetail(this, -1);
      }, cdsSpeed);
      debouncedUpdate = _debounce(() => {
        computeBoundaries();
        centerPieChart(this);
      }, 200);
      window.addEventListener("resize", debouncedUpdate);
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", debouncedUpdate);
    window.clearInterval(intervalID);
  }
};
</script>
<style>
p.dataError {
  color: red;
}
.selected {
  stroke-width: 2 !important;
  opacity: 0.5;
}
.slice {
  stroke-width: 0.3;
  stroke: black;
}
.cds-desc {
  overflow: auto;
}
.cds-container {
  margin: 0;
  padding: 0rem 0rem;
  min-height: 30rem;
  width: 100%;
  text-align: start;
  display: block;
}
.pie-chart {
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: left;
}
.detail {
  margin: 1.5rem;
  position: relative;
  justify-content: space-around;
}
.detail-data {
  margin-top: 1em;
}
.detail-data h4 {
  font-size: 1.3em;
}
.detail-data p {
  color: dimgrey;
}
@media screen and (max-width: 1100px) {
  .cds-container {
    margin: 0;
    padding: 0rem 0rem;
    min-height: 30rem;
    width: 100%;
    text-align: start;
    display: block;
  }

  .details .numbers {
    grid-template-areas: "amount" "rate";
  }
}
</style>