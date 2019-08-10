<template>
    
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
export default {
    props:{
        total:{
            type:Object
        },
        newData:{
            type:Boolean
        }
        
    },
    whatch:{
        newData:{
            handler:((newVal)=>{
                let total_string=fetchData(filter_active);
                console.log("NE DATAAAAAAAAAAAAAAAA")
            })
        }
    }
}
function fetchData(filter_active){

}
</script>

