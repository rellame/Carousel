(function($){
	var Carousel = function(poster){
		//保存单个旋转木马对象
		var self = this;
		this.poster = poster;
		this.posterItemMain = poster.find("ul.poster-list");
		this.nextBtn = poster.find("div.poster-next-btn");
		this.prevBtn = poster.find("div.poster-prev-btn");
		this.posterItems = poster.find("li");
		this.posterFirstItem = this.posterItems.first();
		this.posterLastItem = this.posterItems.last();
		this.rotateFlag = true;//上一次旋转动画完成后才能进行下一次旋转
		//默认配置参数
		this.setting = {
			"width":1000,//幻灯片的宽度
			"height":480,//幻灯片的高度
			"posterWidth":640,//第一帧的宽度
			"posterHeight":480,//第一帧的高度
			"speed":1000,//点击切换按钮的切换速度
			"scale":0.9,//下一帧相对于前一帧的比例
			"verticalAlign":"middle",//垂直对齐方式
			"autoPlay":true,//自动播放
			"delay":2000//播放时间间隔
		};
		$.extend(this.setting,this.getSetting());
		this.setSettingValue();
		this.setPosterPos();
		this.nextBtn.click(function(){
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouselRoatate("left");
			}
			
		});
		this.prevBtn.click(function(){
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouselRoatate("right");
			}
		});
		//是否开启自动播放
		if(this.setting.autoPlay) {
			this.autoPlay();
			this.poster.hover(
				function(){
					window.clearInterval(self.timer);
				},
				function(){
					self.autoPlay();
			});
		}
	};
	Carousel.prototype = {
		//自动播放
		autoPlay : function(){
			var _this = this;
			this.timer = window.setInterval(function(){
				_this.nextBtn.click();
			},_this.setting.delay);
		},
		//点击下一帧按钮
		carouselRoatate : function(dir){
			var _this_ = this;
			var zIndexArr = [];//用于存放每一帧的z-index值
			if(dir == "left") {
				_this_.posterItems.each(function(i){
					var self = $(this),
					    prev = self.prev().get(0)? self.prev():_this_.posterLastItem,
					   width = prev.width(),
					  height = prev.height(),
					    left = prev.css("left"),
					     top = prev.css("top"),
					  zIndex = prev.css("zIndex"),
					 opacity = prev.css("opacity");
					 zIndexArr.push(zIndex);
					self.animate({//之前加了px单位反而出问题了
						width:width,
						height:height,
						left:left,
						top:top,
						opacity:opacity
					},_this_.setting.speed,function(){
						_this_.rotateFlag = true;
					});
				});
			}else if(dir == "right") {
				_this_.posterItems.each(function(i){
					var self = $(this),
					    next = self.next().get(0)? self.next():_this_.posterFirstItem,
					   width = next.width(),
					  height = next.height(),
					    left = next.css("left"),
					     top = next.css("top"),
					  zIndex = next.css("zIndex"),
					 opacity = next.css("opacity");
					 zIndexArr.push(zIndex);
					self.animate({//之前加了px单位反而出问题了
						width:width,
						height:height,
						left:left,
						top:top,
						opacity:opacity
					},_this_.setting.speed,function(){
						_this_.rotateFlag = true;
					});
				});
			}
			_this_.posterItems.each(function(i){//若将z-index写在动画过渡里，展示出来的将会是最后一帧的z-index
				$(this).css("zIndex",zIndexArr[i]);
			});
		},
		//设置垂直排列对齐
		setVerticalAlign : function(rh){
			var top = 0;
			var align = this.setting.verticalAlign;
			var height = this.setting.height;
			if (align == "middle") {
				top = (height - rh) / 2;
			}
			else if(align == "top") {
				top = 0;
			}
			else if(align == "bottom") {
				top = height - rh;
			}
			else {
				top = (height - rh) / 2;
			}
			return top;
		},
		//设置剩余的帧的位置
		setPosterPos : function(){
			var self = this;//放置each里的this使用出错
			var sliceItems = this.posterItems.slice(1),
				sliceSize  = sliceItems.size() / 2,
				leftSlice  = sliceItems.slice(sliceSize,sliceSize * 2),
				rightSlice = sliceItems.slice(0,sliceSize),
				level      = Math.floor(this.posterItems.size() / 2),//层级关系
				rw         = this.setting.posterWidth,
				rh         = this.setting.posterHeight,
				gap        = (this.setting.width - this.setting.posterWidth) / 2 / level; 
			var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
			var fixOffsetLeft  = firstLeft +rw;
			
			//设置右边帧的位置关系和高度宽度及top
			rightSlice.each(function(i){
				var j = i;
				level--;
				rw = rw * self.setting.scale;
				rh = rh * self.setting.scale;
				$(this).css({
					zIndex: level,
					width: rw,
					height: rh,
					left: fixOffsetLeft+(++j)*gap-rw,
					top: self.setVerticalAlign(rh),
					opacity: 1 / (++i)
				});
			});

			//设置左边帧的位置关系和高度宽度及top
			var oloop = Math.floor(self.posterItems.size() / 2);
			leftSlice.each(function(i){
				$(this).css({
					zIndex: level,
					width: rw,
					height: rh,
					left: i*gap,
					top: self.setVerticalAlign(rh),
					opacity: 1 / oloop
				});
				level++;
				oloop--;
				rw = rw / self.setting.scale;
				rh = rh / self.setting.scale;
			});
		},
		//设置配置参数控制基本的宽度高度
		setSettingValue : function(){
			this.poster.css({
				width:this.setting.width,
				height:this.setting.height
			});
			this.posterItemMain.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight
			});
			//计算上下切换按钮的宽度
			var w = (this.setting.width-this.setting.posterWidth) / 2;
			this.nextBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size() / 2)
			});
			this.prevBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size() / 2)
			});
			this.posterFirstItem.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				left:w,
				zIndex:Math.floor(this.posterItems.size() / 2)
			});

		},
		//获取人工配置参数
		getSetting : function(){
			var setting = this.poster.attr("data-setting");
			if(setting && setting !="") {
				return $.parseJSON(setting);
			}else {
				return {};
			} 
		}
	};
	Carousel.init = function(posters){
		var _this_ = this;
		posters.each(function(){
			new _this_($(this));
		});
	};
	window["Carousel"] = Carousel;
})(jQuery);