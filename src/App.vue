<template>
  <v-app>
    <!-- TOOLBAR -->
    <v-app-bar app light>
		<!-- NAVIGATION MENU -->
		<v-menu>
			<template v-slot:activator="{ on: menu }">
				<v-icon v-on="{ ...menu }">fas fa-list</v-icon>
			</template>
			<v-list >
				<v-list-item-group v-model="item" color="primary">
				<v-list-item v-for="(item, i) in items" :key="i" >
					<v-list-item-icon>
					<v-icon v-text="item.icon"></v-icon>
					</v-list-item-icon>
					<v-list-item-content>
					<v-list-item-title v-text="item.text"></v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				</v-list-item-group>
      		</v-list>
      	</v-menu>
		<!--TITLE-->
		<v-toolbar-title class="headline text-uppercase"><span>title</span></v-toolbar-title>
		<!--SPACER-->
		<v-spacer></v-spacer>
		<!-- SOCIAL -->
		<v-dialog v-model="dialog" width="500" >
			<template v-slot:activator="{ on }">
				<v-icon v-on="on">fas fa-share-alt</v-icon>
			</template>

			<v-card>
				<v-card-title class="headline grey lighten-2" primary-title>
					Condividi
				</v-card-title>
				<v-card-text>
					social buttons will appare here
				</v-card-text>
			</v-card>
      	</v-dialog>
		<!-- OPTION -->
		<v-menu>
			<template v-slot:activator="{ on: menu }">
				<v-icon v-on="{ ...menu }">fas fa-list</v-icon>
			</template>
			<v-list >
				<v-list-item-group v-model="item" color="primary">
				<v-list-item v-for="(item, i) in items" :key="i" >
					<v-list-item-icon>
					<v-icon v-text="item.icon"></v-icon>
					</v-list-item-icon>
					<v-list-item-content>
					<v-list-item-title v-text="item.text"></v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				</v-list-item-group>
      		</v-list>
      	</v-menu>
    </v-app-bar>
    <!-- CONTENT -->
    <v-content>
      <router-view />
    </v-content>
    <!-- FOOTER -->
  </v-app>
</template>

<script>
import {bgoStore, fetcher, ns} from "bgo.js"
export default {
  name: "App",
  components: {},

  data: () => ({
    //Tutte le variabili da inserire nel template saranno messe qui
  }),
  mounted(){
	  fatchData();
  }
};
function fatchData(){
	dgoS
}
</script>
