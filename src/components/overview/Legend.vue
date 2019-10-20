<template>
  <div ref="legend">
    <small>{{label}}</small>
    <ul class="colors">
      <li v-for="(color, i) in colorTresholds" :key="i" :style="{background: color}"></li>
    </ul>
    <ul class="ranges">
      <li v-for="(range, i) in rangeTresholds" :key="i"><Rate :rate="parseFloat(range)" :show_icon="false" :formatter="formatter"/></li>
    </ul>
  </div>
</template>

<script>
import Rate from "@/components/Rate";
import { Stream } from "stream";
export default {
  props: {
    label: String,
    noTrendColor: String,
    colorTresholds: Array,
    rangeTresholds: Array,
    formatter: Function,
  },

  components: {
    Rate
  },
 

};
</script>

<style scoped>
.colors,
.ranges {
  list-style: none;
  margin: 0.5em 0;
  padding: 0;
  width: 100%;
  height: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.colors li {
  flex: 1;
  text-align: center;
  padding: 0;
  margin: 0 .5px;
  height: 1rem;
}

.ranges li {
  font-size: 0.8em;
  flex: 1;
  text-align: center;
  padding: 0;
  margin: 0 2px;
  height: 1rem;
}
</style>