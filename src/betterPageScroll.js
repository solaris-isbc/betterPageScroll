(function( $ ) {
    var CONST_MOVE_UP = -1;
    var CONST_MOVE_DOWN= 1;
    var direction = 0;
    var currentPosition = 0;
    var scrollSpeed;
    var useMouseWheel;
    var useSwipe;
    var disabledRanges;
    var useDisabledRanges;
    $.fn.betterPageScroll = function( options ) {
        var settings = $.extend({
         //put default settings here
            scrollSpeed: 500,
            useMouseWheel: true,
            useSwipe: false,
            useDisabledRanges: false,
            disabledRanges: [],
            callback: null
            
         }, options || {} );
        scrollSpeed = settings.scrollSpeed;
        useMouseWheel = settings.useMouseWheel;
        useSwipe = settings.useSwipe;
        disabledRanges = settings.disabledRanges;
        useDisabledRanges = settings.useDisabledRanges;
        if(useMouseWheel){
            $(window).one("DOMMouseScroll mousewheel", PageScroll);
        }
        if(useSwipe){
            //TODO
            //detect mousedown and mouseup + coordinates
            //check whether swipe up or down
        }
        return this;
        function PageScroll(e){
            currentPosition = $(window).scrollTop();
            $(window).off("DOMMouseScroll mousewheel");
                
            if(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                direction = CONST_MOVE_UP;
            } else {
                direction = CONST_MOVE_DOWN;
            }
            if(!useDisabledRanges || !inDisabledRange(currentPosition)){
               scrollToNextAnchor();
            }
                
            window.setTimeout(function(){
                $(window).one("DOMMouseScroll mousewheel", PageScroll);
            }, scrollSpeed);
            
        }
        
        function scrollToNextAnchor(){
            //quick and dirty solution, iterate through anchors and find the one which has the closest positive/negative delta towards scroll top
            var closestDelta = null;
            var closestElement = null;
            $(".bps-anchor").each(function(){
                    
                    var currentDelta =0;
                    if(direction == CONST_MOVE_DOWN){
                        currentDelta = $(this).offset().top-currentPosition;
                        //if currentDelta closer, set to closest delta
                        //currentOffset has to be bigger than current position to be relevant
                        if(closestDelta == null || closestDelta > currentDelta){
                            //found the closes element downwards
                            if(currentDelta > 1 || (closestDelta != null && currentDelta>1) ){
                                closestDelta = currentDelta;
                                closestElement = $(this);
                            }
                        }
                    }else if(direction == CONST_MOVE_UP){
                        currentDelta = $(this).offset().top-currentPosition;
                         //if currentDelta closer, set to closest delta
                        //currentOffset has to be smaller than current position to be relevant
                        if(closestDelta == null || closestDelta < currentDelta){
                            //found the closes element upwards
                            if(currentDelta < -1 || (closestDelta != null && currentDelta<-1) ){
                                closestDelta = currentDelta;
                                closestElement = $(this);
                            }
                        }
                    }
                    //what if at the current element?
                    //probably never gonna get there, already found the other closest element
            });
            if(closestDelta != 0 && closestElement != null){
                $('html, body').animate({
                    scrollTop: closestElement.offset().top
                },
                scrollSpeed
                );
                window.setTimeout(function(){
                    typeof settings.callback == 'function' && settings.callback != null ? settings.callback.call() : settings.callback = null
                }, scrollSpeed);
            }
        }
        
        //disabledRanges: Array containing objects with two properties, start and end
        function inDisabledRange(currentPosition){
            console.log(currentPosition);
            
            for(var i = 0; i<disabledRanges.length; i++){
                if(currentPosition>=disabledRanges[i].start && currentPosition<=disabledRanges[i].end){
                console.log("in disabled range");
                    return true;
                }
            }
            return false;
        }
    };
 
}( jQuery ));