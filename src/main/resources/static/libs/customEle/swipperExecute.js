(function() {
    function executeSwiperInit(){
        if(document.querySelector("#bloghao-img-slide")){
            new Swiper ('#bloghao-img-slide', {
                direction: 'horizontal', // 垂直切换选项
                loop: true, // 循环模式选项
                autoplay: true,
                mousewheel: true,
                slidesPerView: 2,
            })
        }
        if(document.querySelector("#bloghao-img-coverflow")){
            new Swiper ('#bloghao-img-coverflow', {
                direction: 'horizontal', // 垂直切换选项
                loop: true, // 循环模式选项
                autoplay: true,
                effect: 'coverflow',
                slidesPerView: 3,
                mousewheel: true,
                centeredSlides: true
            })
        }
        if(document.querySelector("#bloghao-img-card")){
            new Swiper ('#bloghao-img-card', {
                direction: 'horizontal',
                loop: true,
                autoplay: true,
                mousewheel: true,
                effect: 'cards'
            })
        }
        if(document.querySelector("#bloghao-img-normal")){
            new Swiper ('#bloghao-img-normal', {
                direction: 'horizontal',
                loop: true,
                autoplay: true
            })
        }
        if(document.querySelector("#bloghao-img-thumb")){
            const galleryThumbs = new Swiper('#gallery-thumbs', {
                loop: true,
                autoplay: true,
                spaceBetween: 5,
                slidesPerView: 4,
                watchSlidesVisibility: true,//防止不可点击
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
        }
        if(document.querySelector("#reveal-slide")){
            let slideView = new Reveal(document.querySelector('#reveal-slide'), {
                embedded: true,
                keyboardCondition: 'focused', // 只有在聚焦時才反應按鍵
            });
            slideView.initialize({
                revealViewport: "reveal",
                controls: true,
                progress: true,
                center: true,
                hash: true,
                //RevealZoom,
                plugins: [  RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight]
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