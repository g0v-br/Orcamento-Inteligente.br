<template>
  <div :id="string.value"></div>
</template>

<script>
  import { ns } from "@/models/bgo.js";
  import Markdown from "markdown-it";
  export default {
    props: {
      string: {
        type: Object,
        default: {value : "default"}
      }
    },
    data(){
      return {
        id: string.value
      }
    },
    mounted() {
      let divDisplay = document.getElementById(this.string.value);
      let md = new Markdown();
      
      let display;

      switch(this.string.datatype.value) {
        case ns.bgo("MDString").value:
          display = md.render(this.string.value);
          break;
        default:
          display = this.string.value;
          break;
      }

      divDisplay.innerHTML = display;

    }
  };

</script>