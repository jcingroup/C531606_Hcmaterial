// 行動裝置的主選單
$menuLeft = $('#menu');
$trigger = $('.menu-trigger');

$trigger.click(function() {
    $(this).toggleClass('active');
    $('body').toggleClass('overlay');
});
$('.toggle').click(function() {
    $('body').removeClass('overlay');
});

// 下拉式選單 (行動裝置的產品分類選單)
var dropbtn = $("[data-dropdown='btn']");
var dropcontent = $("[data-dropdown='content']");
dropbtn.click(function(e) {
    $(this).toggleClass("active");
    dropcontent.slideToggle(750);
    event.preventDefault();
});
$(window).resize(function () {
    if (window.innerWidth >= 481) {
        dropcontent.removeAttr('style');
    }
});

// 當前選單+current
$("a").each(function() {
    if ($(this).attr("href") == window.location.pathname) {
        $(this).addClass("current");
    }
});
