/**
 * Created by Moudi on 2017/1/11.
 */
var lastOrigin = '50% 90%',
  isSpread = false;
var cm = {
  reset(cbk) {
    $cardC = $('#card-container');
    $cs = $('li', $cardC);
    let count = 0;
    let cbkFu = () => {
      if (typeof cbk === 'function') cbk();
    };
    if (!isSpread) {
      cbkFu();
      return;
    }
    for (let i = 0; i < $cs.length; i++) {
      let obj = $cs[i];
      obj.style.transition = '500ms';
      obj.style.transform = 'none';
      obj.style.transformOrigin = lastOrigin;
      let callback = () => {
        obj.style.transition = 'none';
        isSpread = false;
        obj.removeEventListener(getTransitionend(), callback);
        count++;
        if (count == $cs.length) {
          cbkFu();
        }
      };
      obj.addEventListener(getTransitionend(), callback);
    }
    return true;
  },
  transform2d(s) {
    s = s || this.defaultSettings;
    this.reset(function () {
      let centerCs = Math.floor($cs.length / 2); // 算出中心的卡牌序号
      for (let i = 0; i < $cs.length; i++) {
        let obj = $cs[i];
        let rotateZ = 0;
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
        let translateX = s.translate || 0; // X轴位移
        if (s.direction === 'left') {
          // 若是向左  改变旋转角度 反向位移
          rotateZ = -rotateZ;
          translateX = -translateX;
        }
        if (s.center) {
          if (i <= centerCs) {
            // 同理 算出每一个的位移
            translateX = -(translateX / 2) / centerCs * (centerCs - i);
          } else {
            translateX = (translateX / 2) / centerCs * (i - centerCs);
          }
        } else {
          translateX = translateX / $cs.length * i;
        }
        // 旋转中心点
        obj.style.transformOrigin = lastOrigin = s.origin.x + '% ' + s.origin.y + '%';
        obj.style.transition = s.speed + 'ms ' + s.easing + ' transform';
        obj.style.transform = 'translate(' + translateX + 'px) rotate(' + rotateZ + 'deg)';
        let callback = () => {
          obj.style.transition = 'none';
          isSpread = true;
          obj.removeEventListener(getTransitionend(), callback);
          return obj;
        };
        obj.addEventListener(getTransitionend(), callback);
      }
    });
  },
  nextCard() {
    this.reset(function () {
      let obj = $cs[$cs.length - 1];
      obj.classList.add('next-animation');
      let callback = () => {
        obj.classList.remove('next-animation');
        $cardC.insertBefore(obj, $cardC.children[0]);
        obj.removeEventListener(getAnimationend(), callback);
        return obj;
      };
      obj.addEventListener(getAnimationend(), callback);
    });
  },
  prevCard() {
    this.reset(function () {
      let obj = $cs[0];
      obj.classList.add('prev-animation');
      let callback = () => {
        obj.classList.remove('prev-animation');
        $cardC.appendChild(obj);
        obj.removeEventListener(getAnimationend(), callback);
        return obj;
      };
      obj.addEventListener(getAnimationend(), callback);
    });
  },
  defaultSettings: {
    speed: 500, // 变换速度
    easing: 'ease-out', // 变换效果
    range: 10,  // 旋转角度
    translate: 300, // 水平伸展
    direction: 'right', // 展开方向
    origin: {x: 50, y: 90}, // 展开中心
    center: false // 是否是从中间展开
  },
  right: {
    speed: 500,
    easing: 'ease-out',
    range: 90,
    direction: 'right',
    origin: {x: 50, y: 100},
    center: true,
    translate: 60
  },
  left: {
    speed: 500,
    easing: 'ease-out',
    range: 90,
    direction: 'left',
    origin: {x: 50, y: 100},
    center: true,
    translate: 60
  },
  horizontalSpread: {
    speed: 500,
    easing: 'ease-out',
    range: 100,
    direction: 'right',
    origin: {x: 50, y: 200},
    center: true
  },
  rightSpread: {
    speed: 500,
    easing: 'ease-out',
    range: 20,
    direction: 'right',
    origin: {x: 50, y: 200},
    center: false,
    translate: 300
  },
  leftSpread: {
    speed: 500,
    easing: 'ease-out',
    range: 20,
    direction: 'left',
    origin: {x: 50, y: 200},
    center: false,
    translate: 300
  },
  rotate360: {
    speed: 500,
    easing: 'ease-out',
    range: 360,
    direction: 'left',
    origin: {x: 50, y: 90},
    center: false
  },
  rotate330: {
    speed: 500,
    easing: 'ease-out',
    range: 330,
    direction: 'left',
    origin: {x: 50, y: 100},
    center: true
  }
};