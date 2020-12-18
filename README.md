# BRO Slider

This slider was created on Native Javascript for work on corporate sites. [Example see here](http://xn--f1aigiamm.xn--p1ai/)

I'm developed this slider in 2017 year.

## Installation guide

Download script and include on your HTML page.

Next create <script></script> and in that `Initiate` this slider.

## Initalization

```javascript
CSlider.Init("cslider", {
  slidesClass: "slides",
  slideClass: "slide",
  dragable: true,
  startSlide: 1,
  events: {
      beforeNextSlide: (event) => {
          console.log("Was started show next slide!");
      }
  }
});
```

## Options

|Option name|Description|Type|Default|
|----------------|----------------|:---------:|:---------:|
|sliderClass|Class name for slider container|String|cslider|
|slidesClass|Class name for slides container|String|slides|
|sliderSClass|Class name inner slider container|String|slider|
|slideClass|Class name for slide container|String|slides|
|sliderNavNextClass|Class name for navigation `next` button|String|next|
|sliderNavPrevClass|Class name for navigation `previous` button|String|prev|
|animateSpeed|Animation speed in float|float|0.3|
|enableFancyBox|If you use FancyBox library, than you can open your images in FB|Boolean|false|
|enableKeyBoard|If you wan't use keyboard in control your slider, than set `true`|Boolean|false|
|startSlide|Index of start slide|Integer|0|

## Events

|Event name|Description|Parameters|
|----------------|----------------|----------------|
|beforeNextSlide|Before change next slide in slider|event|
|afterNextSlide|After change next slide in slider|event|
|beforePrevSlide|Before change previous slide in slider|event|
|afterPrevSlide|After change previous slide in slider|event|
|beforeSlideChange|Before change slide in slider|event|
|afterSlideChange|After change slide in slider|event|

## From developer

I'm created this slider with love from Siberia in 2017 year. This is just a memory of my development. It's not start and not the end!

Thank's for see that.