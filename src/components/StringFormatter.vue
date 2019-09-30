<template>
  <!-- <div style="display:flex; align-items:center;"> -->
  <div>
    <span class="stringDisplayed" :id="hash(string.value)">{{string.value}}</span>
    <v-icon class="info-icon" v-if="hasPopup" @click="dialog=true">mdi-information-outline</v-icon>
    <v-dialog v-model="dialog" max-width="290" clearable>
      <v-card>
        <v-card-text v-html="popup.value"></v-card-text>
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
      dialog: false
    };
  },
  mounted() {
    let element;
    // if (this.isDefined(this.string)) {
    //   element = document.getElementById(this.hash(this.string.value));
    //   element.innerHTML = this.getFormattedString(this.string);
    // }

    if (this.isDefined(this.popup)) {
      /*element = document.getElementById("ekkle");*/
      this.popup.value = this.getFormattedString(this.popup);
    }
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
    },
    isDefined(literal) {
      return literal == undefined || literal.value == defaultObject.value
        ? false
        : true;
    },
    getFormattedString(literal) {
      let display, md;

      md = new Markdown();
      switch (literal.datatype.value) {
        case ns.bgo("MDString").value:
          display = md.render(literal.value);
          break;
        default:
          display = literal.value;
          break;
      }
      /*element.innerHTML =*/
      return display;
    }
  },
  computed: {
    hasPopup() {
      return this.popup == undefined || this.popup.value == defaultObject.value
        ? false
        : true;
    }
  }
};
</script>
<style scoped>
.info-icon:hover {
  color: #1976d2;
}
.stringDisplayed {
  margin-right: 0.3em;
}
</style>