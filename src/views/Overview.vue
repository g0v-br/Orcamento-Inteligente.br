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
          :placeholder="searchPane.label"
          @input="onSearchInput"
        ></v-text-field>
      </div>

      <div class="meta">
        <p class="meta-description">{{metadata.description}}</p>
        {{totalizer(total,totalFiltered)}}
        <StringFormatter class="meta-abstract" :string="metadata.abstract" />
      </div>

      <div ref="chart" class="chart">
        <BubbleChart
          :active-partition-id="activePartitionId"
          :partitions="partitions"
          :search="search"
          :totalizer="totalizer"
          :accounts="accounts"
          :legend="legendData"
          @total_changed="onTotalChanged"
          @nodeover="onNodeOver"
          @nodeout="isNodeHovered = false"
        ></BubbleChart>
        <Tooltip
          v-if="isNodeHovered"
          :amountFormatter="formatters.formatTooltipAmount"
          :rateFormatter="formatters.formatTooltipPercentage"
          :node="hoveredNode"
          :style="{top: hoveredNode.top+'px', left:hoveredNode.left+'px'}"
          class="tooltip"
        />
      </div>

      <div class="tools">
        <div class="tagcloud">
          <router-link
            v-for="tag in tags"
            :key="tag.label"
            :to="{ name: 'accounts-partition',
          params: { partitionId: activePartitionId },
          query: { s: tag.label }}"
            :style="{fontSize: tag.weight *1.4 +0.5 +'em'}"
            class="tag"
          >{{tag.label}}</router-link>
        </div>
        <Legend
          :label="legendData.title"
          :no-trend-color="legendData.noTrendColor"
          :color-tresholds="legendData.colorTresholds"
          :range-tresholds="legendData.rangeTresholds"
          :formatter="formatters.formatLegendPercentage"
          class="legend-bottom"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ServiceFactory } from "@/services/ServiceFactory.js";
import BubbleChart from "@/components/overview/BubbleChart";
import Legend from "@/components/overview/Legend";
import Tooltip from "@/components/overview/Tooltip";
import StringFormatter from "@/components/StringFormatter.vue";
import { debounce } from "lodash";

const OverviewService = ServiceFactory.get("overview");

export default {
  name: "overview",
  components: {
    BubbleChart,
    Legend,
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
      accounts: null,
      activePartitionId: this.partitionId,
      totalizer: null,
      searchPane: null,
      partitions: null,
      tags: [],
      search: null,
      metadata: {},
      legendData: {},
      formatters: {},

      total: 0,
      totalFiltered: 0,
      isNodeHovered: false,
      hoveredNode: {}
    };
  },

  beforeRouteUpdate(to, from, next) {
    // Necessary when the component  si reused after a tag is cliked
    this.activePartitionId = to.params.partitionId; //serve perche quando navigo col menu non chiamo onPartitionChange
    this.search = to.query.s || "";
    next();
  },
  created() {
    this.searchPane = OverviewService.getSearchPane();
    this.totalizer = OverviewService.getTotalizer();
    this.tags = OverviewService.getTagCloud();
    this.partitions = OverviewService.getPartitions();
    this.legendData = OverviewService.getLegendData();
    this.metadata = OverviewService.getMetadata();
    this.formatters = OverviewService.getFormatters();
    this.accounts = OverviewService.getAccounts();
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
      this.totalFiltered = data.totalFiltered;
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
