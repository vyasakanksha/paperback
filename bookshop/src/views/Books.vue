<template>
  <div>
    <NavBar/>
    <div>
      <SubNavBar/>
    </div>
    <div class="books">
      <Collection/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Collection from "@/components/Collection.vue";
import NavBar from "@/components/NavBar.vue";
import SubNavBar from "@/components/SubNavBar.vue";



export default {
  name: "Books",
  components: {
    Collection,
    NavBar,
    SubNavBar
  }
};
</script>