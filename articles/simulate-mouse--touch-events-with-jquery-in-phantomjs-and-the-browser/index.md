For my little project [jQuery Finger], I wanted to be able to continuously test it while coding.
This can be easily achieved using the magic combo of [Grunt], [Mocha] (with [Chai]) and [PhantomJS].

I just had to launch `grunt watch` and listen to the evil *bip* telling me "test have failed, you suck nooby noob!".

This is what I wanted, but things became more complicated when I wanted to run tests with more advanced user inputs such as *tap*, *double tap*, *long tap*, *drag* and *swipe*, across multiple elements.

I have tried to use `MouseEvents` and `TouchEvent` to simulate it, but I couldn't make it work properly with **PhantomJS**. If somebody has successfully achieved this, I'm interested in!

The code of this article is [hosted here][VirtualPointer]. Use it, fork it!

## jQuery is your best friend

For [jQuery Finger], I must use *jQuery* as a direct dependency. That's convenient I guess because *jQuery* has the ability to trigger events, and particulary mouse/touch events. It adds an abstraction above *native* events which was very handy for me.

The caveat of using jQuery to trigger events is that you must register **jQuery events specifically**. You can't trigger a jQuery `click` and hope catching it if you registered your listener with `addEventListener`. *jQuery* simply triggers an event using its own internal sugar. If this is a blocker for you, this article might still be interesting because the global idea remains the same.

## Manage your virtual pointer

So how can we try to simulate pointer events ?

We can use the magic of the `document.elementFromPoint` function. It tells which DOM element lives at the given position. AFAIK it is supported since quite a long time.

All we have to do, is to keep track of coordinates. When we want to trigger an event, we retreive the DOM element, and call `jQuery.fn.trigger` on it. Simple as pie.

Here is the first draft of our **virtual pointer**:

```javascript
var VirtualPointer = (function () {
  var hasTouch = 'ontouchstart' in window,
      startEvent = hasTouch ? 'touchstart' : 'mousedown',
      stopEvent = hasTouch ? 'touchend' : 'mouseup',
      moveEvent = hasTouch ? 'touchmove' : 'mousemove';

  return {
    x: 0,
    y: 0,

    trigger: function (evtName) {
      var $el = $(document.elementFromPoint(this.x, this.y));
      $el.trigger(new $.Event(evtName, {
        pageX: this.x,
        pageY: this.y,
        originalEvent: {
          touches: [{
            pageX: this.x,
            pageY: this.y
          }]
        }
      }));
    },

    click: function () {
      this.trigger('click');
    },

    tapStart: function () {
      this.trigger(startEvent);
    },

    tapEnd: function () {
      this.trigger(stopEvent);
    },

    tap: function () {
      this.tapStart();
      this.tapEnd();
    },

    START_EVENT: startEvent,
    STOP_EVENT: stopEvent,
    MOVE_EVENT: moveEvent
  };
}());
```

With this first version, we can easily:

 - change the position of the pointer with `x` and `y`.
 - simulate a `click`.
 - simulate a `mousedown mouseup` / `touchstart touchend` by calling `tap`, assuming we register events with `VirtualPointer.START_EVENT` or `VirtualPointer.STOP_EVENT`.

A classic *jQuery* event is built on top of a *native event* that you can access with the `originalEvent` property. Some handy properties are directly copied to the *jQuery* event object.

`pageX` and `pageY` are of these. They give the pointer *absolute* coordinates when the event is fired. *jQuery* tries to unify these properties accross every browser. But, on some mobile browsers, such as **Mobile Safari**, `pageX` and `pageY` stay to `0`. The only trustable source for coordinates resides in the `event.originalEvent.touches[0]` properties.

The problem is when you manually trigger a *jQuery* event, it is created from scratch. So `pageX`, `pageY` and `originalEvent` are missing. We have to create them manually and forward our **virtual pointer**'s coordinates.

## Let's add `press` and `doubletap` event

`press` event is an alias for a **long tap** event.

Here is the updated version of our initial **virtual pointer**:

```javascript
return {
  // [...]
  press: function (callback, duration) {
    var self = this;
    duration = duration || this.PRESS_DURATION * 1.5 /* security */;
    this.tapStart();
    setTimeout(function () {
      self.tapEnd();
      if (callback) callback.call(self);
    }, duration);
  },

  doubleTap: function (callback, duration) {
    var self = this;
    duration = duration || this.DOUBLETAP_DURATION * 0.5 /* security */;
    this.tap();
    setTimeout(function () {
      self.tap();
      callback.call(self);
    }, duration);
  },

  // [...]
  PRESS_DURATION: 300,
  DOUBLETAP_DURATION: 300,
};
```

The code is pretty self explanatory.

I will just explain the *security* multiplier. `setTimeout` is a cool bro, but he is not very punctual. So, if your code really depends on a **time threshold**, you should never put the `setTimeout` value to that **threshold**, or near it. By applying a **+0.5/-0.5** security multiplier, you are always sure that you will be either on one or the other side.

## Now let's add some motion

To handle motion, we will have to pretend that the cursor is ... moving, woot!

We will need **destination coordinates** and a **duration**. Our job will be to interpolate coordinates between current and destination, and call the `mousemove`/`touchmove` event at a given interval.

In real life, motion events may be triggered **at a very, perhaps sometimes too high rate** (i.e. *Chrome's rate is around every `2ms`).<br>
We won't be able to be so precise, but who cares? We will just use our good old friend `setTimeout` with a `0` timeout to simulate AMAP fake moves.

Here is the update:

```javascript
return {
  // [...]
  move: function (x, y, callback, duration) {
    var self = this,
        last = Date.now(),
        t = 0,
        timer;

    this.tapStart();

    var sx = this.x,
        sy = this.y;
    (function mv() {
      var now = Date.now();
      t += now - last;
      if (t >= duration) {
        self.tapEnd();
        callback.call(self);
        return;
      }
      last = now;

      self.x = Math.ceil(t / duration * x) + sx;
      self.y = Math.ceil(t / duration * y) + sy;

      self.trigger(moveEvent);
      timer = setTimeout(mv, 0);
    })();
  },

  // [...]
};
```

Now, we can call `move` to simulate motion, and `tapStart`, `move`, `tapEnd` sequence to simulate some kind of drag. Great!

## Let's finish him!

With those three utility functions, we are now able to simulate gestures.

Right of the *Batman*, here is our final code:

```javascript
var VirtualPointer = (function () {
  var hasTouch = 'ontouchstart' in window,
      startEvent = hasTouch ? 'touchstart' : 'mousedown',
      stopEvent = hasTouch ? 'touchend' : 'mouseup',
      moveEvent = hasTouch ? 'touchmove' : 'mousemove';

  return {
    x: 0,
    y: 0,

    trigger: function (evtName) {
      var $el = $(document.elementFromPoint(this.x, this.y));
      $el.trigger(new $.Event(evtName, {
        pageX: this.x,
        pageY: this.y,
        originalEvent: {
          touches: [{
            pageX: this.x,
            pageY: this.y
          }]
        }
      }));
    },

    click: function () {
      this.trigger('click');
    },

    tapStart: function () {
      this.trigger(startEvent);
    },

    tapEnd: function () {
      this.trigger(stopEvent);
    },

    move: function (x, y, callback, duration) {
      var self = this,
          last = Date.now(),
          t = 0,
          timer;

      this.tapStart();

      var sx = this.x,
          sy = this.y;
      (function mv() {
        var now = Date.now();
        t += now - last;
        if (t >= duration) {
          self.tapEnd();
          callback.call(self);
          return;
        }
        last = now;

        self.x = Math.ceil(t / duration * x) + sx;
        self.y = Math.ceil(t / duration * y) + sy;

        self.trigger(moveEvent);
        timer = setTimeout(mv, 0);
      })();
    },

    tap: function () {
      this.tapStart();
      this.tapEnd();
    },

    press: function (callback, duration) {
      var self = this;
      duration = duration || this.PRESS_DURATION * 1.5 /* security */;
      this.tapStart();
      setTimeout(function () {
        self.tapEnd();
        if (callback) callback.call(self);
      }, duration);
    },

    doubleTap: function (callback, duration) {
      var self = this;
      duration = duration || this.DOUBLETAP_DURATION * 0.5 /* security */;
      this.tap();
      setTimeout(function () {
        self.tap();
        callback.call(self);
      }, duration);
    },

    drag: function (x, y, callback, duration) {
      duration = duration || this.FLICK_DURATION * 1.5 /* security */;
      this.move(x, y, callback, duration);
    },

    flick: function (x, y, callback, duration) {
      duration = duration || this.FLICK_DURATION * 0.5 /* security */;
      this.move(x, y, callback, duration);
    },

    START_EVENT: startEvent,
    STOP_EVENT: stopEvent,
    MOVE_EVENT: moveEvent,

    PRESS_DURATION: 300,
    DOUBLETAP_DURATION: 300,
    FLICK_DURATION: 300
  };
}());
```

That's it! This is a basic implementation of our **virtual pointer**. It should allow us to simulate mouse/touch events in the browser and in **PhantomJS**.

As a side note, **PhantomJS** is detected as a touch device because `window.ontouchstart` is defined. This appears to be something common with some *WebKit* forks.

## Bonus: prevent user interaction

During the simulation we **don't want** any real event messing around with our tests.<br>
Well, keep your hand away from your mouse, that's it!

No, you can't? Ok...<br>

When you trigger an event with *jQuery*, it comes with an additional property `isTrigger`. So, basically, in your event handlers you can tell if this is a *fake* or a *real* event.<br>
In our case, we are only interested in *fake* events, not *real* ones.

The only *satisfying* solution I found is proxying each *jQuery* event handlers and skipping *real* ones.

We could just prepend our event listeners with something like this:

```javascript
$('.elem').on(VirtualPointer.MOVE_EVENT, function(e) {
  if (!e.isTrigger) return;
 
  // handler code
});
```

But do we? Not really... Let's use `jQuery.event.special` in our test environment to *proxy* every jQuery event handler dynamically:

```javascript
$.each('click mousedown mouseup mousemove mouseleave touchstart touchmove touchend'.split(' '), function(i, evtName) {
  $.event.special[evtName] = {
    add: function(handleObj) {
      var oldHandler = handleObj.handler;
      handleObj.handler = function(event) {
        if (event.isTrigger) {
          oldHandler.apply(this, arguments);
        }
      };
    }
  };
});
```

Just be sure you execute this code before running your tests and registering your events. You will then be able to *harlem shake* your mouse / fingers without any side effect.

## Finally

Everything in this article is included in the [Github version][VirtualPointer], plus some additional bonuses:

 - an example of *Mocha* integration in the very simple [test suite][TestSuite].
 - the possibility to specify a custom scope for callbacks.
 - the possibility to auto reset coordinates on each `tapStart`.

Also, you can take a look at [jQuery Finger] :-)

[jQuery Finger]: https://github.com/ngryman/jquery.finger
[Grunt]: http://gruntjs.com
[Mocha]: http://visionmedia.github.com/mocha
[Chai]: http://chaijs.com
[PhantomJS]: http://phantomjs.org
[VirtualPointer]: https://github.com/ngryman/virtual-pointer
[TestSuite]: https://raw.github.com/ngryman/virtual-pointer/master/test/virtual-pointer_test.js

---
```json
{
  "title": "Simulate mouse / touch events with jQuery in PhantomJS and the browser",
  "created": "2013-03-24T21:57:04.149Z",
  "published": "true",
  "updated": "2013-08-11T15:23:11.348Z"
}
```
