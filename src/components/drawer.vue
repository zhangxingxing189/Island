<script setup lang="ts">
import{computed,watchEffect}from'vue'
const props=defineProps({
    open:{type:Boolean,required:true},
    width:{type:[String,Number],default:'50%'},
    placement:{type:String as ()=>'left'|'right'|'top'|'bottom',default:'left',validator:(v:string)=>['left','right','top','bottom'].includes(v)},
    closable:{type:Boolean,default:true},
    maskClosable:{type:Boolean,default:true},
    mask:{type:Boolean,default:true}
})
const emit=defineEmits(['update:open','close'])
const contentStyle=computed(()=>({
    width:props.placement==='left'||props.placement==='right'?typeof props.width==='number'?`${props.width}px`:props.width:'100%',
    height:props.placement==='top'||props.placement==='bottom'?typeof props.width==='number'?`${props.width}px`:props.width:'100%'
}))
const transitionName=computed(()=>`slide-${props.placement}`)
const close=()=>{
    emit('update:open',false)
    emit('close')
}
const handleMaskClick=()=>{
    if(props.maskClosable)close()
}
watchEffect((onCleanup)=>{
    const handleKeydown=(e:KeyboardEvent)=>{
        if(e.key==='Escape'&&props.open)close()
    }
    document.addEventListener('keydown',handleKeydown)
    onCleanup(()=>document.removeEventListener('keydown',handleKeydown))
})
</script>
<template>
    <transition name="fade"><div v-if="open"class="drawer-mask"@click.self="handleMaskClick"/></transition>
    <transition :name="transitionName"mode="out-in">
        <div v-show="open"class="drawer-content":class="[placement]":style="contentStyle">
            <div class="drawer-body"><slot></slot></div>
        </div>
    </transition>
</template>
<style lang="scss" scoped>
.drawer-mask{
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 999;
}
.drawer-content{
    position: fixed;
    background: #fff;
    box-shadow: -2px 0 8px rgba(0,0,0,0.15);
    z-index: 1000;
    backface-visibility: hidden;
    will-change: transform;
    &.right{right: 0; top: 0; bottom: 0;}
    &.left{left: 0; top: 0; bottom: 0;}
    &.top{top: 0; left: 0; right: 0;}
    &.bottom{bottom: 0; left: 0; right: 0;}
    .drawer-header{
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .close-icon{
            cursor: pointer;
            &:hover { color: #1890ff;}
        }
    }
    .drawer-body{
        padding: 16px;
        overflow: auto;
    }
}
.slide-left-enter-active,.slide-left-leave-active{
    transition: transform 0.3s cubic-bezier(0.2,0,0,1);
}
.slide-left-enter-from,.slide-left-leave-to{
    transform: translateX(-100%);
}
.slide-top-enter-active,.slide-top-leave-active{
    transition: transform 0.3s cubic-bezier(0.2,0,0,1);
}
.slide-top-enter-from,.slide-top-leave-to{
    transform: translateY(-100%);
}
.slide-bottom-enter-active,.slide-bottom-leave-active{
    transition: transform 0.3s cubic-bezier(0.2,0,0,1);
}
.slide-bottom-enter-from,.slide-bottom-leave-to{
    transform: translateY(100%);
}
.slide-right-enter-active,.slide-right-leave-active{
    transition: transform 0.3s cubic-bezier(0.2,0,0,1);
}
.slide-right-enter-from,.slide-right-leave-to{
    transform: translateX(100%);
}
.fade-enter-active{
    transition: opacity 0.2s ease-out;
}
.fade-leave-active{
    transition: opacity 0.15s ease-in;
}
</style>