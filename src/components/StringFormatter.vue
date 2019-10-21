<template>
  <div class="inline">
    <span class="stringDisplayed" v-html="getFormattedString(string)"></span>
    <v-icon class="info-icon" v-if="popup" @click="dialog=true">mdi-information-outline</v-icon>
    <v-dialog v-model="dialog" max-width="290" clearable>
      <v-card>
        <v-card-text v-html="getFormattedString(popup)"></v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Markdown from "markdown-it";
export default {
  props: {
    string: {
      type: String,
      default: () => {
        return "";
      }  
    },
    popup: {
      type: String,
      default: () => {
        return "";
      }
    },
    inline: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    getFormattedString(value) {
      let md;
      md = new Markdown();
      value = this.inline ? md.renderInline(value) : md.render(value);
      return value;
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
  margin-bottom: 0em;
  margin-top: 0em;
  display: inline-block;
}

</style>