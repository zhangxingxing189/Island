<script setup lang="ts">
import{ref,onMounted}from'vue'
import{isEqual}from'lodash'
import{$getmsg,$postmsg,$getuser,setAuthorization}from'@/api/chat'
import{message}from'ant-design-vue'
import drawer from'./drawer.vue'
interface msg{
    avatar:string,name:string,text:string,time:string,user_id:string,id:string
}
const getdate=(timestamp=Date.now())=>new Date(timestamp).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false})
//login()
const open=ref(false),world=ref({msg:[]as msg[],cnt:0}),island=ref({msg:[]as msg[],cnt:0}),latest=ref({
    avatar:'',name:'',text:'',time:'',cnt:0
}),select=ref(0),input=ref(['','']),data=ref(JSON.parse(localStorage.getItem('data')as string))
if(!data.value)data.value.user="JSON.parse(localStorage.getItem('user')as string)"
setAuthorization(data.value.user.atoken)
onMounted(async()=>{
    for(let now=[Date.now(),Date.now()];true;latest.value.cnt=world.value.cnt+island.value.cnt){
        try{
            const msgs=(await $getmsg('0',now[0])).messages
            for(const msg of msgs){
                const user=await $getuser(msg.user_id)
                world.value.msg.push({
                    avatar:user.avatar,name:user.username,text:msg.message,time:getdate(msg.timestamp),user_id:msg.user_id,id:msg.id
                })
                if(data.value.user.user_id!=msg.user_id){
                    latest.value={avatar:user.avatar,name:user.username,text:msg.message,time:getdate(msg.timestamp),cnt:latest.value.cnt}
                    if(!open.value||select.value)world.value.cnt++
                }
            }
            now[0]=msgs[msgs.length-1].timestamp+1
        }catch(error){}
        try{
            const msgs=(await $getmsg(data.value.island.id,now[1])).messages
            for(const msg of msgs){
                const user=await $getuser(msg.user_id)
                island.value.msg.push({
                    avatar:user.avatar,name:user.username,text:msg.message,time:getdate(msg.timestamp),user_id:msg.user_id,id:msg.id
                })
                if(data.value.user.user_id!=msg.user_id){
                    latest.value={avatar:user.avatar,name:user.username,text:msg.message,time:getdate(msg.timestamp),cnt:latest.value.cnt}
                    if(!open.value||!select.value)island.value.cnt++
                }
            }
            now[1]=msgs[msgs.length-1].timestamp+1
        }catch(error){}
        const d=JSON.parse(localStorage.getItem('data')as string)
        if(d&&!isEqual(data.value,d))data.value=d
    }
})
</script>
<template>
    <a-button class="latest"@click="open=true;latest.cnt=0"style="display: flex;"v-if="latest.cnt">
        <img :src="latest.avatar"style="border-radius: 50%;"/>
        <div>
            <div v-text="latest.name"class="text"style="color: rgb(0, 213, 255);font-size: 20px;"/>
            <div v-text="latest.text"class="text"style="font-size: 15px;"/>
            <div v-text="latest.time"style="color: rgb(183, 183, 183);text-align: right;"/>
        </div>
        <a-badge :count="latest.cnt":key="latest.cnt"style="position: absolute;right: 7px;top: 17px;"/>
    </a-button>
    <a-button class="latest never"@click="open=true"v-else>
        <div>暂无最新消息</div>
        <div v-text="getdate(Date.now())"/>
    </a-button>
    <drawer v-model:open="open">
        <a-badge :count="world.cnt":key="world.cnt"style="position: absolute;left: 21px;"v-if="world.cnt"/>
        <a-badge :count="island.cnt":key="island.cnt"style="position: absolute;left: 71px;"v-if="island.cnt"/>
        <a-tabs v-model:activeKey="select":key="select"@change="select?(island.cnt=0):(world.cnt=0)">
            <a-tab-pane v-for="(v1,i1) in data.island?['世界',data.island.name]:['世界']":key="i1":tab="v1">
                <div class="panel">
                    <div v-for="v2 in i1?island.msg:world.msg":key="v2.id">
                        <div style="display: flex;justify-content: right;"v-if="v2.user_id==data.user.user_id">
                            <div class="word">
                                <div v-text="v2.name"style="text-align: right;color:blueviolet;"/>
                                <div v-text="v2.text"class="message sent"/>
                                <div v-text="v2.time"class="time"/>
                            </div>
                            <img :src="v2.avatar"class="image"/>
                        </div>
                        <div style="display: flex;"v-else>
                            <img :src="v2.avatar"class="image"/>
                            <div class="word">
                                <div v-text="v2.name"style="text-align: left;color:blueviolet;"/>
                                <div v-text="v2.text"class="message received"/>
                                <div v-text="v2.time"class="time"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <textarea v-model="input[i1]"placeholder="请输入文本"rows="2"wrap="soft"class="textarea"/>
                    <a-button type="primary"@click="()=>{
                        if(input[i1]){$postmsg(data.user.user_id,i1?data.island.id:'0',input[i1]);input[i1]=''}
                        else message.warn('不能发送空消息')
                    }">发送</a-button>
                </div>
            </a-tab-pane>
        </a-tabs>
    </drawer>
</template>
<style lang="scss" scoped>
@keyframes fadeInUp{
    from{opacity: 0;transform: translateY(10px);}
    to{opacity: 1;transform: translateY(0);}
}
.panel{
    width: 94%;
    height: 800px;
    overflow: auto;
    margin-left: 3%;
    box-sizing: border-box;
    .image{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .word{
        padding: 5px;
        box-sizing: border-box;
        .message{
            max-width: 60%;
            padding: 12px 18px;
            margin: 8px 0;
            border-radius: 18px;
            animation: fadeInUp 0.3s ease;
            box-sizing: border-box;
            word-wrap: break-word;
            white-space: pre-wrap;
        }
        .received{
            background: linear-gradient(45deg, #ffffff, #f8f9fa);
            box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
            border: 1px solid #e9ecef;
        }
        .sent{
            background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            margin-left: auto;
        }
        .time{
            text-align: center;
            color: rgb(183, 183, 183);
        }
    }
}
.footer{
    display: flex;
    width: 94%;
    padding: 10px;
    box-sizing: border-box;
    place-content: center;
    background: linear-gradient(to top, rgb(165, 255, 255), white);
    border-radius: 30px;
    position: fixed;
    left: 3%;
    top: 91%;
    .textarea{
        flex: 1;
        margin: 0 10px 0 5px;
        box-sizing: border-box;
        border-radius: 10px;
        padding: 5px;
        overflow: auto;
    }
}
.never{
    color: rgb(183, 183, 183);
    text-align: center;
    font-size: 15px;
}
.latest{
    position: fixed;
    left: 50px;
    bottom: 75px;
    width: 320px;
    height: 90px;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgb(0, 213, 255),0 0 10px rgb(0, 213, 255) inset;
    .text{
        margin: 0 10px;
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        box-sizing: border-box;
    }
}
</style>
