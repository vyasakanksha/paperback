<template>
  <div id="app">
    <v-app id="paperback">
      <div>
        <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
            <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                <v-flex xs12 sm6 md4>
                    <v-text-field v-model="items.title" label="Title"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.author" label="Author"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.englishTitle" label="English Title"></v-text-field>
                </v-flex>
                </v-layout>
            </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
        
        <v-data-table :headers="headers" :items="items" class="elevation-1">
        <template v-slot:items.title="{ item }">
        <v-simple-checkbox
          v-model="item.title"
          disabled
        ></v-simple-checkbox>
      </template>
        </v-data-table>
      </div>
    </v-app>
  </div>
</template>

<script>
  import { hindiCollection } from '@/firebase'
  export default {
    data() {
      return {
        dialog: false,

        headers: [ // A column that needs custom formatting
          {value: 'image', text: ''},
          {value: 'title', text: 'Title'},{value: 'author', text: 'Author'}
        ],
        items: [],
        editedIndex: -1,
        editedItem: {
            title: '',
            author: 0,
            englishTitle: 0,
        },
        defaultItem: {
            title: '',
            author: 0,
            englishTitle: 0,
        },
        listPrimitive: null
      }
    },
    async created() {
      const docs = await hindiCollection.get()
      console.log(docs)
      docs.forEach(doc => {
        console.log(doc.data())
        let b = {
          'title': doc.data().name,
          'author': doc.data().author,
          // 'price': doc.data().price,
          // 'image': doc.data().imageURL,
        }
        console.log(b)
        this.items.push(b)
      })
    },
    computed: {
    formTitle() {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
    },

    watch: {
        dialog(val) {
            val || this.close()
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
    height: 100%;
}
</style>
