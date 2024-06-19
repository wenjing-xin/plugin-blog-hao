(function() {
    document.addEventListener("DOMContentLoaded", () => {
        if(document.querySelector(".swiper")){
            const mySwiper = new Swiper ('.swiper', {
                direction: 'horizontal', // 垂直切换选项
                loop: true, // 循环模式选项
                autoplay: true,
                slidesPerView: 2,
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