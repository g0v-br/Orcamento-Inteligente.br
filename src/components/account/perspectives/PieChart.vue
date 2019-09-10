<template>
  <div class="content">
    <canvas ref="canvas"></canvas>
    <div class="metadata"></div>
  </div>
</template>
<script>
import Chart from "chart.js";
import * as d3 from "d3";
let cdsSpeed = 4000;
let activeElement = 0;
let intervalID;
function highlightElement(chart,index){
      chart.data.datasets[0]._meta[1].data.forEach(el=>{
        chart.updateHoverStyle([el],null,index==el._index);
      });
      // render so we can see it
      chart.render();
}

export default {
  props: {
    breakdown: {
      type: Array
    },
    title: {
      type: String,
      default: "Breakdown chart"
    },
    total: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    let ctx = this.$refs.canvas.getContext("2d");
    let getColor = d3.scaleOrdinal(d3.schemeCategory10);
    let labels = [];
    let datasets = [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor:[],
        borderWidth: 1,
        hoverBorderWidth: 5
      }
    ];
    let breakdown_set = [];
    this.breakdown.forEach(el => {
      labels.push(el.title);
      datasets[0].data.push(el.amount);
      let bg=d3.color(getColor(el.title));
      datasets[0].backgroundColor.push(bg.formatRgb());
      bg.opacity=0.5;
      datasets[0].hoverBackgroundColor.push(bg.formatRgb());
      breakdown_set.push({
        title: el.title,
        amount: el.amount,
        percentage: (el.amount * 100) / this.total
      });
    });
    let breakdownChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets
      },
      options: {
        cutoutPercentage: 50,

        responsive: true,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: this.title
        },
        tooltips: {
          enabled: false
        }
      }
    });
    highlightElement(breakdownChart, activeElement);
    intervalID = window.setInterval(() => {
      activeElement=(1+activeElement)%this.breakdown.length
      highlightElement(breakdownChart, activeElement);
    }, cdsSpeed);
  },
  beforeDestroy() {
    window.clearInterval(intervalID);
  }
};
</script>