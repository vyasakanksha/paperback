<template>
  <div>
    <NavBar/>
    <div class="books">
      <HelloWorld/>
      <Collection/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Collection from "@/components/Collection.vue";
import NavBar from "@/components/NavBar.vue";
// import SubNavBar from "@/components/SubNavBar.vue";
import HelloWorld from "@/components/HelloWorld.vue";
import Collection from '../components/Collection.vue';




export default {
  name: "Books",
  components: {
    Collection,
    NavBar,
    // SubNavBar,
    HelloWorld
  }
};
</script>