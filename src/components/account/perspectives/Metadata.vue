<template>
    <div class="metadata">
      
      <div class="title"><StringFormatter :string="title"/> </div>
      <div class="description"><StringFormatter :string="description"/></div>
      <div class="abstract"><StringFormatter :string="abstract"/></div>
      <div class="numbers">
        <Totalizer :total="total" />
        <div class="rate">{{rate}}%</div>
      </div>
    </div>
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import Totalizer from "@/components/Totalizer"
import StringFormatter from "@/components/StringFormatter"
export default {
 components: {
    Totalizer,
    StringFormatter
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
      total: undefined,
      rate:undefined
    };
  },
  created(){
    fetchData(this);
  }
}

let fetchData = app => {
  let accountId = app.accountId;
  let account = bgoStore.any(undefined, ns.bgo("accountId"), accountId);
  app.title=bgoStore.any(account,ns.bgo("title"))||accountId;
  app.description=bgoStore.any(account,ns.bgo("description"))||"";
  app.abstract=bgoStore.any(account,ns.bgo("abstract")) ||"";
  app.total=bgoStore.anyValue(account,ns.bgo("amount"));
  console.log(app.description);
  console.log(app.abstract);
  console.log(app.title);
  let reference=bgoStore.anyValue(account,ns.bgo("referenceAmount"));
  app.rate=(app.total-reference)*100/reference
};
</script>