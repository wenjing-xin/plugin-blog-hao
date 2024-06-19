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
                    height: this.getAttribute("height") || "500",
                };
                this.render();
            }
            render() {
                if (!this.options.src) return (this.innerHTML = "请输入正确的pdf链接");
                const realHeight = extractHeight(this.parentElement.offsetWidth, this.options.width, this.options.height);
                this.setAttribute("height", realHeight);
                this.innerHTML = `
                        <div class="tool_pdf">
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
                        <iframe class="iframe-dom" allowfullscreen="true" scrolling="no" border="0" frameborder="no" framespacing="0" class="tool_vplayer" src="//player.bilibili.com/player.html?bvid=${this.options.bvid}&page=${this.options.page}" style="width:${this.options.width}; height:${realHeight}px;"></iframe>`;
            }
        }

        class BlogHaoFoldBox extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    title: this.getAttribute("title"),
                    color: this.getAttribute("color") || '',
                    type:  this.getAttribute("type") || ''
                };
                const _temp = getDirectEle(this, "_tpl");
                let contents = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, "");
                let htmlStr = `
                                <details class="folding-tag" ${this.options.type}>
                                    <summary style="background: ${this.options.color}">${this.options.title}</summary>
                                    <div class="content">
                                       ${contents}
                                    </div>
                                </details>
                               `;
                this.innerHTML = htmlStr;
            }
        }
        // PDF嵌入
        customElements.define("bloghao-pdf", PDFDom);
        // B站视频
        customElements.define("bloghao-bili", BiliDom);
        // 折叠框嵌入
        customElements.define("bloghao-fold",BlogHaoFoldBox);

    })

    document.addEventListener("pjax:complete", () => {
        window.location.reload();
    })

})();