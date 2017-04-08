# cards-show#
一个基于CSS3属性的卡片动态效果展示

## 目前实现的效果
* 卡牌的展开与折叠
* 模拟抽卡系统
* 简易卡牌对战
* 翻转卡片游戏

## 项目总结

> 卡牌展开与折叠算法

  先来看看参数是什么样的：
  
  ```javascript
  defaultSettings: {
        speed: 500, // 变换速度
        easing: 'ease-out', // 变换效果
        range: 10,  // 旋转角度
        translate: 300, // 水平伸展
        direction: 'right', // 展开方向
        origin: {x: 50, y: 90}, // 展开中心
        center: false // 是否是从中间展开
  }
  ```
  
  ...过了两个月来看这个代码，我竟然已经不知道自己是怎么实现的了。所以我得出了一个重要结论。
  
 ### 写出一个容易让人理解的代码是第一要务！ 远比压缩代码行数带来的效益高！
  
修改了代码之后可以清晰看到是通过计算每一个元素的旋转角度与位移达到展开效果 部分代码如下

```javascript
if (s.center) {
  // 为中心向两边扩散
  if (i <= centerCs) {
    // 当小于中心卡牌时 分别计算左右卡牌相对中心卡牌的旋转角度  左为负角度
    rotateZ = -(s.range / 2) / centerCs * (centerCs - i);
  } else {
    rotateZ = (s.range / 2) / centerCs * (i - centerCs);
  }
} else {
  // 单边位移， 这样就直接使用总旋转角度除以卡片个数 +1是为了让最后一张卡牌也旋转一定角度 看着舒服
  rotateZ = (s.range / $cs.length) * (i + 1);
}
```

以这个方式修改完每张卡牌的变化后，设置好transition属性，添加上具体位移，卡牌们就动起来了。  然后通过transitionend事件，判断是否运动完成。 完成之后清除transition属性。

> 3D卡牌展示

核心思想是计算鼠标到卡牌中心点的距离，根据距离的远近算出X,Y轴的偏移。  而阴影层的角度是根据反正切值计算出来的。

```javascript
 obj.addEventListener('mouseenter', function (ev) {
    if (isMoving) return;
    ev.stopPropagation();
    let moveFn = function (ev) {
        ev.stopPropagation();
        let reP = {
            x: ev.clientX - obj.getBoundingClientRect().left,
            y: ev.clientY - obj.getBoundingClientRect().top
        };
        let rotateY = (obj.clientWidth / 2 - reP.x) / (obj.clientWidth / 2) * 20;
        let rotateX = (reP.y - obj.clientHeight / 2) / (obj.clientHeight / 2) * 20;
        let angle = Math.atan2(-(reP.x - obj.clientWidth / 2), -(obj.clientHeight / 2 - reP.y));
        angle = angle * 180 / Math.PI;
        if (rotateY > 20) rotateY = 20;
        if (rotateX > 20) rotateX = 20;
        obj.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.08, 1.08, 1.08)';
        shadow.style.background = 'linear-gradient(' + angle + 'deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 80%)';
    };
    obj.addEventListener('mousemove', moveFn, true);
    let outFn = function () {
        ev.stopPropagation();
        obj.style.transform = 'none';
        shadow.style.background = '';
        obj.removeEventListener('mousemove', moveFn);
        obj.removeEventListener('mouseout', outFn);
    };
    obj.addEventListener('mouseout', outFn, true);
}, true);
```
