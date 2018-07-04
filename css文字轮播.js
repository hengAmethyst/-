/**
 * html
 */
<div class="outer">
    <ul id="J_scroll">
        <li>1.这是第一条数据</li>
        <li>2.这是第二条数据</li>
        <!-- <li>1.这是第一条数据</li>  -->
    </ul>
    <ul id="J_scroll_1">
            <li>1.这是第一条数据</li>
            <li>2.这是第二条数据</li>
            <!-- <li>1.这是第一条数据</li>  -->
    </ul>
</div>
/**
 * style
 */
.outer{
    display: flex;
    width: 375px;
    height: 80px;
    overflow: hidden;
}
.outer ul{
    display:inline-block;
    height: 80px;
    -webkit-transform: translate3d(0, 0, 0); /* 3d渲染，开启硬件加速 */
    transform: translate3d(0, 0, 0);
    font-size: 0;  /* 使inline-block无默认间距 */
    white-space: nowrap; /* 超出不折行 */
}
.outer ul li{
    display: inline-block;
    padding-right: 50px;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    font-size: 24px;
}
.theanimation{
    animation:theanimation 5s infinite linear;
    -webkit-animation:theanimation 5s infinite linear;
}
.theanimation_1{
    animation:theanimation_1 5s infinite linear;
    -webkit-animation:theanimation_1 5s infinite linear;
}
@keyframes theanimation{
    from {
        transform:translateX(0%);
    } 
    to {
        transform:translateX(-100%);
    } 
}
/**
 * js
 */
$('#J_scroll').addClass('theanimation');
$('#J_scroll_1').addClass('theanimation');