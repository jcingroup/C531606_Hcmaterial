$(document).ready(function() {
    // 行動裝置的主選單
    $menuLeft = $('#menu');
    $trigger = $('.menu-trigger');

    $trigger.click(function() {
        $(this).toggleClass('active');
        $('body').toggleClass('push');
    });
    $('.toggle').click(function() {
        $('body').removeClass('push');
    });

    // 行動裝置的產品分類選單
    $(".pro-menu").click(function() {
        $(this).toggleClass("active");
        // $('aside nav').slideToggle(750);
        $('#sidebar nav').toggleClass('open');
    });

    // 當前選單+current
    $("a").each(function() {
        if ($(this).attr("href") == window.location.pathname) {
            $(this).addClass("current");
        }
    });
});