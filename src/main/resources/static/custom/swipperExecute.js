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
                        console.log("cardzhixing",999)
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
    }

    document.addEventListener("DOMContentLoaded", () => {
        executeSwiperInit()
    })
    document.addEventListener("pjax:complete", () => {
        executeSwiperInit();
    })

})();