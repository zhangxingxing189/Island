# template

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

axios要写个request.ts文件，这个文件是axios的封装，里面有请求拦截器和响应拦截器，还有一些公共的配置，比如baseURL，请求超时时间等等。
然后把api都放在同一个ts文件里，这个文件里面是所有的请求方法，比如get请求，post请求，put请求，delete请求等等。尽量放在request方法里面，这样方便管理。

pinia把数据放在store里面，这个store里面有state，mutations，actions等等，这样方便管理数据
npm install ant-design-vue@4.x --save安装ant-design-vueUI库