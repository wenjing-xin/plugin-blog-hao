# plugin-blog-hao
**让你的博客变得更好**

> 为你的博客和站点增加一些更实用的功能，单页面和文章集成 swiper 以及幻灯片、PDF文件、bilibili视频插入等功能！每一个让博客变得更好的需求都会在这里去实现！

## 一、目前已经完成的功能
(已兼容含有 pjax 的主题)
- 图片轮播功能（四种风格）
- 哔哩哔哩视频嵌入
- PDF文件嵌入
- 文本复制追加功能
- 全站失色功能
- 中英文符号自动空格，段落首行缩进功能
- 幻灯片展示（依托默认编辑器的HTML编辑快，目前不兼容其他markdown编辑器）

## 二、TODO
- 开发专门的幻灯片编辑器

## 三、使用教程
### 1、PDF文件嵌入
标签语法
```html
<bloghao-pdf src="https://domain.com/test/pdf" width="100%" height="600"></bloghao-pdf>
```
属性说明
* src 为`必选属性`，它是展示的`PDF文件的路径`
* width `可选属性`，文件的宽度，默认 100%
* height `可选属性`，文件的高度，默认 800 ，单位 px，输入该属性时不需要带单位！

### 2、哔哩哔哩视频嵌入
标签语法
```html
<bloghao-bili bvid="" width="100%" height="600"></bloghao-bili>
```
属性说明
* bvid 为`必选属性`，自行搜索获取 bvid 的方法
* width `可选属性`，文件的宽度，默认 100%
* height `可选属性`，文件的高度，默认 500 ，单位 px，输入该属性时不需要带单位！

### 3、swiper 图片轮转

标签语法
```html
<!-- 注意{}中的图片链接需要用英文逗号分割，且必须包裹在<div class="_img"></div>标签内 -->
<bloghao-img-swiper type="normal" width="100%" height="600">
    <div class="_img">
        {http://localhost:8090/upload/iTab-5g7ew7.jpg,http://localhost:8090/upload/女帝-tuya.webp,http://localhost:8090/upload/iTab-g7319l.png,http://localhost:8090/upload/iTab-28rmkm.jpg}
    </div>
</bloghao-img-swiper>
```
属性说明
* type 为`可选属性`，swiper的类型，目前提供了五种类型的 swiper，分别为：slides、coverflow、card、thumbs、normal，如不填写。则默认为 normal 类型
* width `可选属性`，文件的宽度，默认 98%
* height `可选属性`，文件的高度，默认 300 ，单位 px，输入该属性时不需要带单位！

样式展示：
![](https://api.minio.yyds.pink/bbs/2024-06-26/1719384602-300917-swiper-show1-tuya.webp)
![](https://api.minio.yyds.pink/bbs/2024-06-26/1719384603-193019-swiper-show2-tuya.webp)

### 4、幻灯片
#### 4.1、效果展示：
![](https://api.minio.yyds.pink/bbs/2024-06-26/1719384942-472083-bloghaoslide.gif)
目前只支持在默认编辑器中借助 `HTML/markdown` 编辑块进行使用。具体使用方法如下：
#### 4.2、标签语法：
```html
<bloghao-slide render="md">
    <div class="slide-content">
        ## 代码片段
        贴一段代码
        <br>
        ## 动画示例
        <p class="fragment">淡入</p><p class="fragment fade-out">淡出</p>
        <p class="fragment highlight-red">突出顯示紅色</p>
        <p class="fragment fade-in-then-out">先淡入，然後淡出</p>
        <p class="fragment fade-up">向上滑動同時淡入</p>
        <br>
        ## 数学公式实例 
        $$ J(\theta_0,\theta_1) = \sum_{i=0} $$
    </div>
</bloghao-slide>
```
#### 4.3、说明：
>render 属性为可选属性，如果没有该属性，则无法使用markdown语法进行渲染，且同时要在插件配置项开启markdown插件

>当属性为 render 的时候，每一页幻灯片的结尾必须要使用 `<br>` 进行分割，表明以上的内容单独为一页
当 render 属性为空时，每一页的幻灯片内容必须包裹在 `<section></section>` 标签内，且不支持markdown语法！

> 注意，使用markdown语法进行内容编辑时，它对缩进（避免混合使用制表符和空格）和换行（避免连续换行）很敏感!

#### 4.4、内容语法

##### 4.4.1、markdown编辑

背景、媒体 、代码 、数学 、片段 、链接 、布局 语法可参考 https://revealjs.com/zh-hant/markup/



##### 4.4.2、HTML编辑
如果你在一个 section 内放置多个 section 元素，它们将被显示为垂直幻灯片。垂直幻灯片的第一个是其他幻灯片的“根”（在顶部），并将包括在水平序列中。
```html
<bloghao-slide render="md">
    <div class="slide-content">
        <section>水平幻燈片</section>
        <section>
            <section>垂直幻燈片 1</section>
            <section>垂直幻燈片 2</section>
        </section>
    </div>
</bloghao-slide>
```
代码块 ：data-trim 属性时，会自动移除代码周围的空白。避免对 HTML 进行转换，可以在 <code> 元素上添加 data-noescape 属性。
```html
<bloghao-slide render="md">
    <div class="slide-content">
        <section>
            <pre>
                <code data-trim="" data-noescape="">
                    (def lazy-fib
                      (concat
                       [0 1]
                       ((fn rfib [a b]
                            (lazy-cons (+ a b) (rfib b (+ a b)))) 0 1)))
                </code>
            </pre>
        </section>
    </div>
</bloghao-slide>
```

## 四、交流
QQ交流群与QQ频道，加群后管理员自动审核
<div>
&emsp;&emsp;<img src="https://api.minio.yyds.pink/bbs/2024-06-04/1717467713-802505-qq.png" width=150px />
&emsp;&emsp;<img src="https://api.minio.yyds.pink/bbs/2024-06-04/1717467714-226493-qq.jpg" width=158px />
</div>



