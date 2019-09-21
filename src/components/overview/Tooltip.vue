<template>
  <v-sheet elevation="1" class="tooltip">
    <h4 class="title">{{node.title}}</h4>
    <div class="row">
      <p class="amount">{{printf(totalizer.minimalTotalPrintTemplate, formatAmount(node.amount))}}</p>
      <Rate :rate="node.rate" :show_icon="true" />
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
    totalizer: Object
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
  display: grid;
  /* grid-gap: 16px; */
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
  font-size: 1.3em;
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
