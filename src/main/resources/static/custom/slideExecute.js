(function() {
    function executeSlideInit(){
        // 初始化幻灯片配置
        if(document.querySelector("#reveal-slide")){
            let slideView = new Reveal(document.querySelector('#reveal-slide'), {
                embedded: true,
                keyboardCondition: 'focused'
            });
            let slideOptions = {
                revealViewport: "reveal",
                controls: true,
                progress: true,
                center: true,
                hash: true,
                plugins: []
            }
            fetch("/apis/blogHao.wenjing.xin/v1alpha1/blogHaoConfig/slide-config", { method: "GET"})
                    .then( res => res.json())
                    .then( data => {
                        Object.assign(slideOptions, {mouseWheel: data.individualization.mouseWheel })
                        Object.assign(slideOptions, {loop: data.individualization.loop })
                        if(data.individualization.scrollView){
                            Object.assign(slideOptions, {view: "scroll" });
                            let scrollProgressVal = data.individualization.scrollProgress == "auto" ? "auto" : Boolean.valueOf(data.individualization.scrollProgress);
                            Object.assign(slideOptions, {scrollProgress: scrollProgressVal });
                        }

                        // 获取插件列表
                        data.slidePlugin.enablePlugin.forEach( pluginItem => {
                            switch (pluginItem.pluginName){
                                case "RevealMarkdown":
                                    slideOptions.plugins.push(RevealMarkdown);
                                    break;
                                case "RevealHighlight":
                                    slideOptions.plugins.push(RevealHighlight);
                                    break;
                                case "RevealMath.KaTeX":
                                    slideOptions.plugins.push(RevealMath.KaTeX);
                                    break;
                                case "RevealSearch":
                                    slideOptions.plugins.push(RevealSearch);
                                    break;
                                case "RevealNotes":
                                    slideOptions.plugins.push(RevealNotes);
                                    break;
                                case "RevealZoom":
                                    slideOptions.plugins.push(RevealZoom);
                                    break;
                            }
                        })
                        // 初始化幻灯片配置
                        slideView.initialize(slideOptions);
                    }).catch( error =>{
                slideView.initialize(slideOptions);
            });
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        executeSlideInit()
    })
    document.addEventListener("pjax:complete", () => {
        executeSlideInit();
    })

})();