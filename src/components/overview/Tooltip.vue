<template>
  <v-sheet elevation="1" class="tooltip">
    <h4>{{node.title}}</h4>

    <div class="row">
      <p class="amount">{{printf(totalizer.minimalTotalPrintTemplate, formatAmount(node.amount))}}</p>

      <p class="rate">
        <v-icon
          v-if="withIcon"
          :color="node.rate <0?'red':'green'"
          small
        >{{ (node.rate < 0) ? "mdi-arrow-bottom-right":"mdi-arrow-top-right"}}</v-icon>
        {{ formatPercentage(node.rate) }}
      </p>
    </div>
  </v-sheet>
</template>

<script>
import { formatPercentage, formatAmount, printf } from "@/utils/utils.js";
export default {
  name: "tooltip",
  props: {
    node: Object,
    totalizer: Object
  },
  methods: {
    formatPercentage,
    formatAmount,
    printf
  },
  computed: {
    withIcon: function() {
      return isFinite(this.node.rate) && this.node.rate != 0;
    }
  }

  //   created() {
  //     // console.log("tooltip node", this.node);
  //   }
};
</script>

<style scoped>
.tooltip {
  position: relative;
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