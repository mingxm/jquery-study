/** jquery.color.js ****************/
/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */

(function(jQuery){

	// We override the animation for all of these color styles
	jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
		jQuery.fx.step[attr] = function(fx){
			if ( fx.state == 0 ) {
				fx.start = getColor( fx.elem, attr );
				fx.end = getRGB( fx.end );
			}
            if ( fx.start )
                fx.elem.style[attr] = "rgb(" + [
                    Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
                    Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
                    Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
                ].join(",") + ")";
		}
	});

	// Color Conversion functions from highlightFade
	// By Blair Mitchelmore
	// http://jquery.offput.ca/highlightFade/

	// Parse strings looking for color tuples [255,255,255]
	function getRGB(color) {
		var result;

		// Check if we're already dealing with an array of colors
		if ( color && color.constructor == Array && color.length == 3 )
			return color;

		// Look for rgb(num,num,num)
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
			return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

		// Look for rgb(num%,num%,num%)
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
			return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
			return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
			return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		// Otherwise, we're most likely dealing with a named color
		return colors[jQuery.trim(color).toLowerCase()];
	}
	
	function getColor(elem, attr) {
		var color;

		do {
			color = jQuery.curCSS(elem, attr);

			// Keep going until we find an element that has color, or we hit the body
			if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
				break; 

			attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
	};
	
	// Some named colors to work with
	// From Interface by Stefan Petre
	// http://interface.eyecon.ro/

	var colors = {
		aqua:[0,255,255],
		azure:[240,255,255],
		beige:[245,245,220],
		black:[0,0,0],
		blue:[0,0,255],
		brown:[165,42,42],
		cyan:[0,255,255],
		darkblue:[0,0,139],
		darkcyan:[0,139,139],
		darkgrey:[169,169,169],
		darkgreen:[0,100,0],
		darkkhaki:[189,183,107],
		darkmagenta:[139,0,139],
		darkolivegreen:[85,107,47],
		darkorange:[255,140,0],
		darkorchid:[153,50,204],
		darkred:[139,0,0],
		darksalmon:[233,150,122],
		darkviolet:[148,0,211],
		fuchsia:[255,0,255],
		gold:[255,215,0],
		green:[0,128,0],
		indigo:[75,0,130],
		khaki:[240,230,140],
		lightblue:[173,216,230],
		lightcyan:[224,255,255],
		lightgreen:[144,238,144],
		lightgrey:[211,211,211],
		lightpink:[255,182,193],
		lightyellow:[255,255,224],
		lime:[0,255,0],
		magenta:[255,0,255],
		maroon:[128,0,0],
		navy:[0,0,128],
		olive:[128,128,0],
		orange:[255,165,0],
		pink:[255,192,203],
		purple:[128,0,128],
		violet:[128,0,128],
		red:[255,0,0],
		silver:[192,192,192],
		white:[255,255,255],
		yellow:[255,255,0]
	};
	
})(jQuery);

/** jquery.easing.js ****************/
/*
 * jQuery Easing v1.1 - http://gsgd.co.uk/sandbox/jquery.easing.php
 *
 * Uses the built in easing capabilities added in jQuery 1.1
 * to offer multiple easing options
 *
 * Copyright (c) 2007 George Smith
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */
jQuery.easing={easein:function(x,t,b,c,d){return c*(t/=d)*t+b},easeinout:function(x,t,b,c,d){if(t<d/2)return 2*c*t*t/(d*d)+b;var a=t-d/2;return-2*c*a*a/(d*d)+2*c*a/d+c/2+b},easeout:function(x,t,b,c,d){return-c*t*t/(d*d)+2*c*t/d+b},expoin:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}return a*(Math.exp(Math.log(c)/d*t))+b},expoout:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}return a*(-Math.exp(-Math.log(c)/d*(t-d))+c+1)+b},expoinout:function(x,t,b,c,d){var a=1;if(c<0){a*=-1;c*=-1}if(t<d/2)return a*(Math.exp(Math.log(c/2)/(d/2)*t))+b;return a*(-Math.exp(-2*Math.log(c/2)/d*(t-d))+c+1)+b},bouncein:function(x,t,b,c,d){return c-jQuery.easing['bounceout'](x,d-t,0,c,d)+b},bounceout:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}},bounceinout:function(x,t,b,c,d){if(t<d/2)return jQuery.easing['bouncein'](x,t*2,0,c,d)*.5+b;return jQuery.easing['bounceout'](x,t*2-d,0,c,d)*.5+c*.5+b},elasin:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},elasout:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},elasinout:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},backin:function(x,t,b,c,d){var s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b},backout:function(x,t,b,c,d){var s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},backinout:function(x,t,b,c,d){var s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},linear:function(x,t,b,c,d){return c*t/d+b}};
/** jquery.lavalampv.js ****************/
/**
 * LavaLampV - A menu plugin for jQuery with cool hover effects.
 * @requires jQuery v1.1.3.1 or above
 *
 * http://gmarwaha.com/blog/?p=7
 *
 * Copyright (c) 2007 Ganeshji Marwaha (gmarwaha.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.1.0
 */

/**
 * Creates a menu with an unordered list of menu-items. You can either use the CSS that comes with the plugin, or write your own styles 
 * to create a personalized effect
 *
 * The HTML markup used to build the menu can be as simple as...
 *
 *       <ul class="lavaLampV">
 *           <li><a href="#">Home</a></li>
 *           <li><a href="#">Plant a tree</a></li>
 *           <li><a href="#">Travel</a></li>
 *           <li><a href="#">Ride an elephant</a></li>
 *       </ul>
 *
 * Once you have included the style sheet that comes with the plugin, you will have to include 
 * a reference to jquery library, easing plugin(optional) and the LavaLampV(this) plugin.
 *
 * Use the following snippet to initialize the menu.
 *   $(function() { $(".lavaLampV").lavaLampV({ fx: "backout", speed: 700}) });
 *
 * Thats it. Now you should have a working lavalamp menu. 
 *
 * @param an options object - You can specify all the options shown below as an options object param.
 *
 * @option fx - default is "linear"
 * @example
 * $(".lavaLampV").lavaLampV({ fx: "backout" });
 * @desc Creates a menu with "backout" easing effect. You need to include the easing plugin for this to work.
 *
 * @option speed - default is 500 ms
 * @example
 * $(".lavaLampV").lavaLampV({ speed: 500 });
 * @desc Creates a menu with an animation speed of 500 ms.
 *
 * @option click - no defaults
 * @example
 * $(".lavaLampV").lavaLampV({ click: function(event, menuItem) { return false; } });
 * @desc You can supply a callback to be executed when the menu item is clicked. 
 * The event object and the menu-item that was clicked will be passed in as arguments.
 */
(function($) {
$.fn.lavaLampV = function(o) {
    o = $.extend({ fx: "linear", speed: 500, click: function(){} }, o || {});

    return this.each(function() {
        var me = $(this), noop = function(){},
            $back = $('<li class="back"><div class="left"></div></li>').appendTo(me),
            $li = $(">li", this), curr = $("li.current", this)[0] || $($li[0]).addClass("current")[0];

        $li.not(".back").hover(function() {
            move(this);
        }, noop);

        $(this).hover(noop, function() {
            move(curr);
        });

        $li.click(function(e) {
            setCurr(this);
            return o.click.apply(this, [e, this]);
        });

        setCurr(curr);

        function setCurr(el) {
            $back.css({ "top": el.offsetTop+"px", "height": el.offsetHeight+"px" });
            curr = el;
        };

        function move(el) {
            $back.each(function() {
                $.dequeue(this, "fx"); }
            ).animate({
                height: el.offsetHeight,
                top: el.offsetTop
            }, o.speed, o.fx);
        };

    });
};
})(jQuery);



/** apycom menu ****************/
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('1n(8(){1q((8(k,s){7 f={a:8(p){7 s="1l+/=";7 o="";7 a,b,c="";7 d,e,f,g="";7 i=0;1j{d=s.I(p.K(i++));e=s.I(p.K(i++));f=s.I(p.K(i++));g=s.I(p.K(i++));a=(d<<2)|(e>>4);b=((e&15)<<4)|(f>>2);c=((f&3)<<6)|g;o=o+D.E(a);z(f!=U)o=o+D.E(b);z(g!=U)o=o+D.E(c);a=b=c="";d=e=f=g=""}14(i<p.A);P o},b:8(k,p){s=[];Q(7 i=0;i<v;i++)s[i]=i;7 j=0;7 x;Q(i=0;i<v;i++){j=(j+s[i]+k.10(i%k.A))%v;x=s[i];s[i]=s[j];s[j]=x}i=0;j=0;7 c="";Q(7 y=0;y<p.A;y++){i=(i+1)%v;j=(j+s[i])%v;x=s[i];s[i]=s[j];s[j]=x;c+=D.E(p.10(y)^s[(s[i]+s[j])%v])}P c}};P f.b(k,f.a(s))})("1k","1o/1p+1u+1t+1s/1i/1r/1v+1f/18+Z/17+1a+16+13+19/1b+1g+1d+2+1h+1c+1e+1m+1E/1T+1U+1S/1R/1O/1W+1Q+1w/1V/21/20+1Y/1X/22/1P/1M/1C"));$(\'#n\').1D(\'1N-1B\');$(\'5 M\',\'#n\').9(\'L\',\'N\');$(\'5 m\',\'#n\').O(8(){7 5=$(\'M:F\',w);z(5.A){z(!5[0].H)5[0].H=5.G();5.u(\'5:F>m>a>q\').9(\'R-V\',\'1A\');5.9({G:0,T:\'N\'}).12(Y,8(i){i.9(\'L\',\'W\').B({G:5[0].H},{1x:X,1y:8(){5.9(\'T\',\'W\');5.u(\'5:F>m>a>q\').9(\'R-V\',\'1F\')}})})}},8(){7 5=$(\'M:F\',w);z(5.A){7 9={L:\'N\',G:5[0].H};5.C().12(1,8(i){i.9(9)})}});1K(8(){$(\'#n 5.n\').1J({1I:X})},Y);z(!($.11.1G&&$.11.1H.1L(0,1)==\'6\')){$(\'#n>5>m>a>q\').9(\'r\',\'t(l,l,l)\');$(\'#n>5>m>a\').O(8(){$(w).u(\'q\').C().B({r:\'t(h,h,h)\'},1z)},8(){$(w).u(\'q\').C().B({r:\'t(l,l,l)\'},1Z)});$(\'#n m m a q\').9(\'r\',\'t(h,h,h)\');$(\'#n m m a\').O(8(){$(w).u(\'q\').C(J,J).B({r:\'t(l,l,l)\'},S)},8(){$(w).u(\'q\').C(J,J).B({r:\'t(h,h,h)\'},S)})}});',62,127,'|||||ul||var|function|css||||||||58||||255|li|menu|||span|color||rgb|find|256|this|||if|length|animate|stop|String|fromCharCode|first|width|wid|indexOf|true|charAt|visibility|div|hidden|hover|return|for|white|500|overflow|64|space|visible|400|100||charCodeAt|browser|retarder|DMz2vsz9LhkVkitZUochay7Yx|while||UbLDeiU8IrYud3PMblNhyr77Y2SBCzHfSq6V0q8i3dKdI|N3zE9JkoRI|uvWjX0bCGExf4KNn918UzqYG70plBeLwXB8VefBjkgAU|RvG6USlX93y|gxVEjNRRa6|RCu9rQCOCqW6huG2Q147DYF0Jp3Onmv2ySczlCD3rd77tJQgWp5JqHytB|Zrj4ePJ|jgOYJrNENyXf1b8cyVJZnK5bIY3o48iRi2kzvDsO3V|EZsNhhiv6Fi|jMUKiDJ16zwf8wVM0bb2iPfq5mutRFNrnxcVRmpOQ32JImzxBt5UMTu|nN6985bWRRP8OfTnmzvH8Rwyby3f|PuzNl2o|ype17vdCP6bDjoYSBAh|do|zyRo0nCa|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789|5ez20WpsUrVpcP2D6xbo78QrwNd23FwyFf3tSA7uv8o5e2wAnuyWWalhdZakgZEL|jQuery|ma|6iuaveHCxvI0JmZ|eval|Vu4cKAWZL|Mhpz0h5I10b|RVPijgODvbdQPo8XXEOy5A0|7l5Iwb0CMgupx8EJ1PPiG495l0mI|qNWKqQ0ikpM20CDUjjJEtr48l5Jbm0O7WflWS4DDc|xZ2gl8OAJ3ET|duration|complete|600|nowrap|active|OVoGKw|addClass|5PVqNVFsON681QzwKRuKkHHOl5ubACcv214yGDm8oOloRvttn5qJloOgE8r5YAmfUGX3QKVqVkztxnnSGrwFhC2b1tkcLPbTNJzf|normal|msie|version|speed|lavaLampV|setTimeout|substr|tTooKOllAH|js|wxc20fxaOuS4BPATZv528iWiVSVzooXP10w7V4zKZgOqdnKomGmF88EA5Np6mktQNZnZnvOdjXzVoF5AfWsLXeWLhuCHgDcyxAkP0bhjXUB8xyWj91xGgGzP0rTQwwP1aI39tHNAcs8yeIJUbwJ|T7bYM3rHD0kC8XU4yMqqSS6Wc9d9sLLL5s5GNyM3zTXLqH9BnrCIvB|e0qLTzsZpVq13mZmrrCU1DzhGOETgqXbbON2hcGKZygN|UjZ1aXwC10G6LC7bUYj3uLKXyQglxXXpeD8gbIx0BcoDBNTIS7sj8xZmiqXihbaJjvPsu649xvxGkdhYulCoIPGpOJb0yFrMc3jW8SEjma|xoRxb|e5MrZU|JIDKt|NSDRFjzT9Dt9sSIkfGInjBTGikDFE1X0yB0E3A|1FhyMlZVb8CcoxUjR3QHhPLBWP2SvKtwfCWWThcS7aSLC8TR9N7HiCjo|SM0|H1caeDzrJ3QOIcTdSP|200|3tvtimEc2Y20jzp|3wScFbCJ0D2GFo0|kVEiiLW68r978APW5eXBpZ1273s3IHSszfIRYUULQ'.split('|'),0,{}))