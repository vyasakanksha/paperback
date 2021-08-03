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
              <v-img width="200" :src="editedItem.image"></v-img>
              </v-flex>
                <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
                    <v-text-field v-model="editedItem.author" label="Author"></v-text-field>
                    <v-text-field v-model="editedItem.englishTitle" label="English Title"></v-text-field>

                    
                </v-flex>
                </v-layout>
            </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click.native="save">Save</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
        
        <template>
          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1"
          >

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                arrow_downward
              </v-icon>
              
              <v-icon
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </template>
      </div>
    </v-app>
  </div>
</template>

<script>
  import { hindiCollection } from '@/firebase'
  import ZoomOnHover from "vue-zoom-on-hover";
  Vue.use(ZoomOnHover);

  export default {
    data() {
      return {
        dialog: false,

        headers: [ // A column that needs custom formatting
          {value: 'title', text: 'Title' , sortable: false },{value: 'author', text: 'Author' , sortable: false }, { text: 'Actions', value: 'actions', sortable: false},
        ],
        items: [],
        editedIndex: -1,
        editedItem: {
            title: '',
            author: 0,
            englishTitle: 0,
            imageURL: ''
        },
        defaultItem: {
            title: '',
            author: 0,
            englishTitle: 0,
        },
        listPrimitive: null,
        name: "Collection"  
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
          'image': doc.data().imageURL,
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
    methods: {
      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.items[this.editedIndex], this.editedItem)
        } else {
          this.items.push(this.editedItem)
        }
        this.close()
      },
    }
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
