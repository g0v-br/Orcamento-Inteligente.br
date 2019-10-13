<template>
  <div class="metadata">
    <div class="title">
      <StringFormatter :string="title" />
    </div>
    <div class="description">
      <StringFormatter :string="description" />
    </div>
    <hr />
    <div class="abstract">
      <StringFormatter :string="abstract" />
    </div>
    <div class="numbers">
      {{formatAmount(this.total)}}
      <Rate class="rate" :rate="rate" :formatter="formatPercentage" />
    </div>
  </div>
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import { numberFormatter } from "@/utils/utils.js";
import StringFormatter from "@/components/StringFormatter";
import Rate from "@/components/Rate";
export default {
  components: {
    StringFormatter,
    Rate
  },
  props: {
    title: Object,
    description: Object,
    abstract: Object,
    total: Number,
    rate: Number,
    accountId: String,
    formatAmount: Function,
    formatPercentage: Function
    // totalFormatterOptions:{
    //   type: Object
    // },
    // rateFormatterOptions:{
    //   type: Object
    // }
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
}
.title div {
  margin-bottom: 0.5em;
  font-size: 25px;
}
.description div {
  margin-bottom: 0.5em;
  font-size: 20px;
  font-style: italic;
}
.abstract {
  margin-bottom: 0.5em;
  margin-top: 0.5em;
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