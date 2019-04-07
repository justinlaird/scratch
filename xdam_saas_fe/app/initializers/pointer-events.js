let customEvents = {};
if ("PointerEvent" in window) {
  /* istanbul ignore next */
  customEvents = {
    pointerdown:   'onStart', // touchstart, mousedown
    pointermove:   'onMove', // touchmove, mousemove
    pointerup:     'onEnd', // touchend, mouseup
    pointercancel: 'onCancel', // touchcancel

    pointerover:   'onOver',
    pointerout:    'onOut',
    pointerenter:  'onEnter',
    pointerleave:  'onLeave',

    gotpointercapture: 'onGotPointerCapture',
    lostpointercapture: 'onLostPointerCapture',
  };
} else if ("TouchEvent" in window) {
  /* istanbul ignore next */
  customEvents = {
    touchstart: 'onStart',
    touchmove: 'onMove',
    touchend: 'onEnd',
    touchcancel: 'onCancel',
  };
}

export function initialize(application) {
  application.reopen({
    customEvents: Object.assign({
      mousedown: null,
      mouseup: null,
      mouseover: null,
      mousemove: null,
      mouseout: null,
      // mouseenter: null,
      // mouseleave: null,

      drag: null,
      dragend: null,
      dragenter: null,
      dragleave: null,
      dragover: null,
      dragstart: null,
      drop: null,

      // Kept mouse events, have no match in pointer event spec
      // click: null,
      auxclick: null,
      dblclick: null,
      mousewheel: null,
      wheel: null,
      // contextmenu: null,
    }, customEvents),
  });
}

export default {
  name: 'pointer-events',
  initialize
};
