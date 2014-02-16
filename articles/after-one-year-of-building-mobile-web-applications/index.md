<p class="splash">
![](articles/after-one-year-of-building-mobile-web-applications/splash1.jpg)
![](articles/after-one-year-of-building-mobile-web-applications/splash2.jpg)
![](articles/after-one-year-of-building-mobile-web-applications/splash3.jpg)
</p>

I've learnt that browsers are beasts to master.

This year was for me one of the most intensive year ever.
I've delivered 4 web applications for big companies.
It was fun and hard but above all very rewarding.
This series of five articles will cover stuff I discovered.

One thing I've learnt, the **Web is fast**, even on mobile. *JavaScript* itself is nearly never a performance bottleneck,
but rendering is. And in fact, rendering is pretty damn fast too, but how the browsers schedule things can be a killer.

I have sometimes compared the rendering part of a browser with a game engine. Basically any intensive rendering stuff needs to:

 - Organize things that are visible from those which are not.
 - Invalidate a region whose state has changed.
 - Update invalidated region in a specific order.

In video games, those pieces of code are called **rendering engines**, or **game engines**.
Generally they are specialized for a certain purpose. A *FPS* does not work like a *RTS*, neither than a car simulation.
But, they have the previous points in common.

The rendering part of a browser can be seen as a *generic rendering engine* which has to work for any kind of web application.
And it’s kind of hard to manage this efficiently. The Web has also evolved a lot in the past years offering more and more
interactivity, *RIA*s and *SPA*s. **Browsers were not made for this**.

So they come with a pitfall. As any generic stuff, when you ask it to do some specific stuff, it kind of sucks because
it tries to accommodate every one.
Browsers make really bad decisions some times.
And when you are developing highly interactive mobile web app, and the client asks it to look like native (yeah...),
well, you have some work to do: **master the beast**.

In this series, we’ll only consider pieces of *JavaScript* that interact directly or indirectly with the *DOM*.
In most of web applications, logic stuff is really simple. most of the time you’re not developing a simulation engine
nor an image manipulation software, but a shiny little app for the people you love.<br>
Yeah, I’m a hippie.

But when you dive into mobile development, you’ll notice that it has no mercy.
One line of *CSS* or *JavaScript*, can easily **kill your performance**, making you become insane and comfort the
ones who say the Web is sloppy.

As a lot of very good performance related articles already exist, I would like to take a step back and analyse some
notions, ideas, that most Web developers are *not yet* very familiar with.

Those notions will directly impact on how fast your application is:

 - **Create**: *Recycling* vs *Creating*.
 - **Load**: *Preloading* vs *Lazy loading*.
 - **Update**: *Batching* vs *Spreading*.
 - **Store**: *DOM* vs *JavaScript*.

That’s a sort of *CRUD*, without the delete part. Let’s call this *CLUS*.<br>
I love to create useless acronyms.

In a perfect world you would simply choose a solution and get a beer with your fellows.
But this is reality, it’s cruel, there is no black or white situations, but *1337 shades of grey*.
You’ll have to decide which tone is the right for you.

We’ll see what are the benefits and trade-offs of each notion and we’ll try to illustrate it with real life examples.

So see you in the next article :)

This article is also available on *Medium*: https://medium.com/@ngryman.

---
```json
{
  "title": "After one year of building mobile web applications... {1/5}",
  "created": "2014-02-15T22:44:09.874Z",
  "published": true,
  "updated": "2014-02-16T00:02:57.116Z"
}
```
