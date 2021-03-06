
<template>
    <div>
        <div class="content">Administrate Books</div>
        <div>
            <b-container fluid>
                <!-- User Interface controls -->
                <b-row>
                    <b-col lg="6" class="my-1">
                        <b-form-group label="Sort" label-for="sort-by-select" label-cols-sm="3" label-align-sm="right" label-size="sm" class="mb-0" v-slot="{ ariaDescribedby }">
                            <b-input-group size="sm">
                                <b-form-select id="sort-by-select" v-model="sortBy" :options="sortOptions" :aria-describedby="ariaDescribedby" class="w-75">
                                    <template #first>
                                        <option value="">-- none --</option>
                                    </template>
                                </b-form-select>
                                <b-form-select v-model="sortDesc" :disabled="!sortBy" :aria-describedby="ariaDescribedby" size="sm" class="w-25">
                                    <option :value="false">Asc</option>
                                    <option :value="true">Desc</option>
                                </b-form-select>
                            </b-input-group>
                        </b-form-group>
                    </b-col>

                    <b-col lg="6" class="my-1">
                        <b-form-group label="Initial sort" label-for="initial-sort-select" label-cols-sm="3" label-align-sm="right" label-size="sm" class="mb-0">
                            <b-form-select id="initial-sort-select" v-model="sortDirection" :options="['asc', 'desc', 'last']" size="sm"></b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col lg="6" class="my-1">
                        <b-form-group label="Filter" label-for="filter-input" label-cols-sm="3" label-align-sm="right" label-size="sm" class="mb-0">
                            <b-input-group size="sm">
                                <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Type to Search"></b-form-input>
                                <b-input-group-append>
                                    <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>
                    </b-col>

                    <b-col lg="6" class="my-1">
                        <b-form-group
                            v-model="sortDirection"
                            label="Filter On"
                            description="Leave all unchecked to filter on all data"
                            label-cols-sm="3"
                            label-align-sm="right"
                            label-size="sm"
                            class="mb-0"
                            v-slot="{ ariaDescribedby }">

                        <b-form-checkbox-group v-model="filterOn" :aria-describedby="ariaDescribedby" class="mt-1">
                            <b-form-checkbox value="author">Author</b-form-checkbox>
                            <b-form-checkbox value="book">Book</b-form-checkbox>
                            <b-form-checkbox value="isActive">Active</b-form-checkbox>
                            </b-form-checkbox-group>
                        </b-form-group>
                    </b-col>

                    <b-col sm="5" md="6" class="my-1">
                        <b-form-group label="Per page" label-for="per-page-select" label-cols-sm="6" label-cols-md="4" label-cols-lg="3" label-align-sm="right" label-size="sm" class="mb-0">
                            <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm"></b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col sm="7" md="6" class="my-1">
                        <b-pagination v-model="currentPage" :total-rows="this.totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
                    </b-col>
                </b-row>

                <!-- Main table element -->
                <b-table
                    :busy="isBusy"
                    :items="AllBooks"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection"
                    stacked="md"
                    show-empty
                    small
                    @filtered="onFiltered" bordered borderless outlined dark head-variant="dark" table-variant="secondary">

                    <template #table-busy>
                        <div class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Loading...</strong>
                        </div>
                    </template>
                    
                    <template #cell(name)="row">
                        {{ row.value.first }} {{ row.value.last }}
                    </template>

                    <template #cell(bookID)="row">
                        <a :href="'/book/'+row.item.bookID" class="text-light">{{row.item.bookName}}</a>
                    </template>

                    <template #cell(isActive)="row">
                        <b-button v-on:click="disableBook(row.item)"><ToggleButton :id="row.item.id" :default-state="row.item.isActive"/></b-button>
                    </template>

                    <template #cell(actions)="row">
                        <b-button @click="info(row.item, row.index, $event.target)" title="Details" class="fas fa-edit mr-1 btn btn-dark fas fa-info text-white"><i class="fas fa-info-circle"></i></b-button>
                        <!-- <b-button @click="row.toggleDetails" class="mr-1 btn-dark">{{ row.detailsShowing ? 'Hide' : 'Show' }} Details</b-button> -->
                        <!-- <b-button class="mr-1 far fa-trash-alt btn btn-dark" title="Delete Book" v-on:click="removeBook(row.item)"></b-button> -->
                        <b-button class="fas fa-edit btn btn-dark" title="Edit Book" v-on:click="updateBook(row.item)"></b-button>
                    </template>

                    <template #row-details="row">
                        <b-card>
                            <ul>
                                <li v-for="(value, key) in row.item" :key="key" class="text-dark">{{ key }}: {{ value }}</li>
                            </ul>
                        </b-card>
                    </template>
                </b-table>

                <!-- Info modal -->
                <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
                    <pre>{{ infoModal.content }}</pre>
                </b-modal>
            </b-container>
        </div>
    </div>
</template>

<script>
import { booksCollection } from '../../../firebase'
import ToggleButton from '@/components/ToggleButton.vue'
import Swal from 'sweetalert2'

export default {
    components: {ToggleButton},
    computed: {
        userUID(){
            return this.$store.state.userUID
        },
        sortOptions() {
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        },
    },
    mounted () {
		this.onResize()
		window.addEventListener('resize', this.onResize)
	},
    created() {
		booksCollection.onSnapshot(snap=> {
            this.AllBooks = []
            snap.forEach(book=> {
                var bookData = book.data()
                bookData.id = book.id
                this.AllBooks.push(bookData)
                this.totalRows = this.AllBooks.length
                this.isBusy = false
            })
        })
	},

    data:() => ({
        isBusy: true,
        AllBooks: [],
        sortBy: '',
        sortDesc: false,
        onMobile: false,
        fields: [
            {key:'title', sortable: true, label: 'Title'},
            {key: 'author', sortable: true, label: 'Author'},
            {key: 'isActive', label: 'Status', formatter: (value, key, item) => { return value ? 'Yes' : 'No' }, sortable: true, sortByFormatted: true, filterByFormatted: true },
            {key: 'actions'},
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
        infoModal: {
            id: 'info-modal',
            title: '',
            content: ''
        },
    }),
    methods: {
        removeBook(book) {
            this.$store.dispatch('bookActions',{ action: 'delete', id: book })
        },
        updateBook(book){
            if(book.user == this.$store.state.userUID || this.$store.state.userUID == 'sMRFpB1X1tMWFWfpcddok0K5Qav1') { this.$router.push('/admin/editBook/'+ book.id) }
            else{ Swal.fire({ position: 'top-end', icon: 'error', title: 'Insufficient Permissions!', showConfirmButton: false, timer: 5000 }) }
            
        },
        disableBook(book){
            this.$store.dispatch('bookActions',{ action: 'disable', id: book.id, isActive: !book.isActive })
        },
        onResize() {
			if (window.innerWidth <= 767) {
				this.onMobile = true
			} else {
				this.onMobile = false
			}
		},
        info(item, index, button) {
            this.infoModal.title = `Row index: ${index}`
            this.infoModal.content = JSON.stringify(item, null, 2)
            this.$root.$emit('bv::show::modal', this.infoModal.id, button)
        },
        resetInfoModal() {
            this.infoModal.title = ''
            this.infoModal.content = ''
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
    },
    metaInfo() {
        return {
            title: "Administrate Books",
        }
    },
}
</script>

<style lang="css" scoped>
    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        font-size: 50px;
        color: rgb(46, 46, 46);
        font-weight: 600;
    }
</style>