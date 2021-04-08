<template>
    <div class="entity-check-in-events-music-ppc-status">
        <div class="entity-check-in-events-music-ppc-status__item" :class="'entity-check-in-events-music-ppc-status__item--' + (isMusicComplete(segment) ? 'complete' : 'incomplete')">
            <div v-if="segment.music_status.completed" class="entity-check-in-events-music-ppc-status__item__display">
                <button class="entity-check-in-events-music-ppc-status__item__trigger"
                        :class="'entity-check-in-events-music-ppc-status__item__trigger--'+(music_expanded ? 'close' : 'open')"
                        v-on:click.prevent="music_expanded = !music_expanded">
                    <span class="entity-check-in-events-music-ppc-status__item__label">
                        Music
                    </span>
                </button>
                <div v-if="music_expanded" class="entity-check-in-events-music-ppc-status__item__content entity-check-in-events-music-ppc-status__item__content--music">
                    <music-item class="music-item--standalone" :music="segment.music"></music-item>
                </div>
            </div>
            <div v-else-if="!segment.music_required" class="entity-check-in-events-music-ppc-status__item__notice">
                <div class="entity-check-in-events-music-ppc-status__item__label">
                    Music
                    <span class="entity-check-in-events-music-ppc-status__item__label__notice">Event segment does not require Music</span>
                </div>
            </div>
            <div v-else class="entity-check-in-events-music-ppc-status__item__override">
                <div class="entity-check-in-events-music-ppc-status__item__override__row">
                    <span class="entity-check-in-events-music-ppc-status__item__label">
                        Music
                    </span>
                    <label class="usfsa-checkbox"
                           :for="musicInputId()"
                           :disabled="music_override_submitting">
                        <input :id="musicInputId()"
                               :disabled="music_override_submitting"
                               :checked="segment.music_status.overridden"
                               type="checkbox"
                               v-on:click.prevent="handleMusicOverride($event.target.checked)">
                        <span class="usfsa-checkbox__text">Received</span>
                    </label>
                </div>
                <p v-if="music_override_error" class="input-error">
                    {{music_override_error}}
                </p>
            </div>
        </div>
        <div class="entity-check-in-events-music-ppc-status__item" :class="'entity-check-in-events-music-ppc-status__item--' + (isPpcComplete(segment) ? 'complete' : 'incomplete')">
            <div v-if="segment.ppc_status.completed" class="entity-check-in-events-music-ppc-status__item__display">
                <button class="entity-check-in-events-music-ppc-status__item__trigger"
                        :class="'entity-check-in-events-music-ppc-status__item__trigger--'+(ppc_expanded ? 'close' : 'open')"
                        v-on:click.prevent="ppc_expanded = !ppc_expanded">
                    <span class="entity-check-in-events-music-ppc-status__item__label">
                        PPC
                    </span>
                </button>
                <div v-if="ppc_expanded" class="entity-check-in-events-music-ppc-status__item__content entity-check-in-events-music-ppc-status__item__content--ppc">
                    <ol class="entity-check-in-events-music-ppc-status__item__ppc-list">
                        <li v-for="(ppc_item,index) in segment.ppc" :key="index">
                            {{ppc_item}}
                        </li>
                    </ol>
                </div>
            </div>
            <div v-else-if="!segment.ppc_required" class="entity-check-in-events-music-ppc-status__item__notice">
                <div class="entity-check-in-events-music-ppc-status__item__label">
                    PPC
                    <span class="entity-check-in-events-music-ppc-status__item__label__notice">Event segment does not require PPC</span>
                </div>
            </div>
            <div v-else class="entity-check-in-events-music-ppc-status__item__override">
                <div class="entity-check-in-events-music-ppc-status__item__override__row">
                    <span class="entity-check-in-events-music-ppc-status__item__label">
                        PPC
                    </span>
                    <label :for="ppcInputId()"
                           class="usfsa-checkbox"
                           :disabled="ppc_override_submitting">
                        <input :id="ppcInputId()"
                               :disabled="ppc_override_submitting"
                               :checked="segment.ppc_status.overridden"
                               type="checkbox"
                               v-on:click.prevent="handlePpcOverride($event.target.checked)">
                        <span class="usfsa-checkbox__text">Received</span>
                    </label>
                </div>
                <p v-if="ppc_override_error" class="input-error">
                    {{ppc_override_error}}
                </p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import MusicItem from '../../../../../../pages/Music/MusicItem.vue';
    import {
        CheckInEventSegment,
        CheckInEventSegmentStatusOverridePayload
    } from '../../../../_contracts/CheckInContracts';

    export default Vue.extend({
        components: {
            MusicItem
        },
        props: {
            /**
             * The CheckInEventSegment for which Music and PPC are being managed
             */
            segment: {
                type: Object as () => CheckInEventSegment
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether the music section is expanded
                 */
                music_expanded: false,
                /**
                 * Whether there was an error saving a music override
                 */
                music_override_error: <string | null>null,
                /**
                 * Whether a music override is currently submitting
                 */
                music_override_submitting: false,
                /**
                 * Whether the PPC section is expanded
                 */
                ppc_expanded: false,
                /**
                 * Whether there was an error saving a PPC override
                 */
                ppc_override_error: <string | null>null,
                /**
                 * Whether a ppc override is currently submitting
                 */
                ppc_override_submitting: false
            };
        },
        methods: {
            /**
             * Handle input event on Music override input
             */
            handleMusicOverride: function (is_overridden: boolean) {
                this.music_override_submitting = true;
                this.music_override_error = null;
                const payload: CheckInEventSegmentStatusOverridePayload = {
                    segment: this.segment,
                    is_overridden
                };
                this.$store.dispatch('checkin/events/overrideEventSegmentMusicStatus', payload)
                    .then(() => {
                        this.music_override_submitting = false;
                    })
                    .catch((error_message) => {
                        this.music_override_submitting = false;
                        this.music_override_error = error_message;
                    });
            },
            /**
             * Handle input event on PPC override input
             */
            handlePpcOverride: function (is_overridden: boolean) {
                this.ppc_override_submitting = true;
                this.ppc_override_error = null;
                const payload: CheckInEventSegmentStatusOverridePayload = {
                    segment: this.segment,
                    is_overridden
                };
                this.$store.dispatch('checkin/events/overrideEventSegmentPpcStatus', payload)
                    .then(() => {
                        this.ppc_override_submitting = false;
                    })
                    .catch((error_message) => {
                        this.ppc_override_submitting = false;
                        this.ppc_override_error = error_message;
                    });
            },
            /**
             * Whether the item is Music complete
             */
            isMusicComplete: function (segment: CheckInEventSegment): boolean {
                return this.$store.getters['checkin/events/segmentCheckInMusicComplete'](segment);
            },
            /**
             * Whether the item is Ppc complete
             */
            isPpcComplete: function (segment: CheckInEventSegment): boolean {
                return this.$store.getters['checkin/events/segmentCheckInPpcComplete'](segment);
            },
            /**
             * Input id for the Music override input
             */
            musicInputId: function (): string {
                return 'viewed_music_' + this.segment.id + '_' + this.segment.event_id;
            },
            /**
             * Input id for the PPC override input
             */
            ppcInputId: function (): string {
                return 'viewed_ppc_' + this.segment.id + '_' + this.segment.event_id;
            }
        }
    });
</script>