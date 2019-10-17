<template>
  <div class="content">
    <!-- <h4>{{title}}</h4> -->
    <canvas v-if="historicRec.length!=0" ref="canvas"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
export default {
  props: {
    historicRec: Array,
    formatAmount: Function,
    title: {
      type: String,
      default: "Bar chart"
    }
  },
  mounted() {
    if (this.historicRec.length != 0) {
      let color = Chart.helpers.color;
      let ctx = this.$refs.canvas.getContext("2d");

      let data = this.historicRec.map(rec => {
        return Number(rec.y);
      });

      let labels = this.historicRec.map(rec => {
        return rec.x;
      });

      let maxAmount = data.reduce((max, curr) => {
        return max > curr ? max : curr;
      }, 0);

      let chartData = {
        labels,
        datasets: [
          {
            data,
            backgroundColor: color("#1976D2")
              .alpha(0.5)
              .rgbString(),
            borderColor: "#1976D2",
            borderWidth: 1
          }
        ]
      };
      let barCahrt = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          title: {
            display: true,
            text: this.title
          },
          tooltips: {
            displayColors: false,
            callbacks: {
              label: tooltipItem => {
                return this.formatAmount(tooltipItem.yLabel);
              }
            }
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: maxAmount + 1,
                  callback: value => {
                    return this.formatAmount(value);
                  }
                }
              }
            ]
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.content {
  position: relative;
  height: 100%;
  width: 100%;
}
canvas {
  height: 100%;
  width: 100%;
}
p.dataError {
  color: red;
}
</style>