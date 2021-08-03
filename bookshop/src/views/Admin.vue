<template>
  <v-app>
    <NavBar/>
    <v-main>
      <Collection/>
    </v-main>
  </v-app>
</template>

<script>
// @ is an alias to /src
import Collection from "@/components/Collection.vue";
import NavBar from "@/components/NavBar.vue";
// import SubNavBar from "@/components/SubNavBar.vue";



export default {
  name: "Books",
  components: {
    Collection,
    NavBar,
    // SubNavBar
  }
};
</script>