<template>
  <div>
    <b-table responsive sticky-header class="table align-middle"
      :striped="striped"
      :bordered="bordered"
      :borderless="borderless"
      :outlined="outlined"
      :small="small"
      :hover="hover"
      :dark="dark"
      :fixed="fixed"
      :foot-clone="footClone"
      :no-border-collapse="noCollapse"
      :items="items"
      :fields="fields"
      :head-variant="headVariant"
      :table-variant="tableVariant"
    >
      <template v-slot:cell(image)="data">
        <img :src="`${data.item.image}`" class="img-thumbnail img-fluid" alt="Responsive image" width="100" height="160">
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fields: [ // A column that needs custom formatting
          {key: 'image', label: ''},
          'name', 'author', 'price'],
        items: [
          { name: "Mrs Warren's Profession", author: 'Shaw', price: 399, image: 'https://s3.amazonaws.com/kimicoapps-bookbuddy/CB3AEBFE-771D-4A63-B30C-E6B2C028857C'},
          { name: "Cats", author: 'Larsen', price: 599 },
          { name: "100 Years of Solitude", author: 'Gabriel García Márquez', price: 200 }
        ],
        tableVariants: [
          'primary',
          'secondary',
          'info',
          'danger',
          'warning',
          'success',
          'light',
          'dark'
        ],
        striped: true,
        bordered: false,
        borderless: true,
        outlined: false,
        small: false,
        hover: true,
        dark: false,
        fixed: false,
        footClone: false,
        headVariant: null,
        tableVariant: '',
        noCollapse: false
      }
    },
    name: "Collection"
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

.table {
    text-align: center;
    vertical-align: middle;
    padding: 12px;
    border: 1px red dotted;
}
</style>
