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
            slideView.initialize({
                revealViewport: "reveal",
                controls: true,
                progress: true,
                center: true,
                hash: true,
                //RevealZoom,
                plugins: [RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight]
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