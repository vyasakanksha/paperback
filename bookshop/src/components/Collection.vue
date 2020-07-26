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
  import { inStockCollection} from '@/firebase'
  export default {
    data() {
      return {
        fields: [ // A column that needs custom formatting
          {key: 'image', label: ''},
          'title', 'author', 'price'],
        items: [],
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
    async created() {
      console.log("this", this.val)
      const docs = await inStockCollection.get()
      docs.forEach(doc => {
        let b = {
          'title': doc.data().book.title,
          'author': doc.data().book.author ? doc.data().book.author[0] : "",
          'price': doc.data().book.price,
          'image': "",
        }
        console.log(b)
        this.items.push(b)
      })
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
    height: 100%;
}
</style>
