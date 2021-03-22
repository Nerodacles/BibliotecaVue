<template>
    <div id="demo" :class="[{'collapsed' : collapsed}, {'onmobile' : isOnMobile}]">
    <div class="demo">
        <div class="container pt-5">
            <router-view />
        </div>
		<sidebar-menu
			:menu="menu"
			width ="250px"
			:collapsed="collapsed"
			:theme="selectedTheme"
			:show-one-child="true"
			@toggle-collapse="onToggleCollapse"
		/>
		<div v-if="isOnMobile && !collapsed" class="sidebar-overlay" @click="collapsed = true"/>
		</div>
	</div>
</template>

<script>

const separator = {
	template: `<hr style="border-color: rgba(0, 0, 0, 0.1); margin: 20px;">`
}

export default {
	name: 'sidebar',
	computed: {
        userData(){
            return this.$store.state.userProfile
        },
    },
	data:() => ({
		menu: [
			{
				header: true,
				title: 'Getting Started',
				hiddenOnCollapse: true
			},
			{
				href: '/',
				title: 'Books',
				icon: 'fa fa-code',
			},
			{
				href: '/admin/AddBook',
				title: 'Add Book',
				icon: 'fa fa-code'
			},
			{
				href: '/admin/AdminBooks',
				title: 'Admin Books',
				icon: 'fa fa-cogs'
			},
			{
				href: '/events',
				title: 'Events',
				icon: 'fa fa-bell'
			},
			{
				href: '/page',
				title: 'Dropdown Page',
				icon: 'fa fa-list-ul',
				child: [
					{
						href: '/page/sub-page-1',
						title: 'Sub Page 01',
						icon: 'fa fa-file-alt'
					},
					{
						href: '/page/sub-page-2',
						title: 'Sub Page 02',
						icon: 'fa fa-file-alt'
					}
				]
			},
			{
				title: 'Multiple Level',
				icon: 'fa fa-list-alt',
				child: [
					{
						title: 'page'
					},
					{
						title: 'Level 2 ',
						child: [
							{
								title: 'page'
							},
							{
								title: 'Page'
							}
						]
					},
					{
						title: 'Page'
					},
					{
						title: 'Another Level 2',
						child: [
							{
								title: 'Level 3',
								child: [
									{
									title: 'Page'
								},
								{
									title: 'Page'
								}
								]
							}
						]
					}
				]
			}
		],
		collapsed: false,
		selectedTheme: 'default-theme',
		isOnMobile: false
    }),
	mounted () {
		this.onResize()
		window.addEventListener('resize', this.onResize)
	},
	methods: {
		onToggleCollapse (collapsed) {
			console.log(collapsed)
			this.collapsed = collapsed
		},
		onResize () {
			if (window.innerWidth <= 767) {
				this.isOnMobile = true
				this.collapsed = true
			} else {
				this.isOnMobile = false
				this.collapsed = false
			}
		}
	}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600');
.v-sidebar-menu{
	margin-top: 56px;
}

body,
html {
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 18px;
  background-color: #f2f4f7;
  color: #262626;
}

#demo {
  padding-left: 250px;
  transition: 0.3s ease;
}
#demo.collapsed {
  padding-left: 50px;
}
#demo.onmobile {
  padding-left: 50px;
}

.sidebar-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #000;
  opacity: 0.5;
  z-index: 900;
}

.demo {
	padding: 0px;
}

pre {
  font-family: Consolas, monospace;
  color: #000;
  background: #fff;
  border-radius: 2px;
  padding: 15px;
  line-height: 1.5;
  overflow: auto;
}
</style>