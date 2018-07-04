/**
 * html部分
 */
<div id="demo" class="box">
  <div class="inner">
    <div id="tempate_1">
      <ul>
        <li>回收站里的文件删除了怎么恢复></li>
        <li>c盘哪些文件可以删除 系统就越来越慢怎么办</li>
        <li>电脑输入法切换不了怎么办</li>
      </ul>
    </div>
    <div id="tempate_2"></div>
  </div>
</div>

/**
 * css部分
 */
.box{
    overflow:hidden; 
    width:815px;
    .inner{
        width:200%;
        height:30px;
        ul{
            float:left; 
            height:30px; 
            overflow:hidden;
            zoom:1; 
            li{
                float:left;
                line-height:30px; 
                list-style:none;
            }
        }
    }
}
/**
 * js部分
 */
var demo = document.getElementById("demo");
  var tempate_1 = document.getElementById("tempate_1");
  var tempate_2 = document.getElementById("tempate_2");
      tempate_2.innerHTML=document.getElementById("tempate_1").innerHTML;
  function Marquee(){
    if(demo.scrollLeft-tempate_2.offsetWidth>=0){
      demo.scrollLeft-=tempate_1.offsetWidth;
    }
    else{
      demo.scrollLeft++;
    }
  }
  var inerval=setInterval(Marquee,10)
  demo.onmouseout=function (){
      
    inerval=setInterval(Marquee,10)
  }
  demo.onmouseover=function(){
    clearInterval(inerval)
  }