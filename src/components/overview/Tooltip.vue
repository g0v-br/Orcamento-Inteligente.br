<template>
  <v-sheet elevation="1" class="tooltip">
    <h4 class="title">{{node.title}}</h4>
    <div class="row">
      <div><p class="description">{{node.description}}</p></div>
    </div>
    <div class="row">
      <div><p class="amount">{{amountFormatter(node.amount)}}</p></div>
      <Rate :rate="node.rate" :show_icon="true" :formatter="rateFormatter"/>
    </div>
  </v-sheet>
</template>

<script>
import { formatAmount, printf } from "@/utils/utils.js";
import Rate from "@/components/Rate";
export default {
  name: "tooltip",
  props: {
    node: Object,
    options: Object,
    amountFormatter: Function,
    rateFormatter: Function
  },
  components: {
    Rate
  },
  methods: {
    formatAmount,
    printf
  },
  computed: {
    withIcon: function() {

      return isFinite(this.node.rate) && this.node.rate != 0;
    }
  }
};
</script>

<style scoped>
.tooltip {
  position: relative;
  z-index: 50;
  display: grid;
  /* grid-gap: 16px; */
  padding: 16px;
  width: 400px;
  /* height: 140px; */
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
  font-size: 1.3em;
  color: #5c5c5c;
}
.amount {
  vertical-align: bottom;
}
.description{
  font-size: 15px;
  padding:0.5em;
}
.rate {
  margin-left: auto;
}
p {
  margin-bottom: 0;
}
</style>
