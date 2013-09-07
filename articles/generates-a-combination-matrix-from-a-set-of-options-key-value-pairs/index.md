For my next craft, [ribs], I want my tests to cover the maximum use cases keeping the whole thing as **DRY** as possible. This is a good occasion for me to learn and abuse of some techniques: [curry] for example. This will be the topic my next article, when all tests will be written. One day I hope!

Ok, let's focus on a narrower topic: testing all possible combination of a function's *options*. By *options*, I mean *named arguments* (i.e. `fn({ width: 16, height: 9 }`). By nature, all of these arguments should be optional. So if you are doing things right, you should provide a default value for each of those options.

Now let's say you want to write unit test to check out how the function behaves when providing some arguments, but not others. And let's that you are writting a function to resize an image. Your **api** provides two named arguments: `width` and `height`. You want to test all possible interactions between those two variable, that is:
 - `width` but not `height.
 - `height` but not `width`.
 - neither.
 - both.
 
When writting your unit test, you would probably do something like this:

```javascript
describe('resize', function() {
	it('should keep aspect ratio given a width only', checkUbberiness({ width: 42 }));
    it('should keep aspect ratio given a height only', checkUbberiness({ height: 1337 }));
    it('should keep aspect ratio given both width and height', checkUbberiness({ width: 42, height: 1337 }));
    it('should keep aspect ratio given no arguments', checkUbberiness({}));
});
```

Note the `checkUbber` function, it uses curry :)

Well this covers all possible interactions between your named arguments. But this is tedious to right and could be wrapped into a single test that cover intractions:

```javascript
describe('my ubber function', function() {
	it('should be ubber given any given argument(s)', function(done) {
    	async.parallel([
        	checkUbberiness({ width: 42 }),
            checkUbberiness({ height: 1337 }),
            checkUbberiness({ width: 42, height: 1337 }),
            checkUbberiness({})
        ]);
    });
});
```

Unit test purist might say:
> You should keep those tests separated

Perhaps, but I find it less maintanable. This kind of test is perhaps at the cross of TDD and BDD. But that's not the point.

Now let's say our library has a lot of success and needs an additional param: `mode`. We would have to test now `2^3: 8` cases. This is quite annoying.

What if we could use a method to check all test cases, keeping **DRY** and that could scale up to any number of arguments. **optify** comes!

What **optify** does is really simple yet powerful. Given any set of named arguments, it returns an array of interaction possiblities.
Our test would become something like this:

```javascript
describe('my ubber function', function() {
	it('should be ubber given any given argument(s)', function() {
    	optify(
        	{ width: 42, height: 1337, mode: 'cover' },
            { width: 0, height: 0, mode: null },
            checkUbberiness
        );
    });
});
```

This will call the `checkUbberiness` function with the following values:
 - `{ width: 42, height: 1337, mode: 'cover' }`
 - `{ width: 0,  height: 1337, mode: 'cover' }`
 - `{ width: 42, height: 0,    mode: 'cover' }`
 - `{ width: 0,  height: 0,    mode: 'cover' }`
 - `{ width: 42, height: 1337, mode: null    }`
 - `{ width: 0,  height: 1337, mode: null    }`
 - `{ width: 42, height: 0,    mode: null    }`
 - `{ width: 0,  height: 0,    mode: null    }`

That's it, nothing fancy, but usefull.

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
