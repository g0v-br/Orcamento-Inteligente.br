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
let intervalID;

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
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let labels = [];
    let datasets = [
      {
        data: [],
        backgroundColor: [],
        borderWidth: 1,
        hoverBorderWidth: 5,
        
      }];
    let breakdown_set=[];
    this.breakdown.forEach(el => {
      labels.push(el.title);
      datasets[0].data.push(el.amount);
      datasets[0].backgroundColor.push(color(el.title));
      breakdown_set.push({
        title:el.title,
        amount:el.amount,
        percentage: el.amount*100/this.total
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

    intervalID = window.setInterval(() => {
      console.log(breakdownChart.active)
      let el=breakdownChart.inactive.pop()
      breakdownChart.active=[el]
    }, cdsSpeed);
  },
  beforeDestroy() {
    window.clearInterval(intervalID);
  }
};
</script>