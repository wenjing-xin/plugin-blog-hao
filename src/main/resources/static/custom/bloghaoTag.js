/* 获取直属子元素 */
function getDirectEle(el, className) {
    for (let item of el.children) if (item.className === className) return item;
    return null;
}

function parseExpression(expression, occupied) {
    if (expression === "${full}") {
        return occupied;
    }
    const match = expression.replaceAll("full", occupied).match(/^\$\{([<>=]{1,2}.+)\?(.+):(.+)}$/);
    if (match) {
        return eval(`occupied${match[1]} ? ${match[2]} : ${match[3]}`);
    }
    throw new Error(`Invalid expression "${expression}"`);
}

function extractHeight(occupied, width, height) {
    const occupiedWidth = width.endsWith("%")
            ? occupied * (Number(width.slice(0, -1)) / 100)
            : Number(width);
    height = height.replaceAll("cwidth", occupiedWidth);
    if (height.startsWith("${") && height.endsWith("}")) {
        return parseExpression(height, occupied);
    } else {
        return height;
    }
}

(function() {
    // 标签替换
    document.addEventListener("DOMContentLoaded", () => {
        class PDFDom extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    src: this.getAttribute("src") || "",
                    width: this.getAttribute("width") || "100%",
                    height: this.getAttribute("height") || "800",
                };
                this.render();
            }
            render() {
                if (!this.options.src) return (this.innerHTML = "请输入正确的pdf链接");
                const realHeight = extractHeight(this.parentElement.offsetWidth, this.options.width, this.options.height);
                this.setAttribute("height", realHeight);
                this.innerHTML = `
                        <div class="bloghao-pdf">
                            <iframe class="iframe-dom" src="${this.options.src}" style="width:${this.options.width}; height:${realHeight}px;"></iframe>
                        </div>`;
            }
        }

        class BiliDom extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    bvid: this.getAttribute("bvid"),
                    page: +(this.getAttribute("page") || "1"),
                    width: this.getAttribute("width") || "100%",
                    height: this.getAttribute("height") || "500",
                };
                this.render();
            }
            render() {
                if (!this.options.bvid) return (this.innerHTML = "请输入正确的bvid");
                const realHeight = extractHeight(this.parentElement.offsetWidth, this.options.width, this.options.height);
                this.setAttribute("height", realHeight);
                this.innerHTML = `
                        <iframe class="bilibili-iframe-dom" allowfullscreen="true" scrolling="no" border="0" frameborder="no" framespacing="0" class="tool_vplayer" src="//player.bilibili.com/player.html?bvid=${this.options.bvid}&page=${this.options.page}" style="width:${this.options.width}; height:${realHeight}px;"></iframe>`;
            }
        }

        class ImgGallery extends HTMLElement {
            constructor() {

                super();
                this.options = {
                    width: this.getAttribute("width") || "98%",
                    height: this.getAttribute("height") || 300,
                    type: this.getAttribute("type") || "normal",
                };

                const _imgs = getDirectEle(this, "_img");
                let _innerHTML = _imgs.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, "");
                let contents = "";
                let configOptions = this.options;
                let isThumbsSwiper = false;
                let swiperIdName = "";
                switch (this.options.type) {
                    case "slides":
                        swiperIdName = "bloghao-img-slide";
                        break;
                    case "coverflow":
                        swiperIdName = "bloghao-img-coverflow";
                        break;
                    case "card":
                        swiperIdName = "bloghao-img-card";
                        break;
                    case "thumbs":
                        swiperIdName = "bloghao-img-thumb";
                        isThumbsSwiper = true;
                        break;
                    default:
                        swiperIdName = "bloghao-img-normal";
                }
                _innerHTML.replace(
                        /{([^}]*)}/g,
                        function ($0, $1) {
                            var str = $1.split(",");
                            str.forEach((item) => {
                                if(isThumbsSwiper){
                                    contents += `<div class="swiper-slide">
                                                    <img style="height: ${configOptions.height}px; width: ${configOptions.width};" src="${item}" alt="image" />
                                                </div>`;
                                }else{
                                    contents += `<div class="swiper-slide">
                                                    <img style="height: ${configOptions.height}px;" src="${item}" alt="image" />
                                                </div>`;
                                }

                            });
                        }
                );

                let _tmpl = `<div class="swiper" id="${swiperIdName}" style="width:${this.options.width};">
                                    <div class="swiper-wrapper">
                                        ${contents}
                                    </div>
                             </div>`;
                if (isThumbsSwiper) {
                    _tmpl = `<div class="swiper" id="${swiperIdName}" style="width:${this.options.width};text-align: center">
                                    <div class="swiper-wrapper">
                                        ${contents}
                                    </div>
                             </div>
                             <div class="swiper" id="gallery-thumbs" style="width:${this.options.width};">
                                 <div class="swiper-wrapper">
                                    ${contents}
                                 </div>
                             </div>`;
                }
                this.innerHTML = _tmpl;
            }
        }

        /**
         * 幻灯片
         */
        class RevealSlide extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    width: this.getAttribute("width") || "100%",
                    height: this.getAttribute("height") || "500",
                    render: this.getAttribute("render") || "md"
                };
                let slideContent = getDirectEle(this, "slide-content");
                if(this.options.render == "md"){
                    slideContent = slideContent.innerHTML.trim().replaceAll("<br>", "---");
                }
                this.render(slideContent);
            }
            render(slideContent) {
                const realHeight = extractHeight(this.parentElement.offsetWidth, this.options.width, this.options.height);
                this.setAttribute("height", realHeight);
                let renderTmpl = "";
                if(this.options.render == "md"){
                    renderTmpl = ` 
                                <div class="reveal" id="reveal-slide" style="width: ${this.options.width};height: ${this.options.height}px">
                                    <div class="slides">
                                        <section data-markdown>
                                            <textarea data-template>
                                               ${slideContent}
                                            </textarea>
                                        </section>
                                    </div>
                                </div>`;
                }else{
                    renderTmpl =  `<div class="reveal" id="reveal-slide" style="width: ${this.options.width};height: ${this.options.height}px">
                                        <div class="slides">
                                            ${slideContent}
                                        </div>
                                   </div>`;
                }
                this.innerHTML = renderTmpl;
            }
        }

        // PDF嵌入
        customElements.define("bloghao-pdf", PDFDom);
        // B站视频
        customElements.define("bloghao-bili", BiliDom);
        // 图片走马灯嵌入
        customElements.define("bloghao-img-swiper", ImgGallery);
        // 幻灯片标签
        customElements.define("bloghao-slide", RevealSlide)

    })

})();