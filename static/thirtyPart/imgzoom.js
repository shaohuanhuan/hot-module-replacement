(function($){
	$.fn.magnifying = function(){
		var that = $(this),
		 // $imgCon = that.find('.img-box'),//正常图片容器
		 	// $Img = $imgCon.find('.img-main img'),//正常图片，还有放大图片集合
		   $imgCon = that.find('.img-main');
		var $Img = $imgCon.find('img'),
		   $Drag = that.find('.magnify-begin'),//拖动滑动容器
		   $show = that.find('.magnify-show'),//放大镜显示区域
		$showIMg = $show.find('img'),//放大镜图片
		$ImgList = that.find('.img-list > a >img'), //选中切换的小图
		multiple = $show.width()/$Drag.width();

		$imgCon.mousemove(function(e){
			$Drag.css('display','block');
			$show.css('display','block');
		    //获取坐标的两种方法
		   	// var iX = e.clientX - this.offsetLeft - $Drag.width()/2,
		   	// 	iY = e.clientY - this.offsetTop - $Drag.height()/2,	
		   	var iX = e.pageX - $(this).offset().left - $Drag.width()/2,
		   		iY = e.pageY - $(this).offset().top - $Drag.height()/2,	
		   		MaxX = $imgCon.width()-$Drag.width(),
		   		MaxY = $imgCon.height()-$Drag.height();
				
  	   	    /*这一部分可代替下面部分，判断最大最小值
		   	var DX = iX < MaxX ? iX > 0 ? iX : 0 : MaxX,
		   		DY = iY < MaxY ? iY > 0 ? iY : 0 : MaxY;
		   	$Drag.css({left:DX+'px',top:DY+'px'});	   		
		   	$showIMg.css({marginLeft:-3*DX+'px',marginTop:-3*DY+'px'});*/

		   	iX = iX > 0 ? iX : 0;
		   	iX = iX < MaxX ? iX : MaxX;
		   	iY = iY > 0 ? iY : 0;
		   	iY = iY < MaxY ? iY : MaxY;	
		   	$Drag.css({left:iX+'px',top:iY+'px'});	   		
		   	$showIMg.css({marginLeft:-multiple*iX+'px',marginTop:-multiple*iY+'px'});
		   	//return false;
		});
		$imgCon.mouseout(function(){
		   	$Drag.css('display','none');
			$show.css('display','none');
		});

		$ImgList.click(function(){
			var NowSrc = $(this).data('bigimg');
			// $Img.attr('src',NowSrc);
			$showIMg.attr('src',NowSrc);
			// $(this).parent().addClass('active').siblings().removeClass('active');
		});	
	}
	$("#main-pic").magnifying();
	/* 图片左右选择 产品详情*/
	var page = 1;
	var i =6; //每版放6个图片
	/**********向后 按钮*********/
	$("span.next").click(function(){    //绑定click事件
		var $parent = $(this).parents("div.v_show");//根据当前点击元素获取到父元素
		var $v_show = $parent.find("div.v_content_list"); //寻找到“视频内容展示区域”
		var $v_content = $parent.find("div.v_content"); //寻找到“视频内容展示区域”外围的DIV元素
		var v_width = $v_content.width() ;
		var len = $v_show.find("li").length;
		var page_count = Math.ceil(len / i) ;   //只要不是整数，就往大的方向取最小的整数
		if( !$v_show.is(":animated") ){    //判断“视频内容展示区域”是否正在处于动画
			if( page == page_count ){  //已经到最后一个版面了,如果再向后，必须跳转到第一个版面。
				$v_show.animate({ left : '0px'}, "slow"); //通过改变left值，跳转到第一个版面
				page = 1;
			}else{
				$v_show.animate({ left : '-='+v_width }, "slow");  //通过改变left值，达到每次换一个版面
				page++;
			}
		}
		$parent.find("span").eq((page-1)).addClass("current").siblings().removeClass("current");
	});
	/**********往前 按钮*********/
	$("span.prev").click(function(){
		var $parent = $(this).parents("div.v_show");//根据当前点击元素获取到父元素
		var $v_show = $parent.find("div.v_content_list"); //寻找到“视频内容展示区域”
		var $v_content = $parent.find("div.v_content"); //寻找到“视频内容展示区域”外围的DIV元素
		var v_width = $v_content.width();
		var len = $v_show.find("li").length;
		var page_count = Math.ceil(len / i) ;   //只要不是整数，就往大的方向取最小的整数
		if( !$v_show.is(":animated") ){    //判断“视频内容展示区域”是否正在处于动画
			if( page == 1 ){  //已经到第一个版面了,如果再向前，必须跳转到最后一个版面。
				$v_show.animate({ left : '-='+v_width*(page_count-1) }, "slow");
				page = page_count;
			}else{
				$v_show.animate({ left : '+='+v_width }, "slow");
				page--;
			}
		}
		$parent.find("span").eq((page-1)).addClass("current").siblings().removeClass("current");
	});

})(jQuery);