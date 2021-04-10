<template>
    <div>
        <div class="content">Administrate Users</div>
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
                            <b-form-checkbox value="username">Name</b-form-checkbox>
                            <b-form-checkbox value="bookTitle">Book</b-form-checkbox>
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
                    :items="users"
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

                    <template #cell(title)="row">
                        {{ row.item.title.init }}
                    </template>

                    <template #cell(isActive)="row">
                        <b-button v-on:click="disableUser(row.item)"><ToggleButton :id="row.item.id" :default-state="row.item.isActive" /></b-button>
                    </template>

                    <template #cell(isAdmin)="row">
                        <b-button v-on:click="upgradeUser(row.item)"><ToggleButton :id="row.item.createdAt" :default-state="row.item.isAdmin" /></b-button>
                    </template>

                    <template #cell(actions)="row">
                        <b-button @click="info(row.item, row.index, $event.target)" title="Details" class="fas fa-edit mr-1 btn btn-dark fas fa-info text-white"><i class="fas fa-info-circle"></i></b-button>
                        <!-- <b-button @click="row.toggleDetails" class="mr-1 btn-dark">{{ row.detailsShowing ? 'Hide' : 'Show' }} Details</b-button> -->
                        <b-button class="mr-1 far fa-trash-alt btn btn-dark" title="Delete User" v-on:click="deleteUser(row.item)"></b-button>
                        <!-- <b-button class="fas fa-edit btn btn-dark" title="Edit Comment" v-on:click="updateComment(row.item)"></b-button> -->
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
import { booksCollection, commentsCollections, likedBookCollections, usersCollection, db } from '../../../firebase'
import ToggleButton from '@/components/ToggleButton.vue'

export default {
    components: {ToggleButton},
    computed: {
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
        usersCollection.onSnapshot(snap =>{
            this.users = []
            snap.forEach(user =>{
                var userData = user.data()
                userData.id = user.id
                this.users.push(userData)
            })
        })
	},

    data:() => ({
        sortBy: '',
        sortDesc: false,
        onMobile: false,
        users: [],
        fields: [
            {key:'name', label: 'User', sortable: true},
            {key:'title', label: 'University', sortable: true},
            {key: 'isActive', label: 'Status', formatter: (value, key, item) => { return value ? 'Yes' : 'No' }, sortable: true, sortByFormatted: true, filterByFormatted: true },
            {key: 'isAdmin', label: 'Administrator', formatter: (value, key, item) => { return value ? 'Yes' : 'No' }, sortable: true, sortByFormatted: true, filterByFormatted: true },
            {key: 'actions'},
            
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
        infoModal: { id: 'info-modal', title: '', content: '' }
    }),
    methods: {
        disableUser(user){
            this.$store.dispatch('userActions',{action: 'disable', id: user.id, isActive: !user.isActive})
        },
        upgradeUser(user){
            this.$store.dispatch('userActions',{action: 'updateLVL', id: user.id, isAdmin: !user.isAdmin})
        },
        onResize () {
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