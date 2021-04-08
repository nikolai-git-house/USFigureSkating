<template>
	<div class="tabs">
		<div class="tabs__triggers" :class="triggers_classes">
			<ul class="tabs__list">
				<li v-for="(tab,index) in tabs" class="tabs__item">
					<a :class="{active:tab.is_active}" class="tabs__trigger" @click.prevent="setActive(index)" href="#" v-html="triggerContent(tab)">
					</a>
				</li>
			</ul>
		</div>
		<slot></slot>
	</div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import TabContract from './Tab.vue';

    export interface TabsContract extends Vue {
        setActive(id: number): void
    }
    const Component = Vue.extend({
        props: {
            triggers_classes: {
                type: Array as () => string[],
                default: function(){
                    return [];
                }
            }
        },
        data: function () {
            return {
                active_tab: null,
                tabs: []
            }
        },
        methods: {
            triggerContent: function (tab: TabContract) {
                if (tab.trigger_template) {
                    return tab.trigger_template;
                }
                return tab.name;
            },
            setActive: function (selected_index: number): void {
                this.tabs.forEach((tab: TabContract, i) => {

                    let is_active = i == selected_index;
                    tab.setIsActive(is_active);
                    if (is_active) {
                        this.$emit('tab-activated', tab);
                    }
                });
            },
        },
        created: function () {
            this.$data.tabs = this.$children;
        }

    });
    export default Component;
</script>