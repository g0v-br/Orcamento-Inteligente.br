<template>
  <v-footer class="font-weight-medium">
    <v-btn
      text
      small
      v-for="(el,k) in footerItems"
      :key="k"
      class="my-2 footer-btn"
      :href="el.path"
      :target="el.target"
    >
      <v-icon  size="24px">{{ el.icon }}</v-icon>{{el.title}}
    </v-btn>
    <span class="copyright">
      <StringFormatter :string="copyright" :inline="true"/>
    </span>
  </v-footer>
</template>
<script>
import StringFormatter from "@/components/StringFormatter"
export default {
  components:{
    StringFormatter
  },
  props: {
      footerItems: Array,
      copyright: String
  },
  methods:{
    hasIcon(el){
      //console.lo(el)
      return true;
    }
  }
};

</script>

<style scoped>
.copyright {
  margin-left: auto;
  margin-right: 10px;
  color: rgba(100, 100, 100, 1);
}
.footer-btn {
  color: rgba(100, 100, 100, 1);
}
</style>
