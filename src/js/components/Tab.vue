<template>
    <div class="tabs__tab-body" :class="body_class" v-if="is_active">
        <slot></slot>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from 'vue-property-decorator'
    interface TabContract{
        is_active:boolean,
        setIsActive(set_active:boolean):void
        valuekey?:string
        trigger_template?:string
    }
    @Component
    export default class Tab extends Vue implements TabContract{
        is_active:boolean;
        @Prop({default:''})
        name!:string;
        @Prop({default:''})
        valuekey!:string;
        @Prop({default:''})
        trigger_template!:string;
        @Prop({default:false})
        selected!:boolean;
        @Prop({default:function(){
            return []
        }})
        body_class!:string[];
        constructor(){
            super();
            this.is_active=!!this.selected;
        }
        setIsActive(set_active:boolean):void{
            this.is_active=set_active;
        }
    }
</script>