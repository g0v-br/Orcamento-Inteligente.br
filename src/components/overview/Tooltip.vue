<template>
  <v-sheet elevation="1" class="tooltip">
    <h4>{{node.title}}</h4>

    <div class="row">
      <p class="amount">{{formatAmount( node.amount, totalizer.minimalTotalPrintTemplate)}}</p>

      <p class="rate">{{ formatPercentage(node.rate) }}</p>
    </div>
  </v-sheet>
</template>

<script>
import { formatPercentage, formatAmount } from "@/utils/utils.js";
export default {
  name: "tooltip",
  props: {
    node: Object,
    totalizer: Object
  },
  methods: {
    formatPercentage,
    formatAmount
  }
  //   created() {
  //     // console.log("tooltip node", this.node);
  //   }
};
</script>

<style scoped>
.tooltip {
  display: grid;
  grid-gap: 16px;
  padding: 16px;
  height: 100px;
  width: 350px;
}
.tooltip h4 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 0;
  font-size: 1.2em;
  color: #5c5c5c;
}
.amount {
  vertical-align: bottom;
}
.rate {
  margin-left: auto;
}
p {
  margin-bottom: 0;
}
</style>