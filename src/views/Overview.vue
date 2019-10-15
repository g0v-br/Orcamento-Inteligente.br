<template>
  <div class="container-fluid">
    <!-- partitioned is used to remove the side content -->
    <div :class="{'content-grid':true, 'partitioned': activePartition.id != 'overview'}">
      <div class="partitions">
        <v-btn-toggle v-model="activePartition.id" mandatory active-class="primary--text">
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
          :active-partition="activePartition"
          :search="search"
          :totalizer="totalizer"
          :accounts="accounts"
          :legend="legendData"
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
          params: { partitionId: activePartition.id },
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
let debouncedSearch;

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
      activePartition: null,
      totalizer: null,
      searchPane: null,
      partitions: null,
      criteria: null,
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
    this.activePartition = this.partitions.find(partition => {
      //serve perche quando navigo col menu non chiamo onPartitionChange
      return partition.id == to.params.partitionId;
    });
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
    this.criteria = OverviewService.getCriteria();
    this.search = this.$route.query.s || "";
    this.activePartition = this.partitions.find(partition => {
      return partition.id == this.partitionId;
    });

    //wait that user finish to write search string
    debouncedSearch = debounce((newVal, app) => {
      this.updateAccounts();
    }, 200);
    //initialize accounts
    this.updateAccounts();
  },
  watch: {
    search: {
      handler: function(newVal) {
        let app = this;
        debouncedSearch(newVal, app);
      },
      deep: true
    }
  },

  methods: {
    //reset totals, active accounts, compute new totals
    updateAccounts() {
      this.resetTotal();
      this.accounts.forEach(account => {
        account["active"] = this.match(account, this.search);
        this.updateTotals(account);
      });
      let overviewPartition = this.partitions.find(partition => {
        return partition.id == "overview";
      });
      if(overviewPartition.id!=this.activePartition.id)
        this.sortSubset();
      this.total = overviewPartition.total;
      this.totalFiltered = overviewPartition.totalFiltered;
    },
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
        params: { partitionId: this.activePartition.id },
        query: { s: this.search }
      });
    },
    //tooltip
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
    },
    //compute totals for each subset and partition. called on search text change
    updateTotals(node, total_to_compute) {
      //update overview total
      let overviewPartition = this.partitions.find(p => {
        return p.id == "overview";
      });
      if (total_to_compute == "total" || total_to_compute == undefined) {
        overviewPartition.total += node.amount;
      }
      if (
        (total_to_compute == "filtered" || total_to_compute == undefined) &&
        node.active
      ) {
        overviewPartition.totalFiltered += node.amount;
      }
      if (this.activePartition.id != "overview") {
        let target_subset = node.partitions[this.activePartition.id];
        //groupFunction define the way to calculate totals
        switch (this.activePartition.groupFunction) {
          //total = (sum of nodes.ammount - sum of nodes.referenceAmount)/ sum of nodes.referenceAmount
          case this.criteria["TrendAverage"]:
            if (target_subset.totalSupport == undefined) {
              target_subset.totalSupport = {
                amount: 0,
                amountFiltered: 0,
                referenceAmount: 0,
                referenceAmountFiltered: 0
              };
            }
            if (total_to_compute == "total" || total_to_compute == undefined) {
              target_subset.totalSupport.amount += node.amount;
              target_subset.totalSupport.referenceAmount +=
                node.referenceAmount;
              target_subset.total =
                (target_subset.totalSupport.amount -
                  target_subset.totalSupport.referenceAmount) /
                target_subset.totalSupport.referenceAmount;
            }
            if (
              (total_to_compute == "filtered" ||
                total_to_compute == undefined) &&
              node.active
            ) {
              target_subset.totalSupport.amountFiltered += node.amount;
              target_subset.totalSupport.referenceAmountFiltered +=
                node.referenceAmount;
              target_subset.totalFiltered =
                (target_subset.totalSupport.amountFiltered -
                  target_subset.totalSupport.referenceAmountFiltered) /
                target_subset.totalSupport.referenceAmountFiltered;
            }
            break;
          //total = sum of node.account (absolute o natural)
          case this.criteria["AmountsSum"]:
            if (total_to_compute == "total" || total_to_compute == undefined)
              target_subset.total +=
                target_partition.sortCriteria == this.criteria["abs_sort"]
                  ? Math.abs(node.amount)
                  : node.amount;
            if (
              (total_to_compute == "filtered" ||
                total_to_compute == undefined) &&
              node.active
            )
              target_subset.totalFiltered +=
                target_partition.sortCriteria == this.criteria["abs_sort"]
                  ? Math.abs(node.amount)
                  : node.amount;
            break;
          //total = number of nodes in the subset
          case this.criteria["AmountsCount"]:
            if (total_to_compute == "total" || total_to_compute == undefined)
              target_subset.total += 1;
            if (
              (total_to_compute == "filtered" ||
                total_to_compute == undefined) &&
              node.active
            )
              target_subset.totalFiltered += 1;
            break;
        }
      }
    },
    //reset filtered totals
    resetTotal() {
      this.partitions.forEach(partition => {
        if (partition.id != "overview") {
          partition.subsets.forEach(subset => {
            subset.totalFiltered = 0;

            if (subset.totalSupport != undefined) subset.totalSupport = null;
          });
        } else {
          partition.totalFiltered = 0;
        }
      });
    },
    // if account contains text return true, false otherwise
    match(account, text) {
      return (
        account.id == text ||
        account.title.toLowerCase().includes(text) ||
        account.description.toLowerCase().includes(text) ||
        account.abstract.toLowerCase().includes(text)
      );
    },
    sortSubset() {
      // sort array asc or desc
      this.activePartition.subsets.sort((a, b) => {
        return a.totalFiltered - b.totalFiltered;
      });
      if (partition_active.sortOrder == this.criteria.descending_sort) {
        partition_active.subsets.reverse();
      }
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
