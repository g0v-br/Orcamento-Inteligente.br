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
      <Totalizer :total="total" />
      <Rate :rate="rate" :show_icon="true"/>
    </div>
  </div>
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import Totalizer from "@/components/Totalizer";
import StringFormatter from "@/components/StringFormatter";
import Rate from "@/components/Rate";
export default {
  components: {
    Totalizer,
    StringFormatter,
    Rate
  },
  props: {
    accountId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      title: undefined,
      description: undefined,
      abstract: undefined,
      total: "",
      rate: ""
    };
  },
  created() {
    fetchData(this);
  },
 
};

let fetchData = app => {
  let accountId = app.accountId;
  let account = bgoStore.any(undefined, ns.bgo("accountId"), accountId);
  app.title = bgoStore.any(account, ns.bgo("title")) || { value: accountId };
  app.description = bgoStore.any(account, ns.bgo("description")) || {
    value: ""
  };
  app.abstract = bgoStore.any(account, ns.bgo("abstract")) || { value: "" };
  app.total = bgoStore.anyValue(account, ns.bgo("amount"));
  let reference = bgoStore.anyValue(account, ns.bgo("referenceAmount"));
  app.rate = (app.total - reference) / reference;
};
</script>
<style scoped>
.metadata {
  padding-right: 2em;
  padding-left: 2em;
  height: 100%;
  position: relative;
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
  position: absolute;
  bottom: 0;
}
</style>