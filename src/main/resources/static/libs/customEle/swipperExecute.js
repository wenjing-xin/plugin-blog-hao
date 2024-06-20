(function() {
    document.addEventListener("DOMContentLoaded", () => {
        if(document.querySelector("#bloghao-img-slide")){
            new Swiper ('#bloghao-img-slide', {
                direction: 'horizontal', // 垂直切换选项
                loop: true, // 循环模式选项
                autoplay: true,
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
                centeredSlides: true
            })
        }
        if(document.querySelector("#bloghao-img-card")){
            new Swiper ('#bloghao-img-card', {
                direction: 'horizontal',
                loop: true,
                autoplay: true,
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
    })
    document.addEventListener("pjax:complete", () => {
        if(document.querySelector(".swiper")){
            const mySwiper = new Swiper ('.swiper', {
                direction: 'vertical', // 垂直切换选项
                loop: true, // 循环模式选项
                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                },
                // 如果需要前进后退按钮
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            })
        }
    })
})();