(function() {
    function executeSwiperInit(){
        let swiperElement = document.getElementsByTagName("bloghao-img-swiper");
        if(swiperElement && swiperElement.length){
            Array.from(swiperElement).forEach( item => {
                let swiperType = item.getAttribute("type") || "normal";
                switch (swiperType){
                    case "slides":
                        new Swiper ('#bloghao-img-slide', {
                            direction: 'horizontal',
                            loop: true,
                            autoplay: true,
                            mousewheel: true,
                            slidesPerView: 2,
                        })
                        break;
                    case "coverflow":
                        new Swiper ('#bloghao-img-coverflow', {
                            direction: 'horizontal',
                            loop: true,
                            autoplay: true,
                            effect: 'coverflow',
                            slidesPerView: 3,
                            mousewheel: true,
                            centeredSlides: true
                        })
                        break;
                    case "card":
                        new Swiper ('#bloghao-img-card', {
                            direction: 'horizontal',
                            loop: true,
                            autoplay: true,
                            mousewheel: true,
                            effect: 'cards'
                        })
                        break;
                    case "thumbs":
                        console.log("thumbs")
                        const galleryThumbs = new Swiper('#gallery-thumbs', {
                            loop: true,
                            autoplay: true,
                            spaceBetween: 5,
                            slidesPerView: 4,
                            watchSlidesVisibility: true,
                        });
                        new Swiper ('#bloghao-img-thumb', {
                            spaceBetween: 5,
                            direction: 'horizontal',
                            loop: true,
                            autoplay: true,
                            thumbs: {
                                swiper: galleryThumbs,
                            }
                        })
                        break;
                    default:
                        new Swiper ('#bloghao-img-normal', {
                            direction: 'horizontal',
                            loop: true,
                            autoplay: true
                        })
                }
            })
        }

        // 初始化幻灯片配置
        if(document.querySelector("#reveal-slide")){
            let slideView = new Reveal(document.querySelector('#reveal-slide'), {
                embedded: true,
                keyboardCondition: 'focused'
            });
            let initializeOptions = {
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
                        Object.assign(initializeOptions, {mouseWheel: data.individualization.mouseWheel })
                        Object.assign(initializeOptions, {loop: data.individualization.loop })
                        if(data.individualization.scrollView){
                            Object.assign(initializeOptions, {view: "scroll" });
                            let scrollProgressVal = data.individualization.scrollProgress == "auto" ? "auto" : Boolean.valueOf(data.individualization.scrollProgress);
                            Object.assign(initializeOptions, {scrollProgress: scrollProgressVal });
                        }

                        // 获取插件列表
                        data.slidePlugin.enablePlugin.forEach( pluginItem => {
                            switch (pluginItem.pluginName){
                                case "RevealMarkdown":
                                    initializeOptions.plugins.push(RevealMarkdown);
                                    break;
                                case "RevealHighlight":
                                    initializeOptions.plugins.push(RevealHighlight);
                                    break;
                                case "RevealMath.KaTeX":
                                    initializeOptions.plugins.push(RevealMath.KaTeX);
                                    break;
                                case "RevealSearch":
                                    initializeOptions.plugins.push(RevealSearch);
                                    break;
                                case "RevealNotes":
                                    initializeOptions.plugins.push(RevealNotes);
                                    break;
                                case "RevealZoom":
                                    initializeOptions.plugins.push(RevealZoom);
                                    break;
                            }
                        })
                        // 初始化幻灯片配置
                        slideView.initialize(initializeOptions);
                    }).catch( error =>{
                        slideView.initialize(initializeOptions);
                    });
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        executeSwiperInit()
    })
    document.addEventListener("pjax:complete", () => {
        executeSwiperInit();
    })

})();