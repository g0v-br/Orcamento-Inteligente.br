<template>
  <div style="display:flex; align-items:center;">
    <span class="stringDisplayed" :id="hash(string.value)"></span>
    <v-icon class="info-icon"  v-if="hasPopup" @click="dialog=true" medium>mdi-information-outline</v-icon>
    <v-dialog v-model="dialog" max-width="290" clearable>
      <v-card>
        <v-card-text>{{popup.value}}</v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
let defaultObject = {
  value: "default",
  datatype: {
    value: "default"
  }
};
import { ns } from "@/models/bgo.js";
import Markdown from "markdown-it";
export default {
  props: {
    popup: {
      type: Object,
      default: () => {
        return defaultObject;
      }
    },
    string: {
      type: Object,
      default: () => {
        return defaultObject;
      }
    }
  },
  data() {
    return {
      dialog: false,
      hasPopup: true
    };
  },
  mounted() {
    let divDisplay = document.getElementById(this.hash(this.string.value));
    let md = new Markdown();

    let display;

    switch (this.string.datatype.value) {
      case ns.bgo("MDString").value:
        display = md.render(this.string.value);
        break;
      default:
        display = this.string.value;
        break;
    }
    divDisplay.innerHTML = display;

    //if it has popup
    this.hasPopup =
      this.popup == undefined || this.popup.value == defaultObject.value
        ? false
        : true;
  },
  methods: {
    hash(string) {
      let hash = 0;
      if (string.length == 0) {
        return hash;
      }
      for (let i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return hash;
    }
  }
};
</script>
<style type="text/css" media="screen">
.info-icon:hover {
  color: #1976D2;
}
.stringDisplayed {
  margin-right: .5em;
}
</style>