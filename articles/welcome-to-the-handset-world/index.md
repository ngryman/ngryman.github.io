# Welcome to the handset world

## `raf` is your best friend
## The null transform hack could be your best friend
## Only change what is visible
## Batch your changes
## Create CSS rules on-the-fly
## Re-use DOM
- memory
- dom addition/deletion cost
- maintain the children count low (reflow)
## Size is like your weight
## Round coordinates
- avoid the blur bug
## Spread changes over frames
## CSS can kill you
- avoid rgba colors

Imagine we live in a world where god is a css hacker, and you are a `div` in the middle of a crowd of `div`s obviously. For whatever reason he thinks you are a poor little thing and wants you to be wider, so he changes your size. What's happen? You take more space. People around you have to move farther and the crowd changes its `layout` because of you. This, in the real world as no *cost* as miss nature has the more powerful physic engine ever created. But on mobile, this is cost a lot.


This is a vast subject, very well covered on desktop, but sadly not enough for mobile. By mobile I mean every thing that nasically fits in your hands. I also mean less capable devices with limited CPU anf VRAM.

I have done several private projects on mobile, with different teams, each time I was very surprised of the lack of mobile knowledge. People basically follows best practices made for desktop or inifinite powered devices.

So, I will cover here every little nasty things I have discovered about mobile performance. I will only focus on DOM and rendering challenges.

Recently, I had the challenge of building a smooth infinite TV guide for every web capable mobile device. Event this is a private project, closed source, I will take a more simpler example of that because it gathers everything I discovered.

On mobile, rendering take a LOT of importance. Too often, I see people trying to optimize their JavaScript algorithm, without considering rendering.
On miss-placed line of JavaScript can kill your performance. And this is not linked to JavaScript execution time, but with the consequence of the changes you make.

## Keep you framerate high

This is a trendy subject, and a lot of articles on how to profile and optimize framerate exists. We can read everywhere, "let's make 60fps webapps". So let's focus on that.

## raf is your best friend


## Batch

This is nothing new. And it's even more important on mobile. But let's me explain what I mean by batching.
Your logic code must not overtake 16ms, if not, another

## Avoid resizing

Ok, so we said let's avoid reflow. Resizing is something very hungry. It forces reflow + recalculate styles + paint. So, definitively, avoid!
If, like in my example, you have a well determined number of sized elements. Reuse them!! As we said earlier, the NTH is free as you don't touch anything, 

## Reuse DOM elements

DOM manipulation is very slow, not only because the browser

 - maintain the children count low (reflow)
## Round coordinates
 - avoid the blur bug
## Use of null tranform hack
## Create dynamic css rules
## Spread work over frames
## CSS can kill you
 - avoid rgba colors

---
```json
{
  "title": "Welcome to the handset world",
  "created": "2013-04-27T19:57:35.088Z",
  "updated": "2013-05-02T15:41:36.014Z"
}
```
