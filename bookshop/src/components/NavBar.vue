<template>
  <v-app-bar app dark class="indigo">
    <v-toolbar-title class="headline text-uppercase">
      <span>Paperback Bookshop &nbsp;</span>
      <span class="font-weight-light">ADMIN</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      text
      href="#"
      target="_blank"
    >
      <span class="mr-2">Home</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
  export default {
    name: "NavBar"
    // props: {
    //   msg: String
    // }
  };  
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

</style>
