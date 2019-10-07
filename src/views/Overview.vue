<template>
  <div class="container-fluid">
    <!-- partitioned is used to remove the side content -->
    <div :class="{'content-grid':true, 'partitioned': activePartitionId != 'overview'}">
      <div class="partitions">
        <v-btn-toggle v-model="activePartitionId" mandatory active-class="primary--text">
          <v-btn
            v-for="partition in partitions"
            :key="partition.id"
            :value="partition.id"
            @click="onPartitionChange(partition.id)"
          >{{partition.label}}</v-btn>
        </v-btn-toggle>
      </div>

      <div class="search">
        <v-text-field
          append-icon="mdi-magnify"
          outlined
          clearable
          v-model="search"
          :placeholder="searchPaneLabel"
          @input="onSearchInput"
        ></v-text-field>
      </div>

      <div class="meta">
        <p class="meta-description">{{metadata.description}}</p>
        <Totalizer :total="total" :filtered="total_filtered" :options="totalizerOptions" />
        <StringFormatter class="meta-abstract" :string="metadata.abstract" />
      </div>

      <div ref="chart" class="chart">
        <BubbleChart
          :active-partition-id="activePartitionId"
          :partitions="partitions"
          :search="search"
          :totOption="totalizerOptions"
          @total_changed="onTotalChanged"
          @nodeover="onNodeOver"
          @nodeout="isNodeHovered = false"
        ></BubbleChart>
        <Tooltip
          v-if="isNodeHovered"
          :options="tooltipOptions"
          :node="hoveredNode"
          :style="{top: hoveredNode.top+'px', left:hoveredNode.left+'px'}"
          class="tooltip"
        />
      </div>

      <div class="tools">
        <div class="tagcloud">
          <router-link
            v-for="tag in tags.slice(0,30)"
            :key="tag.label"
            :to="{ name: 'accounts-partition',
          params: { partitionId: activePartitionId },
          query: { s: tag.label }}"
            :style="{fontSize: tag.weight *1.4 +0.5 +'em'}"
            class="tag"
          >{{tag.label}}</router-link>
        </div>
        <Legend
          :label="legendData.label"
          :no-trend-color="legendData.noTrendColor"
          :color-tresholds="legendData.colorTresholds"
          :range-tresholds="legendData.rangeTresholds"
          class="legend-bottom"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import BubbleChart from "@/components/overview/BubbleChart";
import Legend from "@/components/overview/Legend";
import Totalizer from "@/components/Totalizer";
import Tooltip from "@/components/overview/Tooltip";
import StringFormatter from "@/components/StringFormatter.vue";
import { debounce } from "lodash";

export default {
  name: "overview",
  components: {
    BubbleChart,
    Legend,
    Totalizer,
    Tooltip,
    StringFormatter
  },
  props: {
    partitionId: {
      type: String,
      default: "overview"
    }
  },
  data() {
    return {
      activePartitionId: this.partitionId,
      partitions: [],
      searchPaneLabel: "",
      search: null,
      tags: [],
      total: 0,
      total_filtered: 0,
      isNodeHovered: false,
      hoveredNode: {},
      legendData: {
        label: "",
        noTrendColor: "",
        colorTresholds: [],
        rangeTresholds: []
      },
      totalizerOptions: {
        format: "",
        filteredFormat: "",
        precision: 0,
        rateFormatter: {
          format: "",
          precision: 0,
          scaleFactor: 0,
          maxValue: 0,
          minValue: 0,
          moreThanMaxFormat: "",
          lessThanMinFormat: ""
        }
      },
      tooltipOptions: {
        format: "",
        filteredFormat: "",
        precision: 0,
        rateFormatter: {
          format: "",
          nanFormat: "",
          precision: 0,
          scaleFactor: 0,
          maxValue: 0,
          minValue: 0,
          moreThanMaxFormat: "",
          lessThanMinFormat: ""
        }
      },
      metadata: {
        description: "",
        abstract: null
      }
    };
  },

  beforeRouteUpdate(to, from, next) {
    // Necessary when the component  si reused after a tag is cliked
    this.activePartitionId = to.params.partitionId; //serve perche quando navigo col menu non chiamo onPartitionChange
    this.search = to.query.s || "";
    next();
  },
  created() {
    fetchData(this);
    this.search = this.$route.query.s || "";
  },
  methods: {
    onPartitionChange(partitionId) {
      this.$router.push({
        name: "accounts-partition",
        params: { partitionId },
        query: { s: this.search }
      });
    },
    onSearchInput() {
      // this.selectedTag = null;
      this.$router.replace({
        name: "accounts-partition",
        params: { partitionId: this.activePartitionId },
        query: { s: this.search }
      });
    },
    onTotalChanged(data) {
      this.total = data.total;
      this.total_filtered = data.total_filtered;
    },
    onNodeOver(node) {
      const tooltipHeight = 130;
      const tooltipWidth = 400;
      const boundHeight = this.$refs.chart.offsetHeight;
      const boundWidth = this.$refs.chart.offsetWidth;
      // let top = node.y + node.r / 1.4142;
      let top = node.y - node.r - tooltipHeight - 8;
      // let left = node.x + node.r / 1.4142;
      let left = node.x - tooltipWidth / 2;
      left = left < 0 ? 0 : left;
      // if (top + tooltipHeight > boundHeight) {
      //   top = boundHeight - tooltipHeight;
      // }
      if (left + tooltipWidth > boundWidth) {
        left = boundWidth - tooltipWidth;
      }
      this.hoveredNode = Object.assign({}, this.hoveredNode, node, {
        top,
        left
      });
      this.isNodeHovered = true;
    }
  }
};

function fetchData(app) {
  const domain = bgoStore.any(undefined, ns.bgo("hasOverview"));
  const overview = bgoStore.any(domain, ns.bgo("hasOverview"));
  // Domain Metadata
  app.metadata.description = bgoStore.anyValue(domain, ns.bgo("description"));
  app.metadata.abstract = bgoStore.any(domain, ns.bgo("abstract"));
  // Partition metadata
  // Push default partition with id 'overview'
  app.partitions.push({
    id: "overview",
    label: bgoStore.anyValue(overview, ns.bgo("label")),
    total: 0,
    total_filtered: 0
  });
  const partitionsNode = bgoStore.any(overview, ns.bgo("hasPartitions"));
  const partitions = bgoStore.any(partitionsNode, ns.bgo("hasPartitionList"))
    .elements;
  //add other partitions
  //fetch partitions data
  for (const partition of partitions) {
    let id = bgoStore.anyValue(partition, ns.bgo("partitionId"));
    let label = bgoStore.anyValue(partition, ns.bgo("label"));
    let title = bgoStore.anyValue(partition, ns.bgo("title"));
    let sortOrder =
      bgoStore.anyValue(partition, ns.bgo("sortOrder")) ||
      ns.bgo("descending_sort").value;
    let sortCriteria =
      bgoStore.anyValue(partition, ns.bgo("sortCriteria")) ||
      ns.bgo("abs_sort").value;
    let groupFunction =
      bgoStore.anyValue(partition, ns.bgo("groupFunction")) ||
      ns.bgo("amounts_sum").value;

    //fetch subset data
    let subsets_uris = bgoStore.each(partition, ns.bgo("hasAccountSubSet"));
    let subsets = [];

    // Add default subset
    let defaultSubset = bgoStore.any(
      partition,
      ns.bgo("hasDefaultAccountSubSet")
    );
    let subsetLabel;
    let subsetTitle;
    if (defaultSubset) {
      subsetLabel = bgoStore.anyValue(defaultSubset, ns.bgo("label")) || "";
      subsetTitle = bgoStore.any(defaultSubset, ns.bgo("title"));
    }
    subsets.push({
      id: "default",
      title: subsetTitle, //TODO "Unassigned", sistemare lo string formatter in modo che gestica le stringhe non gli oggetti
      label: subsetLabel ? subsetLabel : "",
      total: 0,
      total_filtered: 0,
      description: "",
      abstract: undefined
    });

    //for each partition add its subsets
    subsets_uris.forEach(subset => {
      let s_title = bgoStore.any(subset, ns.bgo("title"));
      let s_label = bgoStore.anyValue(subset, ns.bgo("label")) || "";
      let description = bgoStore.anyValue(subset, ns.bgo("description")) || "";
      let abstract = bgoStore.any(subset, ns.bgo("abstract"));
      subsets.push({
        id: subset.value,
        title: s_title,
        description,
        abstract,
        label: s_label,
        total: 0,
        total_filtered: 0
      });
    });

    app.partitions.push({
      id,
      label,
      title,
      sortOrder,
      sortCriteria,
      groupFunction,
      subsets
    });
  }
  // Search metadata
  const searchPane = bgoStore.any(overview, ns.bgo("hasSearchPane"));
  app.searchPaneLabel = bgoStore.anyValue(searchPane, ns.bgo("label"));

  // TagCloud metadata
  const tagCloud = bgoStore.any(overview, ns.bgo("hasTagCloud"));
  bgoStore.each(tagCloud, ns.bgo("hasTag")).forEach(tag => {
    const label = bgoStore.anyValue(tag, ns.bgo("label"));
    const weight = bgoStore.anyValue(tag, ns.bgo("tagWeight"));
    app.tags.push({ label, weight });
  });

  // Legend metadata
  const colorScheme = bgoStore.any(overview, ns.bgo("hasTrendColorScheme"));
  app.legendData.label = bgoStore.anyValue(colorScheme, ns.bgo("title"));
  app.legendData.noTrendColor = bgoStore.anyValue(
    colorScheme,
    ns.bgo("noTrendColor")
  );
  bgoStore
    .each(colorScheme, ns.bgo("rateTreshold"))
    .sort((tresholdA, tresholdB) => {
      let rateA = bgoStore.anyValue(tresholdA, ns.bgo("rate"));
      let rateB = bgoStore.anyValue(tresholdB, ns.bgo("rate"));
      return rateA - rateB;
    })
    .forEach(treshold => {
      app.legendData.rangeTresholds.push(
        bgoStore.anyValue(treshold, ns.bgo("rate"))
      );
      app.legendData.colorTresholds.push(
        bgoStore.anyValue(treshold, ns.bgo("colorId"))
      );
    });

  // Totalizer
  let totalizer = bgoStore.any(overview, ns.bgo("hasTotalizer"));
  let rateFormatter = bgoStore.any(totalizer, ns.bgo("ratioFormatter"));

  app.totalizerOptions.format = bgoStore.anyValue(totalizer, ns.bgo("format"));
  app.totalizerOptions.filteredFormat = bgoStore.anyValue(
    totalizer,
    ns.bgo("filteredFormat")
  );
  app.totalizerOptions.precision = bgoStore.anyValue(
    totalizer,
    ns.bgo("precision")
  );

  app.totalizerOptions.rateFormatter.format = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("format")
  );
  app.totalizerOptions.rateFormatter.precision = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("precision")
  );
  app.totalizerOptions.rateFormatter.scaleFactor = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("scaleFactor")
  );
  app.totalizerOptions.rateFormatter.maxValue = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("maxValue")
  );
  app.totalizerOptions.rateFormatter.minValue = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("minValue")
  );
  app.totalizerOptions.rateFormatter.moreThanMaxFormat = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("moreThanMaxFormat")
  );
  app.totalizerOptions.rateFormatter.lessThanMinFormat = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("lessThanMinFormat")
  );

  //tooltip
  let tooltip = bgoStore.any(overview, ns.bgo("hasTooltip"));
  let amountFormatter = bgoStore.any(tooltip, ns.bgo("amountFormatter"));
  rateFormatter = bgoStore.any(tooltip, ns.bgo("trendFormatter"));

  app.tooltipOptions.format = bgoStore.anyValue(
    amountFormatter,
    ns.bgo("format")
  );
  app.tooltipOptions.precision = bgoStore.anyValue(
    amountFormatter,
    ns.bgo("precision")
  );

  app.tooltipOptions.rateFormatter.format = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("format")
  );
  app.tooltipOptions.rateFormatter.nanFormat = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("nanFormat")
  );
  app.tooltipOptions.rateFormatter.scaleFactor = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("scaleFactor")
  );
  app.tooltipOptions.rateFormatter.precision = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("precision")
  );
  app.tooltipOptions.rateFormatter.maxValue = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("maxValue")
  );
  app.tooltipOptions.rateFormatter.minValue = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("minValue")
  );
  app.tooltipOptions.rateFormatter.moreThanMaxFormat = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("moreThanMaxFormat")
  );
  app.tooltipOptions.rateFormatter.lessThanMinFormat = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("lessThanMinFormat")
  );
}
</script>

<style scoped>
/* Large desktop */
.container-fluid {
  padding: 24px 12px;
  height: 100%;
}

.content-grid {
  position: relative;
  height: 100%;
  display: grid;
  grid-gap: 0.5em;
  grid-template-areas:
    "part part search"
    "meta chart tools";
  grid-template-rows: 80px 1fr;
  grid-template-columns: 1fr 2fr 1fr;
}

/* Extends chart column to fill the screen */
.content-grid.partitioned {
  grid-template-areas:
    "part part search"
    "chart chart chart";
}

/* remove meta and tools columns when partioned */
.content-grid.partitioned .tools,
.content-grid.partitioned .meta {
  display: none;
}

.partitions {
  grid-area: part;
}
.search {
  grid-area: search;
}
.meta {
  position: relative;
  grid-area: meta;
  /* height: 70vh;
  overflow: auto; */
  /* line-height: 1.5em; */
  /* height: calc(50% - 80px); */
  /* overflow: hidden; */
}
/* .meta-description {
  overflow: auto;
  } */

.meta-abstract {
}

.chart {
  position: relative;
  grid-area: chart;
}
.chart .tooltip {
  position: absolute;
  top: 0;
  left: 0;
}
.tools {
  grid-area: tools;
  display: flex;
  flex-direction: column;
}
.legend-bottom {
  height: 80px;
  margin-top: auto;
}
.tagcloud {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tagcloud .tag {
  text-decoration: none;
  color: #919191;
  width: auto;
  margin: 0 0.2em;
  text-align: center;
  vertical-align: middle;
}
.tagcloud .tag:hover {
  color: #6b6b6b;
}

/* Landscape phones to portrait tablets and desktop */
@media (max-width: 979px) {
  .content-grid {
    grid-template-areas:
      "part part search"
      "meta chart chart";

    grid-template-columns: 1fr 1fr 1fr;
  }

  .tools {
    display: none;
  }
}

/* Landscape phones and down */
@media (max-width: 768px) {
  .container-fluid {
    /* min-height: 120vh; */
  }
  .content-grid {
    grid-template-areas:
      "part"
      "search"
      "meta"
      "chart";

    grid-template-rows: auto auto auto 100vw;
    grid-template-columns: 1fr;
    grid-gap: 1.5em;
  }

  .content-grid.partitioned {
    grid-template-areas:
      "part"
      "search"
      "chart";
    grid-template-rows: 1fr 1fr auto;
  }

  .tools {
    display: none;
  }
}
</style>
