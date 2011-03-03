/**
 * @name jQuery imageView plugin
 * @license GPL
 * @version 0.0.4
 * @date September 16, 2010
 * @category jQuery plugin
 * @author Kotelnitskiy Evgeniy (evgennniy@gmail.com)
 * @copyright (c) 2010 Kotelnitskiy Evgeniy (http://4coder.info/en/)
 * @example Visit http://4coder.info/en/ for more informations about this jQuery plugin
 */
image_view_last_id = 0;
(function($) {
    jQuery.fn.imageView = function(settings) {
        // Find Elements
        var $container = this;
        if ($container.length == 0) return false;
        var container = $container[0];
        var $img = $('img', container);
        var img = $img[0];
		
        if (! $img.attr('id')) {
            image_view_last_id ++;
            $img.attr('id', 'image_view_' + image_view_last_id);
        }
        var id = $img.attr('id');

        // Settings
        settings = jQuery.extend({
            width: 500,
            height: 400,
            fullsize: $img.attr('rel'),
            mousewheel: false
        },settings);
        settings['src'] = $img.attr('src');
		
        $img.data('mousedown', false);
        $img.data('cannot_minimize', false);
        $img.data('state', 0);

        // CSS
        $container.addClass('iv-loading');
        $container.width(settings['width']);
        $container.height(settings['height']);
        $container.css('overflow', 'hidden');
        $container.css('position', 'relative');

        $img.css('visibility', 'hidden');
        $img.css('position', 'absolute');
        $img.css('left', 0);
        $img.css('top', 0);

        if (img.complete) {
            setTimeout(function(){
                loaded();
            }, 100);
        }
        else {
            $(img).one('load', function(){
                loaded();
            });
        }

        function loaded(){
            settings['imgwidth'] = $img.width();
            settings['imgheight'] = $img.height();
			
			$img.css('left', settings['width'] / 2 - $img.width() / 2);
			$img.css('top', settings['height'] / 2 - $img.height() / 2);

            // Events
            $container.click(function(){
                if ($img.data('state') == 0) {
					// zoom in
					$container.addClass('iv-loading');
                    $img.attr('src', settings['fullsize']);
					settings['loading'] = true;
					cursor();

					$img.one('load', function(){
						$container.removeClass('iv-cache');
						$img.css('left', settings['width'] / 2 - $img.width() / 2);
						$img.css('top', settings['height'] / 2 - $img.height() / 2);
						$container.removeClass('iv-loading');
						settings['loading'] = false;
						$img.data('state', 1);
						cursor();
					});
                }
                else if (! $img.data('cannot_minimize')) {
					// zoom out
                    $img.attr('src', settings['src']);
					settings['loading'] = true;
					cursor();
                    
                    if (img.complete) {
						$img.css('left', settings['width'] / 2 - $img.width() / 2);
						$img.css('top', settings['height'] / 2 - $img.height() / 2);
                        $img.data('state', 0);
						settings['loading'] = false;
						cursor();
                    }
                    else {
                        $container.addClass('iv-loading');
                        $img.one('load', function(){
                            $container.removeClass('iv-loading');
							$img.css('left', settings['width'] / 2 - $img.width() / 2);
							$img.css('top', settings['height'] / 2 - $img.height() / 2);
                            $img.data('state', 0);
							settings['loading'] = false;
							cursor();
                        });
                    }
                }
                return false;
            });

            $img.bind('mousedown.imgview', function(event){
                $img.data('mousedown', true);
                $img.data('cannot_minimize', false);
                settings['pageX'] = event.pageX;
                settings['pageY'] = event.pageY;
                return false;
            });

            $(document).bind('mouseup.imgview', function(event){
                $img.data('mousedown', false);
                return false;
            });

            $(document).bind('mousemove.imgview', function(event){
                if ($img.data('mousedown') && ($img.data('state') == 1) && (! settings['loading'])){
                    var dx = event.pageX - settings['pageX'];
                    var dy = event.pageY - settings['pageY'];
                    if ((dx == 0) && (dy == 0)){
                        return false;
                    }

                    var newX = parseInt($img.css('left')) + dx;
                    if (newX > 0) newX = 0;
                    if (newX < settings['width'] - $img.width())
                        newX = settings['width'] - $img.width() + 1;
                    var newY = parseInt($img.css('top')) + dy;
                    if (newY > 0) newY = 0;
                    if (newY < settings['height'] - $img.height())
                        newY = settings['height'] - $img.height() + 1;
						
					if (settings['width'] >= $img.width()) {
						newX = settings['width'] / 2 - $img.width() / 2;
					}
					if (settings['height'] >= $img.height()) {
						newY = settings['height'] / 2 - $img.height() / 2;
					}
					
                    $img.css('left', newX + 'px');
                    $img.css('top', newY + 'px');

                    settings['pageX'] = event.pageX;
                    settings['pageY'] = event.pageY;
                    $img.data('cannot_minimize', true);
                }
                return false;
            });

			function cursor(){
				if (settings['loading']) {
					$container.css('cursor', 'progress'); 
				}
				else {
					if ($img.data('state') == 0) {
					
						if ($.browser.mozilla){
							$container.css('cursor', '-moz-zoom-in'); 
						}
						else {
							$container.css('cursor', 'pointer');
						}
					}
					else {
						$container.css('cursor', 'move'); 
					}
				}
			}
			
            // Finalize
            $img.css('visibility', 'visible');
            $container.removeClass('iv-loading');
			cursor();
        }
    };
})(jQuery); 