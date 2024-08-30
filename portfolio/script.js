// Smooth scroll for internal links
$(document).ready(function(){
    $('a[href^="#"]').on('click', function(event) {
        var target = this.hash;
        var $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function () {
            window.location.hash = target;
        });
    });

    // Animate on scroll
    $(window).on('scroll', function() {
        $('.animate-on-scroll').each(function() {
            if ($(this).isInViewport()) {
                $(this).addClass('animate');
            }
        });
    });
});

// Check if element is in viewport
$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};
