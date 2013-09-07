For my next craft, [ribs], I want my tests to cover the maximum use cases keeping the whole thing as **DRY** as possible. This is a good occasion for me to learn and abuse of some techniques: [curry] for example. This will be the topic my next article, when all tests will be written. One day I hope!

Ok, let's focus on a narrower topic: testing all possible combination of a function's *options*. By *options*, I mean *named arguments* (i.e. `fn({ width: 16, height: 9 }`). By nature, all of these arguments should be optional. So if you are doing things right, you should provide a default value for each of those options.

Now let's say you want to write test to check out how the function behaves when providing some arguments, but not others. And let's that you are writting a function to resize an image. Your **api** provides two named arguments: `width` and `height`. You want to test all possible interactions between those two variable, that is:
 - `width` but not `height.
 - `height` but not `width`.
 - neither.
 - both.
 
When writting your test, you would probably do something like this:

```javascript
describe('resize', function() {
	it('should keep aspect ratio given a width only', checkAspectRatio({ width: 42 }));
    it('should keep aspect ratio given a height only', checkAspectRatio({ height: 1337 }));
    it('should keep aspect ratio given both width and height', checkAspectRatio({ width: 42, height: 1337 }));
    it('should keep aspect ratio given no arguments', checkAspectRatio({}));
});
```

Note the `checkAspectRatio` function, it uses curry. Tasty, isn't it?

Well, this covers all possible combination between your named arguments. But this is tedious to write and could be wrapped into a single test like this:

```javascript
describe('resize', function() {
	it('should keep aspect ratio', function(done) {
    	async.parallel([
        	checkAspectRatio({ width: 42 }),
            checkAspectRatio({ height: 1337 }),
            checkAspectRatio({ width: 42, height: 1337 }),
            checkAspectRatio({})
        ], done);
    });
});
```

Ok this makes sense. You bruteforce your function, testing if the desired behavior is fulfilled.

Now let's say our library has a lot of success (I know I'm dreaming), and our function needs an additional argument: `mode`. We would now have to test `2^3: 8` cases. This is quite annoying...

What if we could use a method to check all test cases, keeping it **DRY** and that would be able to scale up to any number of arguments. Oh, I hear from the **npm** registry: **optify**!!!

## Optify

What **optify** does is really simple, yet powerful. Given any set of named arguments, it returns an array of possible combinations.
Our test would become something like this:

```javascript
describe('resize', function() {
	it('should keep aspect ratio', function(done) {
    	optify(
        	{ width: 42, height: 1337, mode: 'cover' },
            checkAspectRatio
        );
    });
});
```

For informed observers, not that the `checkAspectRatio` function's arguments are reversed in this implementation.

In this version, **optify** accepts 2 arguments:
 - a set of named arguments and their value.
 - a callback mapped over each possibility.

This will call the `checkAspectRatio` function **8** times, with the following values:
 - `{ width: 42,        height: 1337,      mode: 'cover'   }`
 - `{ width: undefined, height: 1337,      mode: 'cover'   }`
 - `{ width: 42,        height: undefined, mode: 'cover'   }`
 - `{ width: undefined, height: undefined, mode: 'cover'   }`
 - `{ width: 42,        height: 1337,      mode: undefined }`
 - `{ width: undefined, height: 1337,      mode: undefined }`
 - `{ width: 42,        height: undefined, mode: undefined }`
 - `{ width: undefined, height: undefined, mode: undefined }`

If you want to provide a different value than `undefined`, you can provide a global one like this:

```javascript
optify({ width: 42, height: 1337, mode: 'cover' }, 0, checkAspectRatio);

// [
//     { width: 42, height: 1337, mode: 'cover' }`
//     { width: 0,  height: 1337, mode: 'cover' }`
//     { width: 42, height: 0,    mode: 'cover' }`
//     { width: 0,  height: 0,    mode: 'cover' }`
//     { width: 42, height: 1337, mode: 0       }`
//     { width: 0,  height: 1337, mode: 0       }`
//     { width: 42, height: 0,    mode: 0       }`
//     { width: 0,  height: 0,    mode: 0       }`
// ]
```

Or one per arguments like this:

```javascript
optify(
	{ width: 42,  height: 1337, mode: 'cover' },
    { width: 160, height: 90,   mode: null    },
    checkAspectRatio
);

// [
//     { width: 42,  height: 1337, mode: 'cover' }`
//     { width: 160, height: 1337, mode: 'cover' }`
//     { width: 42,  height: 90,   mode: 'cover' }`
//     { width: 160, height: 90,   mode: 'cover' }`
//     { width: 42,  height: 1337, mode: null    }`
//     { width: 160, height: 1337, mode: null    }`
//     { width: 42,  height: 90,   mode: null    }`
//     { width: 160, height: 90,   mode: null    }`
// ]
```

### Bonus: Check all possibilities against a value

As you can specify both values and *undefined values*, you can cross data according a *frozen* value like this:

```javascript
optify(
	{ width: 42, height: 1337, mode: 'cover' },
    { width: 42, height: 0,    mode: null    },
    checkAspectRatio
);

// [
//     { width: 42, height: 1337, mode: 'cover' }`
//     { width: 42, height: 1337, mode: 'cover' }`
//     { width: 42, height: 90,   mode: 'cover' }`
//     { width: 42, height: 90,   mode: 'cover' }`
//     { width: 42, height: 1337, mode: null    }`
//     { width: 42, height: 1337, mode: null    }`
//     { width: 42, height: 90,   mode: null    }`
//     { width: 42, height: 90,   mode: null    }`
// ]
```

Note that you will have duplicates as **optify** is not meant for this.

I hope this can help somebody, somehow :)

Checkout out **optify** or take a look at **ribs**.

---
```json
{
  "title": "Generate a combination matrix form a set of options key/value pairs",
  "created": "2013-09-06T21:18:20.149Z",
  "published": "false",
  "updated": "2013-09-06T21:18:20.149Z"
}
```
