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
                _innerHTML.replace(
                        /{([^}]*)}/g,
                        function ($0, $1) {
                            var str = $1.split(",");
                            str.forEach((item) => {
                                contents += `
								<div class="swiper-slide">
									<img style="height: ${configOptions.height}px;" src="${item}" alt="image" />
								</div>
							`;
                            });
                        }
                );
                let swipperIdName = "";
                switch (this.options.type){
                    case "slides":
                        swipperIdName = "bloghao-img-slide";
                        break;
                    case "coverflow":
                        swipperIdName = "bloghao-img-coverflow";
                        break;
                    case "card":
                        swipperIdName = "bloghao-img-card";
                        break;
                    case "thumbs":
                        swipperIdName = "bloghao-img-thumbs";
                        break;
                    default:
                        swipperIdName = "bloghao-img-normal";
                }

                let htmlStr = `<div class="swiper" id="${swipperIdName}" style="width:${this.options.width};">
                                    <div class="swiper-wrapper">
                                        ${contents}
                                    </div>
                               </div>`;
                this.innerHTML = htmlStr;
            }
        }

        class ImgGalleryThumbs extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    width: this.getAttribute("width") || "92%",
                    height: this.getAttribute("height") || 350,
                    type: this.getAttribute("type") || "normal",
                };
                const _imgs = getDirectEle(this, "_img");
                let _innerHTML = _imgs.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, "");
                let contents = "";
                let configOptions = this.options;
                _innerHTML.replace(
                        /{([^}]*)}/g,
                        function ($0, $1) {
                            var str = $1.split(",");
                            str.forEach((item) => {
                                contents += `
								<div class="swiper-slide">
									<img style="height: ${configOptions.height}px;width: 100%" src="${item}" alt="image" />
								</div>
							`;
                            });
                        }
                );

                let htmlStr = `<div class="swiper" id="bloghao-img-thumb" style="width:${this.options.width};">
                                    <div class="swiper-wrapper">
                                        ${contents}
                                    </div>
                                </div>
                                <div class="swiper" id="gallery-thumbs">
                                    <div class="swiper-wrapper">
                                        ${contents}
                                    </div>
                                </div>`;
                this.innerHTML = htmlStr;
            }
        }

        class RevealSlide extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    width: this.getAttribute("width") || "100%",
                    height: this.getAttribute("height") || "500",
                };
                const slideMarkdown = getDirectEle(this, "slide-markdown");
                let slideContent = slideMarkdown.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, "");
                this.render(slideContent);
            }
            render(slideContent) {
                const realHeight = extractHeight(this.parentElement.offsetWidth, this.options.width, this.options.height);
                this.setAttribute("height", realHeight);

                this.innerHTML = `
                        <div class="reveal" id="reveal-slide" style="width: ${this.options.width};height: ${this.options.height}px">
                            <div class="slides">
                                <section data-markdown>
                                     <textarea data-template>
                                       ## 幻燈片 1
                                       包含一些文本和一個[鏈接](https://hakim.se)的段落。
                                       
                                       ---
                                       ## 幻燈片 2
                                       
                                       ---
                                       ## 幻燈片 3   
                                     </textarea>
                                </section>
                            </div>
                        </div>`;
            }
        }

        // PDF嵌入
        customElements.define("bloghao-pdf", PDFDom);
        // B站视频
        customElements.define("bloghao-bili", BiliDom);
        // 图片走马灯嵌入
        customElements.define("bloghao-img-swipper", ImgGallery);
        // 图片轮播展示 thumb类型
        customElements.define("bloghao-img-thumb", ImgGalleryThumbs);
        customElements.define("bloghao-slide", RevealSlide)

    })
})();