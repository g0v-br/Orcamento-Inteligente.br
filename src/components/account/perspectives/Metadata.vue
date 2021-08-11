<template>
  <div class="metadata">
    <div class="title">
      <StringFormatter :string="title" />
    </div>
    <div class="description">
      <StringFormatter :string="description" />
    </div>
    <div class="abstract">
      <StringFormatter :string="abstract" />
    </div>
    <div class="numbers">
      {{formatAmount(this.total)}}
      <Rate class="rate" :rate="rate" :formatter="formatPercentage" />
  </div>
</template>
<script>
import { numberFormatter } from "@/utils/utils.js";
import StringFormatter from "@/components/StringFormatter";
import Rate from "@/components/Rate";
export default {
  components: {
    StringFormatter,
    Rate
  },
  props: {
    title: String,
    description: String,
    abstract: String,
    total: Number,
    rate: Number,
    accountId: String,
    formatAmount: Function,
    formatPercentage: Function
  },
  methods: {
    numberFormatter
  }
};
</script>
<style scoped>
.metadata {
  padding-right: 2em;
  padding-left: 2em;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: scroll
}
.title div {
  margin-bottom: 0.5em;
  font-size: 25px;
}
.description div {
  margin-bottom: 0.0em;
  font-size: 20px;
  font-style: italic;
}
.abstract {
  margin-bottom: 0.0em;
  margin-top: 0.0em;
  /*overflow:auto;*/
}
.numbers {
  margin-top: auto;
  display: flex;
  font-size: 1.4em;
  /* position: absolute; */
  bottom: 0;
}
.rate {
  margin-left: auto;
}
</style>