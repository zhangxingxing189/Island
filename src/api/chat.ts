import axios from'axios'
const instance=axios.create({
    baseURL:'http://118.31.119.216:8080/api',
    timeout:1e3
})
const headers={
    Authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjE4OTg5MDA4OTc2ODE5MDM2MTYsImNsYXNzIjoiYXRva2VuIiwiaXNzIjoiaXNsYW5kIiwiZXhwIjo0ODk1Mjc1OTEzLCJuYmYiOjE3NDE2NzU5MTN9.FMbMnACeKAZf5bGi02MVk6mpMAbQIChl65bAapP1o30'
}
export function setAuthorization(Authorization:string){
    instance.defaults.headers.common['Authorization']=Authorization
}
const $get=async(url:string,params:object,headers={})=>(await instance.get(url,{params,headers})).data
const $post=async(url:string,params:object,headers={})=>(await instance.post(url,params,{headers})).data
const login=()=>localStorage.setItem('data',JSON.stringify({user:{
    username:'zero',user_id:'1898900897681903616',avatar:'http://thirdqq.qlogo.cn/ek_qqapp/AQGXfbMXWaXssoojuDSMU0ficoBHfXIkP4fp7vGdc9q2M3Eqk5o2ibYBng0IQ1kOZibTLYR5z7xb41wIS4R4vMyLDh0dFlENLWqEe5IcM33qjW7Zia7CL4A/0',
    atoken:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjE4OTg5MDA4OTc2ODE5MDM2MTYsImNsYXNzIjoiYXRva2VuIiwiaXNzIjoiaXNsYW5kIiwiZXhwIjoxNzQyMzEzOTQwLCJuYmYiOjE3NDIzMDY3NDB9.bsI_LFBC1OEgbtrZPsdH7kxhC3RDpM8ScksGbzV8otM',
    rtoken:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjE4OTg5MDA4OTc2ODE5MDM2MTYsImNsYXNzIjoicnRva2VuIiwiaXNzIjoiaXNsYW5kIiwiZXhwIjoxNzQyOTExNTQwLCJuYmYiOjE3NDIzMDY3NDB9.KAaVcUU6Hw_6LckSpWLo-RzX6Rr3LE-gowCWqnteWog'
},island:{id:'1902167548053426176',name:'计算机小岛'}}))
export const $getuser=async(user_id:string)=>(await $get('/user/detail',{user_id},headers)).data
export const $getisland=async(island_id:string)=>(await $get('/island/detail',{island_id},headers)).data
export const $getmsg=async(island_id:string,timestamp=Date.now())=>(await $get('/chat/get',{island_id,timestamp},headers)).data
export const $postmsg=async(user_id:string,island_id:string,message:string,timestamp=Date.now())=>
    (await $post('/chat/send',{user_id,island_id,message,timestamp},headers)).data