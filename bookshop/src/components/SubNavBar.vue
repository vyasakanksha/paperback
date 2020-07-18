<template>
  <div>
    <button type="button" class="btn btn-outline-primary">Hindi</button>
    <button type="button" class="btn btn-outline-info">Second-Hand</button>

    <b-nav-form>
      <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
      <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
    </b-nav-form>
  </div>
</template>

<script>
  export default {
    name: "SubNavBar"
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

button {
  margin: 5px;
}

</style>
