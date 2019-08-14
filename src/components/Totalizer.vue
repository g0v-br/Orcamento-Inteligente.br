<template>
    <p>{{totalString}}</p>
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
export default {
    props:{
        total:{
            type:String
        }     
    },
    computed:{
        totalString(){
            let totals=this.total.split(";");
            let text=fetchData(totals[0]!=totals[1])
            if(totals[0]==totals[1]){
                return text.replace("%s",totals[0]);
            }else{
                //replace works only with the first occourrence of %s
                return text.replace("%s",totals[1]).replace("%s",totals[1]*100/totals[0]);
            }
        }
    },
}
function fetchData(filter_active){
    let totalizer=bgoStore.any(undefined,ns.rdf("type"),ns.bgo("Totalizer"));
    return bgoStore.anyValue(totalizer,filter_active?ns.bgo("totalFilteredPrintfTemplate"):ns.bgo("totalPrintfTemplate"))
}
</script>

