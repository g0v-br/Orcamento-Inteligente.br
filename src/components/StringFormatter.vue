<template>
  <div id="display"></div>
</template>

<script>
  import { ns } from "@/models/bgo.js";
  import Markdown from "markdown-it";
  export default {
    props: {
      string: {
        type: Object
      }
    },
    mounted() {
      let divDisplay = document.getElementById("display");
      let md = new Markdown();
      
      let display;
      if (ns.bgo("MDString").value == this.string.datatype.value){
        display = md.renderInline(this.string.value);
      } else {
        display = this.string.value; 
      }

      divDisplay.innerHTML = display;
    }
  };

</script>