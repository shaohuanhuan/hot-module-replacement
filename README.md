
```
 这是一个jade+node的项目，实现HMR没有用webpack-dev-server（小型express服务器）,
```
```
而是直接在node上实现的，加上webpack的多入口，比教科书上的HMR实现多了一点难度
``` 
```javascript
npm install
npm install supervisor -g
gulp dev
npm run dev
```
build
```
gulp build
npm start
```
#启动
http://localhost:8888/?shopId=547de083067a4b04afb6ae3c48186688


#项目结构

```
.
|-- restful                            // 后端nodejs目录
    |-- bin                            // nodejs 服务目录
        |-- www.js                     // 启动服务的文件
    |-- common                         // 公共文件目录
    |-- routes                         // 路由文件
    |-- app.js                         // 入口文件，express中间件
|-- static                             // 静态资源文件，发布目录
    |-- images                         // 图片文件
    |-- theme1                         // 主题1打包文件
    ...
|-- webApp                             // 前端目录
    |-- common                         // 所有主题公共目录
        |-- components                 // 一些公共的组件
        |-- js                         // 公共的js（包括各个页面的API）
        |-- style                      // 公共的样式文件
    |-- views                          // 主题公共的页面
    |-- theme1                         // 主题1目录
        |-- js                         // 主题1 所有的js文件
            |-- home                   // 首页文件夹
                |-- index.js           // 首页主js文件
            ...
        |-- style
            |-- common                 // 主题1的所有公共样式
            ...                        // 主题模块的其他样式
        |-- views
            |-- components             // 主题1的公共组件部分
            ...                        // 主题1其他模块页面
 |-- gulpfile.js                       // gulp配置
 |-- webpack.conf.js 
        
    
```
这里没有将webpack配置文件分成开发和生产环境2份，会导致一些优化问题
