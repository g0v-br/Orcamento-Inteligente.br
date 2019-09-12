<template>
  <div :id="hash(string.value)"></div>
</template>

<script>
  import { ns } from "@/models/bgo.js";
  import Markdown from "markdown-it";
  export default {
    props: {
      string: {
        type: Object,
        default: () => {
          return {
            value : "default",
            datatype: {
              value : "default"
            }
          }
        }
      }
    },
    mounted() {
      let divDisplay = document.getElementById(this.hash(this.string.value));
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
    },
    methods: {
      hash(string) {
        let hash = 0;
        if (string.length == 0) {
          return hash;
        }
        for (let i = 0; i < string.length; i++) {
          var char = string.charCodeAt(i);
          hash = ((hash<<5)-hash)+char;
          hash = hash & hash;
        }
        return hash;
      }
    }
  };
</script>