//Directive dropdown
var dropdown = angular.module("dropdownModule",[]);

dropdown.directive("dropdown",['$rootScope',function($rootScope){
	return {
		restrict: 'A',
		link: function(scope,element,attrs) {
			var parent=element.parent();
			var options=parent.find(".nb-options");

			var close=function(event){
				if(options.is(":visible") && options.css("visibility")!="hidden" && parent.hasClass("open")){
					parent.removeClass("open");
					event.preventDefault();
				}
			}
			
			element.bind("click",function(event){
				if(!parent.hasClass("open")){
					parent.addClass("open");
				}
				else
					close(event)

			});
			var prevent = function(ev) {
                ev.stopPropagation();
                ev.preventDefault();
                ev.returnValue = false;
                return false;
            }
			//prevent scroll propagation
			options.bind('DOMMouseScroll mousewheel', function(ev){ 
			    var $this = $(this),
                    scrollTop = this.scrollTop,
                    scrollHeight = this.scrollHeight,
                    height = $this.height(),
                    delta = (ev.type == 'DOMMouseScroll' ?
                        ev.originalEvent.detail * -40 :
                        ev.originalEvent.wheelDelta),
                    up = delta > 0;

                if (!up && -delta > scrollHeight - height - scrollTop) {
                    // Scrolling down, but this will take us past the bottom.
                    $this.scrollTop(scrollHeight);
                    return prevent(ev);
                } else if (up && delta > scrollTop) {
                    // Scrolling up, but this will take us past the top.
                    $this.scrollTop(0);
                    return prevent(ev);
                }
			});

			if(attrs.multipleValue){
				options.bind("click",function(event){
					event.stopPropagation();
				});
			}

			$(window).bind("click",function(event){
				close(event)
			});
		}
	};
}]);

