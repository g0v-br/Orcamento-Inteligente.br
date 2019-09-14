<template>
<div>
  <div 
  :id="hash(string.value)"
  @click="dialog=true"
  ></div>
  <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Use Google's location service?</v-card-title>
        <v-card-text>
          Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Disagree
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>

<script>
  import { ns } from "@/models/bgo.js";
  import Markdown from "markdown-it";
  export default {
    props: {
      hasPopup: {
          type: Object
      },
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
    data () {
      return {
        dialog: false
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