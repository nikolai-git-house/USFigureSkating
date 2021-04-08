<script lang="ts">
	import Vue from "vue";
	import {UserRole} from "../contracts/AppContracts";

	export default Vue.extend({
		data: function () {
			return {
				menu_open: false
			}
		},
		methods: {
			toggleNav: function (): void {
				this.menu_open = !this.menu_open;
			}
		},
		watch: {
			menu_open: function (val): void {
				let bodyEl = document.querySelector('html');
				if (bodyEl) {
					if (val) {
						bodyEl.classList.add('nav-active');
						return;
					}
					bodyEl.classList.remove('nav-active');
				}
			}
		},
		computed: {
			user_roles: function (): UserRole {
				return this.$store.getters['user/user_roles'];
			},
			is_skater: function (): boolean {
				return this.user_roles.indexOf("skater") !== -1;
			},
			is_coach: function (): boolean {
				return this.user_roles.indexOf("coach") !== -1;
			},
			show_cart_status: function () {
				return this.$store.state.app.show_cart_status;
			},
			hide_menu: function () {
				return this.$store.state.app.checkout_active;
			},
			hide_nav_border: function () {
				return this.$store.state.app.show_nav_border === false;
			}
		}
	});
</script>