<template>
    <div class="container">
        <div class="g0v-table-container">
            <VCard>
                <VcardTitle>
                    <h2 class="title">
                        Totale visualizzato: {{totals}}
                    </h2>
                    <VSpacer />
                    <VSpacer />
                    <VTextField
                    v-model="search" append-icon="search"
                    :label="Cerca" single-line
                    hide-details
                    />
                </VcardTitle>
                <VDataTable
                :headers="headers"
                :items="filteredAccounts"

                :pagination.sync="pagination"
                :rows-per-page-text=25
                :rows-per-page-items="[25,50,100,{text:'Tutti',value:-1}]"
                class="elevation-1"
                >
                <template slot="headers" slot-scope="props">
                    <tr>
                        <th
                        style="text-align: left;"
                        v-for="header in props.headers"
                        :key="header.text"
                        :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                        @click="changeSort(header.value)">
                        {{ header.text }}
                        <VIcon small> arrow_upward</VIcon>
                        </th>
                    </tr>

                </template>

                <template slot="items" slot-scope="props">
                <td class="account-name" width="35%" style="font-weight: 500;">
                  {{ props.item.title }} 
                </td>
                <td class="account-amount" width="10%">
                  {{props.item.amount}}
                </td>
                <td class="account-amount" width="10%">
                  {{props.item.rate}}
                </td>
                <td class="account-top" width="15%">
                  {{ props.item.partitionLabel}}
                </td>
          </template>
        </VDataTable>
    </VCard>
</div>
</div>
</template>

<script>
    import { bgoStore, fetcher, ns } from "@/models/bgo.js";
    export default {
        name: "Table",
        data() {
            return {
                qualcosa: "ekkle",
                pagination: {
                    sortBy: "amount",
                    descending: true
                },
                search: ""
            };
        },
        computed : {
            totals(){
                return 1000000;
            },
            filteredAccounts(){
                return [ 
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                { title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"},
                ];
            },
            headers() {
                return [
                { text: "title", value: "title" },
                { text: "amount", value: "amount" },
                { text: "rate", value: "rate" },
                { text: "partitionLabel", value: "partitionLabel" }
                ];
            }
        }
    }

</script>



//CSS
<style scoped>
.g0v-table-container {
  background-color: #aaaaaa;
}
.g0v-title {
  font-weight: 400;
  margin-bottom: 0.5em;
}
td::first-letter {
  text-transform: uppercase;
}
.download-csv {
  margin-left: 1rem;
}
/* .account-second {
  width: auto;
  } */
</style>