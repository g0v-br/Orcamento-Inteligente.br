<template>
    <div class="container">
        <div class="g0v-table-container">
            <v-card>
              <v-card-title>
                {{title}} : {{totals}}
                <v-spacer></v-spacer>
                <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
            :headers="headers"
            :items="accounts"
            :search="search"
            :pagination.sync="pagination"
            :footer-props.items-per-page-text=25
            :footer-props.items-per-page-options="[25,50,100,{text:'Tutti',value:-1}]"
            class="elevation-1"

            ></v-data-table>
        </v-card>
    </div>
</div>

</template>


<script>
    import { bgoStore, fetcher, ns } from "@/models/bgo.js";
    export default {
        name: "Table",
        data() {
            return {
                title: "ekko",
                accounts: [],
                pagination: {
                    sortBy: "amount",
                    descending: true
                },
                search: ""
            };
        },
        created() {
            fetchData(this);
            //this.search = this.$route.query.s || "";
        },
        computed : {
            totals(){
                return 1000000;
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

    function fetchData(app) {
        app.title = "totale visualizzato";
        
        let accounts = bgoStore.each(undefined, ns.rdf('type'), ns.bgo('Account'));
        accounts.forEach(account => {
            app.accounts.push({
                title: bgoStore.anyValue(account, ns.bgo('title')),
                amount: bgoStore.anyValue(account, ns.bgo('amount')),
                rate: bgoStore.anyValue(account, ns.bgo('referenceAmount')),
                partitionLabel: "TODO",
            });
        })

        //app.accounts.push({ title: "title", amount: "title", rate:27 ,partitionLabel: "Ekkleee"});
    }

</script>



<!-- CSS -->
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







<!-- 


<template>
    <div class="container">
        <div class="g0v-table-container">
            <VCard>
                <VCardTitle>
                    <h2 class="title">
                        {{title}}: {{totals}}
                    </h2>
                    <v-spacer></v-spacer>
                    <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                    ></v-text-field>
                </VCardTitle>
                <VDataTable
                :headers="headers"
                :items="Accounts"

                :pagination.sync="pagination"
                :footer-props.items-per-page-text=25
                :footer-props.items-per-page-options="[25,50,100,{text:'Tutti',value:-1}]"
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
</template> -->