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
          :criteria="criteria"
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
import { log } from "util";

function print(text) {
  console.log(JSON.parse(JSON.stringify(text)));
}

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

      // Totali per il totalizer nei meta
      total: 0,
      totalFiltered: 0,
      //
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
    this.accounts = OverviewService.getAccounts().map(account => ({
      ...account,
      active: true
    }));
    this.criteria = OverviewService.getCriteria();
    this.search = this.$route.query.s || "";
    this.activePartition = this.partitions.find(partition => {
      return partition.id == this.partitionId;
    });

    // print(this.partitions);
    // this.partitions[1].subsets[0].resetTotals();

    //wait that user finish to write search string
    debouncedSearch = debounce(this.updateAccounts, 200);
    //initialize accounts
    debouncedSearch();
    // this.updateAccounts();
  },
  watch: {
    search: function(newVal, oldVal) {
      debouncedSearch();
    }
    // deep: true
  },

  computed: {
    // accountsTotal(){
    //   // return this.accounts.reduce
    // }
  },

  methods: {
    //reset totals, active accounts, compute new totals
    //each time search string change

    updateAccounts(total_to_compute) {
      this.resetTotal();
      this.accounts.forEach(account => {
        this.updateTotals(account);
      });
      this.sortSubsets();
      print(this.partitions);
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
    //compute totals for each subset and partition. called on search text change after resetting previus values
    updateTotals(account) {
      // Aggiornare sempre
      this.total += account.amount;

      if (account.active) {
        // Aggiorno i totali di overview
        this.totalFiltered += account.amount;

        // Aggiorno i totali di tutte le partizioni e subset diversi dal primo ( overview )
        this.partitions.slice(1).forEach(partition => {
          partition.subsets.forEach(subset => {
            if (account.partitions[partition.id] == subset.id) {
              subset.count += 1;
              subset.amountTotal += account.amount;
              subset.referenceAmountTotal += account.refAmount;
            }
          });
        });
      }
    },
    //reset filtered totals
    resetTotal() {
      this.total = 0;
      this.totalFiltered = 0;

      this.partitions.slice(1).forEach(partition => {
        partition.subsets.forEach(subset => {
          subset.count = 0;
          subset.amountTotal = 0;
          subset.referenceAmountTotal = 0;
        });
      });
    },

    sortSubsets() {
      this.partitions.forEach(partition => {
        if (partition.id != "overview") {
          const sortOrder =
            partition.sortOrder == this.criteria["ascending_sort"] ? 1 : -1;

          partition.subsets.sort((subsetA, subsetB) => {
            if (partition.sortCriteria == this.criteria["natural_sort"]) {
              switch (partition.groupFunction) {
                case this.criteria["AccountsCount"]:
                  return sortOrder * (subsetA.count - subsetB.count);
                  break;

                case this.criteria["AccountsSum"]:
                  return (
                    sortOrder * (subsetA.amountTotal - subsetB.amountTotal)
                  );
                  break;

                case this.criteria["TrendAverage"]:
                  let trendA =
                    (subsetA.amountTotal - subsetA.referenceAmountTotal) /
                    subsetA.referenceAmountTotal;
                  let trendB =
                    (subsetB.amountTotal - subsetB.referenceAmountTotal) /
                    subsetB.referenceAmountTotal;
                  // Non posso lascare NaN, altrimenti non ordina
                  trendA = isFinite(trendA) ? trendA : 0;
                  trendB = isFinite(trendB) ? trendB : 0;
                  return sortOrder * (trendA - trendB);
                  break;

                default:
                  return (
                    sortOrder * (subsetA.amountTotal - subsetB.amountTotal)
                  );
                  break;
              }
            } else if (partition.sortCriteria == this.criteria["abs_sort"]) {
              switch (partition.groupFunction) {
                case this.criteria["AccountsCount"]:
                  return sortOrder * (subsetA.count - subsetB.count);
                  break;

                case this.criteria["AccountsSum"]:
                  return (
                    sortOrder *
                    (Math.abs(subsetA.amountTotal) -
                      Math.abs(subsetB.amountTotal))
                  );
                  break;

                case this.criteria["TrendAverage"]:
                  let trendA =
                    (subsetA.amountTotal - subsetA.referenceAmountTotal) /
                    subsetA.referenceAmountTotal;
                  let trendB =
                    (subsetB.amountTotal - subsetB.referenceAmountTotal) /
                    subsetB.referenceAmountTotal;
                  return sortOrder * (Math.abs(trendA) - Math.abs(trendB));
                  break;

                default:
                  return (
                    sortOrder *
                    (Math.abs(subsetA.amountTotal) -
                      Math.abs(subsetB.amountTotal))
                  );
                  break;
              }
            }
          });
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
