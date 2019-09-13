<template>
    <div  class="container">
        <h1><StringFormatter :string="title"/></h1>
    	<StringFormatter :string="abstract"/>
    	<!-- Warning: removing or changing the following statement breaks the LODMAP2D license -->
	    <div class="ldc-credits" >
	    	<p>
	    		This application includes the <a href="https://github.com/linkeddatacenter/LODMAP2D">LODMAP2D software</a> developed by 
	    		<a href="http://LinkedData.Center/">LinkedData.Center</a> and contributors.
	    	</p>
	    </div>
    </div>
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js"; 
import StringFormatter from "@/components/StringFormatter.vue";
export default {
  name: "Credits",
  components: {
    StringFormatter
  },
  data() {
    return {
      title: {},
      abstract: {}
    };
  },
  created() {
    let creditsView = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("CreditsView"));
    this.title = bgoStore.any(creditsView, ns.bgo("title"));
    this.abstract = bgoStore.any(creditsView, ns.bgo("abstract"));
  }
};
</script>

<style scoped>
  .container{
    margin:0px;
    padding-left: 1em;
    padding-right: 1em;
  }
   .container div{
    width: 100%;
    height: 100%;
  }
  .ldc-credits {
	margin-left: auto;
	margin-top: 1em;
	font-style: italic;
	color: rgba(100, 100, 100, 1);
  }
</style>