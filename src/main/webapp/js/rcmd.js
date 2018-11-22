function MouseWheelHandler(e, element) {
  var delta = 0;
  if (typeof e === 'number') {
    delta = e;
  } else {
    if (e.deltaX !== 0) {
      delta = e.deltaX;
    } else {
      delta = e.deltaY;
    }
    e.preventDefault();
  }

  element.scrollLeft -= (delta);

}

function Carousel(carouselId) {
  this.e = document.querySelector(carouselId);
  this.items = document.querySelector(carouselId + ' .items');
  this.leftScroll = document.querySelector(carouselId + ' .left-scroll-btn');
  this.rightScroll = document.querySelector(carouselId + ' .right-scroll-btn');

  var items = this.items;
  
  $(this.leftScroll).click(function() {
    var smoothScrollDelta = $(items)[0].clientWidth * 0.8;
    smoothScroll(smoothScrollDelta);
  });
  $(this.rightScroll).click(function() {
    var smoothScrollDelta = $(items)[0].clientWidth * 0.8;
    smoothScroll(-smoothScrollDelta);
  });
  
  function smoothScroll(move) {
    var element = $(items);
    console.log(element)
    var delta = element.scrollLeft() - move;
    console.log(delta)
    element.animate({
      scrollLeft: delta
    }, 500);
  };
}

Carousel.prototype.test = function() {
  console.log("okoko")
};

Carousel.prototype.handleMouse = function(e) {
  MouseWheelHandler(e, this.items);
};

Carousel.prototype.scrollEvent = function(e) {
  this.setLeftScrollOpacity();
  this.setRightScrollOpacity();
};

Carousel.prototype.setLeftScrollOpacity = function() {
  if (this.isScrolledAllLeft()) {
    this.leftScroll.style.opacity = 0;
  } else {
    this.leftScroll.style.opacity = 1;
  }
};

Carousel.prototype.isScrolledAllLeft = function() {
  if (this.items.scrollLeft === 0) {
    return true;
  } else {
    return false;
  }
};

Carousel.prototype.isScrolledAllRight = function() {
  if (this.items.scrollWidth > this.items.offsetWidth) {
    if (this.items.scrollLeft + this.items.offsetWidth === this.items.scrollWidth) {
      return true;
    } 
  }else {
    return true;
  }

  return false;
};

Carousel.prototype.setRightScrollOpacity = function() {
  if (this.isScrolledAllRight()){
    this.rightScroll.style.opacity = 0;
  } else {
    this.rightScroll.style.opacity = 1;
  }
};

var carousel1 = new Carousel('#carousel1');
carousel1.setLeftScrollOpacity();
carousel1.setRightScrollOpacity();

var carousel2 = new Carousel('#carousel2');
carousel2.setLeftScrollOpacity();
carousel2.setRightScrollOpacity();

function click() {
  console.log('clicked');
}

function toDetail(id) {
  console.log(id);
  window.location.href = '/app/sceneReview/review?mvno='+ id;
}

//------------------------------------ORIGINAL JavaScript-----------------------------------------//
/*
function MouseWheelHandler(e, element) {
  var delta = 0;
  if (typeof e === 'number') {
    delta = e;
  } else {
    if (e.deltaX !== 0) {
      delta = e.deltaX;
    } else {
      delta = e.deltaY;
    }
    e.preventDefault();
  }

  element.scrollLeft -= (delta);

}

function SmoothScroll(e) {
  var element = $('#carousel-items');
  var delta = element[0].scrollLeft - e;
  element.animate({
    scrollLeft: delta
  }, 500);
}

window.onload = function() {
  var carousel = {};
  carousel.e = document.getElementById('carousel');
  carousel.items = document.getElementById('carousel-items');
  carousel.leftScroll = document.getElementById('left-scroll-button');
  carousel.rightScroll = document.getElementById('right-scroll-button');

  carousel.items.addEventListener("mousewheel", handleMouse, false);
  carousel.items.addEventListener("scroll", scrollEvent);
  carousel.leftScroll.addEventListener("click", leftScrollClick);
  carousel.rightScroll.addEventListener("click", rightScrollClick);


  setLeftScrollOpacity();
  setRightScrollOpacity();

  function handleMouse(e) {
    MouseWheelHandler(e, carousel.items);
  }

  function leftScrollClick() {
    var smoothScrollDelta = $('#carousel-items')[0].clientWidth * 0.8;
    SmoothScroll(smoothScrollDelta);
  }

  function rightScrollClick() {
    var smoothScrollDelta = $('#carousel-items')[0].clientWidth * 0.8;
    SmoothScroll(-smoothScrollDelta);
  }

  function scrollEvent(e) {
    setLeftScrollOpacity();
    setRightScrollOpacity();
  }

  function setLeftScrollOpacity() {
    if (isScrolledAllLeft()) {
      carousel.leftScroll.style.opacity = 0;
    } else {
      carousel.leftScroll.style.opacity = 1;
    }
  }

  function isScrolledAllLeft() {
    if (carousel.items.scrollLeft === 0) {
      return true;
    } else {
      return false;
    }
  }

  function isScrolledAllRight() {
    if (carousel.items.scrollWidth > carousel.items.offsetWidth) {
      if (carousel.items.scrollLeft + carousel.items.offsetWidth === carousel.items.scrollWidth) {
        return true;
      } 
    }else {
      return true;
    }

    return false;
  }

  function setRightScrollOpacity() {
    if (isScrolledAllRight()){
      carousel.rightScroll.style.opacity = 0;
    } else {
      carousel.rightScroll.style.opacity = 1;
    }
  }
}

function click() {
  console.log('licked');
}

function toDetail(id) {
  console.log(id);
//  UI TEST를 위해 막음.  
//  window.location.href = '/app/sceneReview/review?mvno='+ id;
}

 */