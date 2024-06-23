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
                keyboardCondition: 'focused',
            });
            let slidePluginList = [];
            fetch("/apis/blogHao.wenjing.xin/v1alpha1/blogHaoConfig/slide-config", { method: "GET"})
                    .then( res => res.json())
                    .then( data => {
                        data.slidePlugin.enablePlugin.forEach( pluginItem => {
                            switch (pluginItem.pluginName){
                                case "RevealMarkdown":
                                    slidePluginList.push(RevealMarkdown);
                                    break;
                                case "RevealHighlight":
                                    slidePluginList.push(RevealHighlight);
                                    break;
                                case "RevealMath.KaTeX":
                                    slidePluginList.push(RevealMath.KaTeX);
                                    break;
                                case "RevealSearch":
                                    slidePluginList.push(RevealSearch);
                                    break;
                                case "RevealNotes":
                                    slidePluginList.push(RevealNotes);
                                    break;
                                case "RevealZoom":
                                    slidePluginList.push(RevealZoom);
                                    break;
                            }
                        })
                        slideView.initialize({
                            revealViewport: "reveal",
                            controls: true,
                            progress: true,
                            center: true,
                            hash: true,
                            plugins: slidePluginList
                        });
                    }).catch( error =>{
                        slideView.initialize({
                            revealViewport: "reveal",
                            controls: true,
                            progress: true,
                            center: true,
                            hash: true,
                            plugins: slidePluginList
                        });
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