# Carousel
透明幻灯片，轮播，支持自动播放、点击播放 Slider

html结构不可变
li的个数为奇数

在J_poster上配置参数data-setting

data-setting参数说明：{
  "width":1000,//幻灯片的宽度
	"height":480,//幻灯片的高度
	"posterWidth":640,//第一帧的宽度
	"posterHeight":480,//第一帧的高度
	"speed":1000,//点击切换按钮的切换速度
	"scale":0.9,//下一帧相对于前一帧的比例
	"verticalAlign":"middle",//垂直对齐方式
	"autoPlay":true,//自动播放
	"delay":2000//播放时间间隔
}
