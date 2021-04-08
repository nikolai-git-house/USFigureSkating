<script lang="ts">
    import Vue from "vue";
    import {default as PPCElementComponent, PPCElementComponentContract} from "./PPCElement.vue";
    import {PPCElement} from "../../models/PPC/PPCElement";
    import {PPCOptionFetchParams} from "../../contracts/app/PPCContracts";
    import {ReorderDirection} from "../../contracts/AppContracts";
    import {Competition} from "../../models/Competition/Competition";
    import {PPC} from "../../models/PPC/PPC";
    import {SkaterSkatingEventSegment} from "../../models/SkaterSkatingEventSegment";
    import {PPCFetchArgs} from "../../contracts/app/PPCContracts";
    import {PPCSavePayload, PPCSaveResponse} from "../../contracts/app/PPCContracts";


    export interface PPCEditorComponent extends Vue {
        savePPC: Function;
        unsaved_changes: boolean;
    }


    type PPCEditorData = {
        reorder_active: boolean,
        save_error: boolean,
        notice: string,
        active_editor_element_id: number,
        data_loaded: boolean,
        loading_timeout: boolean,
        load_error: boolean,
        add_active: boolean,
        cached_element_order: number[],
        ppc: PPC
    }
    export default Vue.extend({
        props: {
            event_segment: {
                type: SkaterSkatingEventSegment,
                required: true
            },
            competition_id: {
                type: Number,
                required: true
            },
            is_view_only: {
                type: Boolean,
                required: true
            }
        },
        data: function (): PPCEditorData {
            return {
                reorder_active: false,
                save_error: false,
                notice: "Loading...",
                active_editor_element_id: -1,
                data_loaded: false,
                loading_timeout: false,
                load_error: false,
                add_active: false,
                cached_element_order: [],
                ppc: new PPC()
            }
        },
        created: function () {
            this.initLoadingTimeout();
            this.fetchPPCData();
            this.fetchFormOptions();
        },
        destroyed: function () {
            this.$store.commit('ppc/clearActivePPC');
        },
        computed: {
            /**
             * Whether to show the informational notice about loading or that a load error occurred
             */
            show_notice: function () {
                if (!this.data_loaded) {
                    return this.loading_timeout;
                }
                return this.load_error;
            },
            /**
             * Whether to hide the reorder controls
             */
            reorder_hidden: function (): boolean {
                return this.add_active || this.ppc.elements.length < 2 || this.is_view_only;
            },
            /**
             * Whether the reorder controls should display as disabled
             */
            reorder_disabled: function (): boolean {
                return this.editor_active
            },
            /**
             * Whether the confirm (complete) button should be hidden
             */
            confirm_hidden: function (): boolean {
                return this.add_active || this.ppc.elements.length === 0;
            },
            /**
             * Whether the conform (complete) button should be disabled
             */
            confirm_disabled: function (): boolean {
                return this.editor_active;
            },
            /**
             * Whether an editor for any of the cards is active
             */
            editor_active: function (): boolean {
                return this.active_editor_element_id !== -1;
            },
            /**
             * The wording next to the reorder control
             */
            reorder_toggle_label: function (): string {
                if (this.reorder_active) {
                    return "Toggle off to edit elements";
                }
                return "Toggle on to reorder elements";
            },
            /**
             * Whether the add element button is disabled
             */
            add_element_disabled: function (): boolean {
                return this.editor_active || this.reorder_active;
            },
            /**
             * Whether the restore order button should be disabled
             */
            restore_disabled: function () {
                return !this.orderChanged();
            },
            unsaved_changes: function () {
                return this.$store.getters['ppc/ppc_changed'](this.ppc) || this.editor_active;
            },
            /**
             * Whether to show the add element button
             */
            show_add_element: function (): boolean {
                return !this.add_active && !this.is_view_only;
            },
            /**
             * Text content of submit button
             */
            confirm_button_text: function (): string {
                return this.is_view_only ? "Exit" : "Confirm PPC";
            },
            /**
             * Action taken by confirm button
             */
            confirm_button_action: function (): Function {
                if (this.is_view_only) {
                    return this.exit;
                }
                return this.savePPC;
            },
            deadline_passed_message: function (): string {
                if (!this.is_view_only) {
                    return "";
                }
                if (this.ppc.length) {
                    return "The PPC deadline has passed. Please contact the LOC to make any changes."
                }
                return "The PPC deadline has passed. Please contact the LOC to add program content."
            }
        },
        methods: {
            /**
             * Set variable after a timeout to ensure "loading" doesn't display if the page loads quickly
             */
            initLoadingTimeout: function () {
                let vm = this;
                setTimeout(function () {
                    vm.loading_timeout = true;
                }, 200);
            },
            /**
             * Fetch the editor form options
             */
            fetchFormOptions: function (): void {
                let fetch_params: PPCOptionFetchParams = {
                    event_id: this.event_segment.event_id,
                    event_segment_id: this.event_segment.segment_id,
                    competition_id: this.competition_id,
                    competition_skated_event_id: this.event_segment.competition_skated_event_id
                };
                this.$store.dispatch('ppc/fetchPPCElementOptions', fetch_params).catch(function () {
                    //error displayed in form interface
                });
            },
            /**
             * Fetch the PPC data for the active event segment
             */
            fetchPPCData: function (): void {
                let vm = this;
                let fetch_args: PPCFetchArgs = {
                    competition_id: this.competition_id,
                    event_id: this.event_segment.event_id,
                    event_segment_id: this.event_segment.segment_id,
                    competition_skated_event_id: this.event_segment.competition_skated_event_id
                };
                this.$store.dispatch('ppc/fetchPPC', fetch_args).then(function () {
                    vm.data_loaded = true;
                    vm.ppc = vm.$store.getters['ppc/active_ppc'].clone();
                }).catch(function () {
                    vm.load_error = true;
                    vm.notice = "Error loading PPC.";
                });
            },
            /**
             * Respond to an element editor toggle event.  Based on the editor state, update local properties
             */
            setEditActive: function (set_active: boolean = true, element_id: number) {
                this.add_active = false;
                this.active_editor_element_id = set_active ? element_id : -1;
                this.collapseChildren();
            },
            /**
             * Respond to user clicking the add element button
             */
            addElement: function () {
                this.add_active = true;
                this.reorder_active = false;
                let new_element_id = this.ppc.addElement();
                this.active_editor_element_id = new_element_id;
            },
            /**
             * Respond to user clicking the delete button on an element
             */
            handleDelete: function (element_index: number) {
                this.ppc.removeElement(element_index);
            },
            /**
             * Respond to user reordering and element
             */
            handleReorder: function (direction: ReorderDirection, index: number) {
                this.ppc.reorderElement(direction, index);
            },
            /**
             * Handle the add form cancel event
             * @optimize: we could trigger a re-indexing of the ppc ids here, but that would be merely for aesthetics
             */
            handleCancel: function (index: number) {
                this.add_active = false;
                this.active_editor_element_id = -1;
                this.ppc.removeElement(index);
            },
            /**
             * Get the Save PPC payload from local state
             */
            getSavePayload: function (): PPCSavePayload {
                return {
                    ppc: this.ppc,
                    competition_id: this.competition_id,
                    event_id: this.event_segment.event_id,
                    segment_id: this.event_segment.segment_id,
                    competition_skated_event_id: this.event_segment.competition_skated_event_id
                };
            },
            /**
             * Perform the save operation
             */
            performPPCSave: function (): Promise<void> {
                let vm = this;
                let save_payload = this.getSavePayload();
                return new Promise(function (resolve, reject) {
                    vm.$store.dispatch('ppc/savePPC', save_payload).then(function (response: PPCSaveResponse) {
                        vm.$emit('ppc-complete', response);
                    }).catch(function () {
                        reject();
                    });
                });
            },
            /**
             * Save wrapper
             * When called externally, run and return save promise
             *
             * When called internally, run save process and handle exception case
             */
            savePPC: function (update_local: boolean = true): Promise<void> | void {
                if (!update_local) {
                    return this.performPPCSave();
                }
                let vm = this;
                vm.performPPCSave().catch(function () {
                    vm.save_error = true;
                    setTimeout(function () {
                        vm.save_error = false;
                    }, 2000);
                });
            },
            /**
             * Show all elements, unless adding is active, in which case only show the element being added
             */
            showElement: function (element_index: number): boolean {
                if (!this.add_active) {
                    return true;
                }
                return element_index === this.ppc.length - 1;
            },
            /**
             * Whether a certain element should behave as disabled
             */
            elementIsDisabled: function (element_id: number) {
                return this.editor_active && this.active_editor_element_id !== element_id;
            },
            /**
             * Collapse the details expansion on all child elements
             */
            collapseChildren: function () {
                (this.$refs.element_items as PPCElementComponentContract[]).forEach(function (child: PPCElementComponentContract) {
                    child.toggleDetails(false);
                });
            },
            restoreCachedOrder: function () {
                this.ppc.orderElements(this.cached_element_order);
            },
            /**
             * Whether the order of cards has changed since reorder mode was activated
             */
            orderChanged: function (): boolean {
                if (!this.cached_element_order.length) {
                    return false;
                }
                for (let i = 0; i < this.ppc.elements.length; i++) {
                    let ppc_element = this.ppc.elements[i];
                    if (this.cached_element_order[i] !== ppc_element.id) {
                        return true;
                    }
                }
                return false;
            },
            /**
             * Handle exit button click
             */
            exit: function (): void {
                this.$emit('close-ppc');
            }
        },
        components: {
            'ppc-element': PPCElementComponent
        },
        watch: {
            reorder_active: function (is_active: boolean) {
                this.collapseChildren();
                if (is_active) {
                    this.cached_element_order = this.ppc.elements.map(function (element: PPCElement) {
                        return element.id;
                    });
                }
                else {
                    this.cached_element_order = [];
                }

            }
        }
    });
</script>
