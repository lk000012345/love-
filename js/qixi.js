	var a=$('#content');
	var b=a.find(':first');//ul
	var slides=b.find('>li');//3个li
	// 获取容器尺寸
	var width=a.width();
	var height=a.height();
	// 设置li页面总宽度
	b.css({
		width:(slides.length*width)+'px',
		height:height+'px'
	})

	// 设置每个li的宽度
	$.each(slides,function(index){
		var slide=slides.eq(index);
		slide.css({
			width:width+'px',
			height:height+'px'
		})
	})

	// 定位小男孩的位置
	var pathY=$('.a_background_middle').position().top+$('.a_background_middle').height()/2;
	var boy=$('#boy');
	var boyHeight=boy.height();
	boy.css({
		top:pathY-boyHeight+25
	});
	//定位女孩位置
	var bridgeY=$('.c_background_middle').position().top;
	var girl = {
		elem:$('.girl'),
		getHeight:function(){
			return this.elem.height();
		},
		setOffset:function(){
			this.elem.css({
				left:width/2,
				top:bridgeY-this.getHeight()
			})
		},
		getOffset: function() {
            return this.elem.offset();
        },
        getWidth: function() {
            return this.elem.width();
        },
        rotate:function(){
        	this.elem.addClass('girl-rotate')
        }
	}
	girl.setOffset();

	// 男孩移动
	/*$('#content').click(function(){
		boy.animate({'left':(slides.length-1)*width+'px'},10000);
		boy.addClass('slowWalk')*/

   /*		b.css({
			'transition':'5000ms linear',
			'transform':'translate3d(-'+(width*2)+'px,0px,0px)'
		})*/

	////////
	//动画//
	////////
function Qixi(){
	var boys=boyWalk();
	 boys.walkTo(6000, 0.6).then(function() {
        scrollTo(6500, 1);
        return boys.walkTo(6500, 0.5)
    }).then(function() {
        bird.fly()
    }).then(function() {
        boys.stopWalk();
        return openDoor();
    }).then(function(){
    	lamp.bright();
    	return boys.toShop(850);
    }).then(function(){
    	return boys.takeflower();
    }).then(function(){
    	return boys.outShop(850);
    }).then(function(){
        girl.setOffset();
        scrollTo(6500, 2);
        return boys.walkTo(6500, 0.15)
    }).then(function() {
        return boys.walkTo(3000, 0.25, (bridgeY - girl.getHeight()) / height)
    }).then(function() {
        var proportionX = (girl.getOffset().left - boys.getWidth() + girl.getWidth() / 5) / width;
        return boys.walkTo(2000, proportionX)
    }).then(function() {
        boys.resetOriginal();
        setTimeout(function() {
            girl.rotate();
            boys.rotate(function() {
                snowflake()
            })
        },
        850)
    });
	function boyWalk(){
		// 恢复运动
		function restoreWalk(){
			/*boy.addClass('slowWalk').stop().animate({
				'left':width+'px'
			},10000).removeClass('pauseWalk')*/
			boy.removeClass('pauseWalk')
		}
		//暂停运动
		function pauseWalk(){
			boy.stop();
			boy.addClass('pauseWalk')
		}
		// css3动作变化
		function slowWalk(){
			boy.addClass('slowWalk');
		}
		// 计算移动距离
		function calculateDist(direction,proportion){
			return (direction=="x"?width:height)*proportion;
		}
		// 用transition做运动
		function startRun(options,runTime){
			var dtd=$.Deferred();
			restoreWalk();
			// 运动的属性
			boy.transition(options,runTime,'linear',function(){
				dtd.resolve();
			})
			return dtd;
		}
		//走进商店
		function walkToShop(runTime){
			var defer = $.Deferred();
			var doorObj = $('.door');
			//门的坐标
			var offsetDoor = doorObj.offset();
			var doorOffsetLeft = offsetDoor.left;
			//小孩当前的坐标
			var offsetBoy = boy.offset();
			var boyOffsetLeft = offsetBoy.left;
			//当前需要移动的坐标
			instanceX = (doorOffsetLeft + doorObj.width()/2)-(boyOffsetLeft+boy.width()/2);
			//开始走路
			var walkShop=startRun({transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)',opacity:0.1},runTime);
			//走路完毕
			walkShop.done(function(){
				boy.css({
					opacity:0
				})
				defer.resolve();
			})
			return defer;
		}
		 // 取花
		function takeFlower(){
			var defer=$.Deferred();
			setTimeout(function(){
				boy.addClass('slowFlowerWalk');
				defer.resolve();
			},850)
			return defer;
		}
		// 走出商店
		function outToShop(runTime){
			var defer = $.Deferred();
			restoreWalk();
			var walkShop = startRun({transform: 'translateX(' + instanceX + 'px),scale(1,1)',opacity:'1'},runTime)
			walkShop.done(function(){
				defer.resolve();
			})
			return defer;
		}
		// 开始走路
		function walkRun(time,distX,distY){
			time=time||3000;
			// 脚动作
			slowWalk();
			// 走路
			var d1=startRun({
				'left':distX+'px',
				'top':distY?distY:undefined
			},time,0,1)
			return d1;	
		}
		return{
			//开始走路
			walkTo:function(time,proportionX,proportionY){
				var distX=calculateDist('x',proportionX);
				var distY=calculateDist('y',proportionY);
				return walkRun(time,distX,distY);
			},
			//走进商店
			toShop:function(){
				return walkToShop.apply(null,arguments);
			},
			// 出商店
			outShop:function(){
				return outToShop.apply(null,arguments);
			},
			// 停止运动
			stopWalk:function(){
				pauseWalk();
			},
			setColor:function(value){
				boy.css('background-color',value)
			},
			// 取花
			takeflower:function(){
				return takeFlower();
			},
			// 获取男孩的宽度
	        getWidth: function() {
	            return boy.width();
	        },
	        resetOriginal: function() {
	            this.stopWalk();
	            // 恢复图片
	            boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
			},
			// 转身动作
	        rotate: function(callback) {
	           restoreWalk();
	           boy.addClass('boy-rotate');
	           // 监听转身完毕
	           if (callback) {
	                boy.on(animationEnd, function() {
	                   callback();
	                   $(this).off();
	               })
	           }
	        },
		}
	}
	var animationEnd = (function() {
        var explorer = navigator.userAgent;
        if (~explorer.indexOf("WebKit")) {
            return "webkitAnimationEnd"
        }
        return "animationend"
    })();
	function scrollTo(time,proportion){
		$('.content-wrap').animate({
			'left':'-'+width*proportion+'px'
		},time)
	}
	//开关门动画
	function doorAction(left, right, time) {
	    var door = $('.door');
	    var doorLeft = $('.door_left');
	    var doorRight = $('.door_right');
	    var defer = $.Deferred();
	    var count = 2;
	    // 等待开门完成
	    var complete = function() {         
	        if (count == 1) {
	            defer.resolve();
	            return;
	        }
	        count--;
	    };
	    doorLeft.animate({
	        'left': left
	    }, time, complete); 
	    doorRight.animate({
	        'left': right
	    }, time, complete); 
	    return defer;
	}
	// 开门
	function openDoor() {
	    return doorAction('-50%', '100%', 2000);
	}
	// 关门
	function shutDoor() {
	    return doorAction('0%', '50%', 2000);
	}

	// 灯动画
	var lamp={
		elem:$('.b_background'),
		bright:function(){
			this.elem.addClass('lamp_bright');
		},
		dark:function(){
			this.elem.removeClass('lamp_bright')
		}
	}
	// 飞鸟
	var bird = {
		elem:$('.bird'),
		fly:function(){
			this.elem.addClass('birdFly');
			this.elem.transition({
				right:width
			},10000,'linear')
		}
	}
	// 飘红花
	var snowflakeURl = [
	        'images/snowflake/snowflake1.png',
	        'images/snowflake/snowflake2.png',
	        'images/snowflake/snowflake3.png',
	        'images/snowflake/snowflake4.png',
	        'images/snowflake/snowflake5.png',
	        'images/snowflake/snowflake6.png'
	    ]

	///////
	//飘雪花 //
	///////
	function snowflake() {
	    // 雪花容器
	    var $flakeContainer = $('#snowflake');

	    // 随机六张图
	    function getImagesName() {
	        return snowflakeURl[[Math.floor(Math.random() * 6)]];
	    }
	    // 创建一个雪花元素
	    function createSnowBox() {
	        var url = getImagesName();
	        return $('<div class="snowbox" />').css({
	            'width': 41,
	            'height': 41,
	            'position': 'absolute',
	            'background-size': 'cover',
	            'z-index': 100000,
	            'top': '-41px',
	            'backgroundImage': 'url(' + url + ')'
	        }).addClass('snowRoll');
	    }
	    // 开始飘花 
	    setInterval(function() {
	        // 运动的轨迹
	        var startPositionLeft = Math.random() * width - 100,
	            startOpacity    = 1,
	            endPositionTop  = height - 40,
	            endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
	            duration        = height * 10 + Math.random() * 5000;

	        // 随机透明度，不小于0.5
	        var randomStart = Math.random();
	        randomStart = randomStart < 0.5 ? startOpacity : randomStart;

	        // 创建一个雪花
	        var $flake = createSnowBox();

	        // 设计起点位置
	        $flake.css({
	            left: startPositionLeft,
	            opacity : randomStart
	        });

	        // 加入到容器
	        $flakeContainer.append($flake);

	        // 开始执行动画
	        $flake.transition({
	            top: endPositionTop,
	            left: endPositionLeft,
	            opacity: 0.7
	        }, duration, 'ease-out', function() {
	            $(this).remove() //结束后删除
	        });
	        
	    }, 200); 
	}
// 音乐配置
    var audioConfig = {
        enable: true,// 是否开启音乐
        playURl: "music/happy.wav",// 正常播放地址
        cycleURL: "music/circulation.wav" // 正常循环播放地址
    }
	/////////
	//背景音乐 //
	/////////
	function Hmlt5Audio(url, isloop) {
	    var audio = new Audio(url);
	    audio.autoPlay = true;
	    audio.loop = isloop || false;
	    audio.play();
	    return {
	        end: function(callback) {
	            audio.addEventListener('ended', function() {
	                callback();
	            }, false);
	        }
	    }; 
	}
	var audio1 = Hmlt5Audio(audioConfig.playURl);
    audio1.end(function() {
        Hmlt5Audio(audioConfig.cycleURL, true);
    });
}

$(document).click(function(){
	Qixi();
})	

