/**
 *
 * Name: BRO Slider
 * Description: This script uses for creating u beatiful and usability slider.
 *
 * Version: alpha 0.9.1
 * Date for last update: 2017-12-30
 * Date create: 2017-11-15
 *
 * Email author: d1d2c0d1@gmail.com
 *
 *
 * Thank's for watch and use this script!
 *
 */

let CSlider = {

    
    /**
     * 
     * Global object parameters for slider work cycle
     * 
     */

    // Another data (You can fix this if you want that, i'm create this three years old, sorry bro)
    fn: "function", 
    string: "string",
    object: "object",
    undef: "undefined",

    animateSpeed: "0.3s", // Slider animate speed
    arrMaxSpeedDelimiter: [],
    arrSpeedDelimiterIterator: [],

    sliderClass: "cslider",     // Default class for main container
    slidesClass: "slides",      // Default class for slides container
    slideClass: "slide",        // Default class for slide container
    sliderSClass: "slider", 
    activeSlideClass: "active",
    navClassDisabled: "disabled",
    pointsClass: "slider-points",
    pointCurrentClass: "current",
    pointClass: "dot",

    sliderNavClass: "slider-nav",       // Default class for slider navigate
    sliderNavNextClass: "next",         // Default class for navigate button to "Next"
    sliderNavPrevClass: "prev",         // Default class for navigate button to "Previous"

    enableDrag: false,          // Enable (true) draggable events
    percentToSwipe: 7,          // How many percent was need for work swipe event

    slideWidth: 0,              // Slide width (was find in init method)
    arrTransforms: [],          // Array with transforms (was fill in init method)
    arrActiveSlide: [],         // Array of slides for all sliders on page (was fill in init method)
    arrSlideWidth: [],          // Array of witdh slides for all sliders on page (was fill in init method)
    arrCountSlides: [],         // Array of counted all slides for all sliders on page (was fill in init method)
    arrSliders: [],             // Array of all sliders on page (was fill in init method)
    arrSlidersWidth: [],        // Array of width all sliders containers (was fill in init method)
    arrCountViewSlide: [],      // Array of count view slides (for lazy load/was fill in init method)
    arrNav: [],                 // Array of navigation bars for all sliders on page (was fill in init method)
    arrPoints: [],              // Array of points bars for all sliders on page (was fill in init method)
    arrEnablePoints: [],        // Array of Enableds or disableds dots bar (point bar) for sliders (fill in init method, but it increases the load on the client side)
    arrBackgroundImages: [],    // Array with images for show in sliders (was fill in init method)
    arrSliderViewPoints: [],    // Array of show or not all dots (was fill in init method)

    /**
     * Method create for initializing all parameters and create all DOM elements. Filling all global arrays was here
     * 
     * @param {String} sliderClass 
     * @param {any} opt 
     */
    Init: function (sliderClass, opt) {

        // Getting all parameters from parent script
        if (this.IsObject(opt)) {

            // Set all options from parent script
            this.SetOption("sliderClass", opt.sliderClass);
            this.SetOption("slideClass", opt.slideClass);
            this.SetOption("sliderNavNextClass", opt.sliderNavNextClass);
            this.SetOption("sliderNavPrevClass", opt.sliderNavPrevClass);
            this.SetOption("sliderSClass", opt.sliderSecondClass);
            this.SetOption("slidesClass", opt.slidesClass);
            this.SetOption("animateSpeed", opt.animateSpeed);
            this.SetOption("enableFancyBox", opt.fancybox);
            this.SetOption("enableKeyBoard", opt.keyboard);
            this.SetOption("startSlide", opt.startSlide);

            // Set callbacks from parent script
            if (this.IsObject(opt.events)) {

                // Next slide callbacks
                if (this.IsFunction(opt.events.beforeNextSlide)) this.fnBeforeNextSlide = opt.events.beforeNextSlide; // before work method NextSlide
                if (this.IsFunction(opt.events.afterNextSlide)) this.fnAfterNextSlide = opt.events.afterNextSlide; // after work method NextSlide

                // Previously slide callbacks
                if (this.IsFunction(opt.events.beforePrevSlide)) this.fnBeforePrevSlide = opt.events.beforePrevSlide; // before work method PrevSlide
                if (this.IsFunction(opt.events.afterPrevSlide)) this.fnAfterPrevSlide = opt.events.afterPrevSlide; // after work method PrevSlide

                // Flipping slides callbacks
                if (this.IsFunction(opt.events.beforeSlideChange)) this.fnBeforeSlideChange = opt.events.beforeSlideChange; // before turning the slide (before change)
                if (this.IsFunction(opt.events.afterSlideChange)) this.fnAfterSlideChange = opt.events.afterSlideChange; // after turning the slide (after change)

            }
        }

        // If we are has slider className, then set that data in our state
        if (sliderClass != null && !this.IsUndefined(sliderClass) && this.IsString(sliderClass)) {
            if (sliderClass.length >= 2) this.sliderClass = sliderClass; // Set className for slider
        }

        // Find all sliders on page
        this.sliders = this.GetListByClass(this.sliderClass);

        // Rendering our sliders
        this.Rendering();

        // Add method this.OnResize to window listener on Resize event
        window.addEventListener('resize', this.OnResize);

        // If need to enable work keyboard in slider, than to do this :)
        if (this.enableKeyBoard) {
            window.addEventListener('keydown', this.KeyPress);
        }
    },

    /**
     * 
     * Rendering for all sliders
     * 
     */
    Rendering: function () {

        // Iterating all sliders
        // I know! I can use arrayPrototype.forEach(() => {...}), but we need many support browsers
        for (let index in this.sliders) {
            
            // If index more than or equal 0, than we are work with this slider
            if (this.intval(index) >= 0) {

                // Set all global params in arrays
                this.arrBackgroundImages[index] = [];   // Creating child array for fillable slider images
                this.slider = this.sliders[index];      // Getting slider item
                this.arrSliders[index] = this.slider;   // Set DOM element by finded slider

                this.slides = this.FindByClass(this.slider, this.slidesClass)[0]; // Getting all slides
                this.countSlidesInSlider = this.slides.childElementCount;         // Getting count slides from slider

                // If count slides more than or equal 2, than initialize slider methods
                if (this.countSlidesInSlider >= 2) {

                    // Save al data about slider
                    this.arrCountSlides[index] = this.countSlidesInSlider;                  // Save count slides by slider
                    this.innerSlider = this.FindByClass(this.slider, this.sliderSClass)[0]; // Getting child elements by slider
                    this.innerSliderWidth = this.innerSlider.clientWidth;                   // Getting slider width

                    // Count shows slides
                    this.arrCountViewSlide[index] = this.intval(this.GetData(this.slider, "viewSlides"));
                    if (this.arrCountViewSlide[index] <= 0 || this.IsUndefined(this.arrCountViewSlide[index]) || !this.arrCountViewSlide[index]) {
                        this.arrCountViewSlide[index] = 1;
                    }

                    // Count shows slides
                    this.arrSliderViewPoints[index] = this.GetData(this.slider, "points") == "N" ? false : true;
                    if (this.IsUndefined(this.arrSliderViewPoints[index]) || !this.arrSliderViewPoints[index]) {
                        this.arrSliderViewPoints[index] = true;
                    }

                    // Getting data parameters from slides
                    this.currentSlide = this.GetData(this.slider, "startSlide"); // show this slide
                    this.arrMaxSpeedDelimiter[index] = parseFloat(this.GetData(this.slider, "maxSpeedDelimiter")); // speed limited

                    // If speed not was limited in data params, than set default speed for slider
                    if (!this.arrMaxSpeedDelimiter[index] || this.arrMaxSpeedDelimiter[index] < 1 || this.IsUndefined(this.arrMaxSpeedDelimiter[index])) {
                        this.arrMaxSpeedDelimiter[index] = 3;
                    }

                    // Set another limit for slide or set default speed
                    this.arrSpeedDelimiterIterator[index] = parseFloat(this.GetData(this.slider, "speedDelimiter")); // another speed limited
                    if (!this.arrSpeedDelimiterIterator[index] || this.arrSpeedDelimiterIterator[index] < 1 || this.IsUndefined(this.arrSpeedDelimiterIterator[index])) {
                        this.arrSpeedDelimiterIterator[index] = 3;
                    }

                    // Getting all dots panels for slider
                    this.arrPoints[index] = this.FindByClass(this.slider, this.pointsClass)[0];
                    if (this.IsObject(this.arrPoints[index])) {
                        this.arrEnablePoints[index] = true;

                        // Here we adapt for creating next dots pattern
                        this.ExamplePoint = this.arrPoints[index].firstElementChild.cloneNode(true);
                        this.ExamplePoint.classList.remove(this.pointCurrentClass);

                        this.arrPoints[index].innerHTML = ""; // Clear DOM element
                    } else {
                        this.arrEnablePoints[index] = false;
                    }

                    // Set first animate
                    this.slides.style.transition = "all " + this.animateSpeed + " ease";

                    // Getting all slides for slider
                    this.slidesElements = this.FindByClass(this.slides, this.slideClass)
                    this.slidesWidth = 0; // for counted slide width
                    slideIndex = 0; // iterator

                    if (this.IsUndefined(this.currentSlide) || this.currentSlide <= -1) {
                        this.currentSlide = 0;
                    } else {
                        this.currentSlide = this.intval(this.currentSlide);
                    }

                    // Getting navigation panel
                    this.sliderNav = this.FindByClass(this.slider, this.sliderNavClass)[0];

                    // Create slideImages array, for temporary save images by slide
                    this.slideImages = [];


                    // While our slide index is less than or equal count slides in slider, we are iterating
                    // Yes, i know Bro, don't worry, pls (forEach)
                    while (slideIndex <= this.countSlidesInSlider - 1) {

                        this.slide = this.slidesElements[slideIndex] // our slide

                        this.slide.style.width = (this.innerSliderWidth / this.arrCountViewSlide[index]) + "px";

                        if (typeof this.slide != this.undef) {
                            this.slideWidth = this.innerSliderWidth / this.arrCountViewSlide[index]; // save slider width for the first transform shift
                            this.slidesWidth += this.slideWidth; // add slider width to total width
                        }

                        // Set data parameters to slide
                        this.SetData(this.slide, "slider", index); // set data parameter to slide
                        this.SetData(this.slide, "slide", slideIndex); // set data parameter to slide

                        // Getting image to slide
                        this.arrBackgroundImages[index][slideIndex] = this.GetData(this.slide, "backgroundImage");
                        
                        // If image url has normal string, than save and show this slide else set null
                        if (!this.IsString(this.arrBackgroundImages[index][slideIndex]) || this.arrBackgroundImages[index][slideIndex].length <= 0) {
                            
                            this.arrBackgroundImages[index][slideIndex] = null; // set null, if we cant find normal background image url

                        } else {

                            // Show first and second slide
                            if (slideIndex <= 1) {
                                this.slideImages[slideIndex] = this.FindByClass(this.slidesElements[slideIndex], "image")[0];
                                this.slideImages[slideIndex].style.backgroundImage = "url('" + this.arrBackgroundImages[index][slideIndex] + "')";
                            }
                        }

                        // Enable animation
                        this.SetTransition(this.slide, false);

                        // Add dots to point panel if needed
                        if (this.arrEnablePoints[index]) {
                            
                            // Set another data for points
                            let pointText = this.GetData(this.slide, "textPoint");

                            this.clonePoint = this.ExamplePoint.cloneNode(true);                        // Clone pattern DOM element for dots item
                            this.clonePoint.dataset.sliderId = index;                                   // Set data parameter with slide ID
                            this.clonePoint.dataset.slideIndex = slideIndex;                            // Set data parameter to DOM element with data about slder index
                            this.lastAppendPoint = this.arrPoints[index].appendChild(this.clonePoint);  // Save last append point

                            // If point need to has plain text, than set that
                            if (pointText != "N" && typeof pointText != "undefined") {
                                this.clonePoint.innerHTML = pointText; // Add plain text to point DOM element
                            }

                            // If now slide index equal zero, than set current className to point
                            if (slideIndex == 0) {
                                this.lastAppendPoint.classList.add(this.pointCurrentClass);
                            }
                            
                            // Add event onClick to point
                            this.clonePoint.addEventListener('click', function(event) {
                                event.preventDefault();
                                if (this.classList.contains("current")) return false;
                                CSlider.viewSlide(parseInt(this.dataset.slideIndex), parseInt(this.dataset.sliderId));
                            });

                            // Fix for only touch events
                            this.clonePoint.addEventListener('touchend', this.clonePoint.onclick);

                        }

                        ++slideIndex;
                    }
                    // end of While slides iterator

                    // Set another variables for slider
                    this.arrSlidersWidth[index] = this.slidesWidth;

                    this.SetWidth(this.slides, this.slidesWidth);   // Set slider width for container with slides
                    this.SetTransfromX(this.slides, 0);             // Set first transform shift for slide with zero index

                    this.arrTransforms[index] = 0;                  // save in our object value about now shift transformation in slider
                    this.arrActiveSlide[index] = this.currentSlide; // save current slide in slider
                    this.arrSlideWidth[index] = this.slideWidth;    // save slider width

                    this.SetData(this.slider, "slider", index); // Set data parameter
                    this.SetData(this.slider, "countSlides", this.countSlidesInSlider); // Set data parameter

                    // Getting navigation panel
                    this.navigation = this.FindByClass(this.slider, this.sliderNavClass)[0];
                    
                    // If navigation panel is has
                    if (this.IsObject(this.navigation)) {
                        this.prevButton = this.FindByClass(this.navigation, this.sliderNavPrevClass)[0];                // Set previous button
                        this.nextButton = this.FindByClass(this.navigation, this.sliderNavNextClass)[0];                // Set next button
                        this.arrNav[index] = { prev: this.prevButton, next: this.nextButton, nav: this.navigation };    // Save data in global object array
                    }

                    // If previous button is has find on page
                    if (this.IsObject(this.prevButton)) {
                        
                        this.arrNav[index]["isSetPrev"] = true; // Save flag for script know, has button or not
                        this.SetData(this.prevButton, "slider", index); // Set data parameter for prev button

                        // Set onClick event to previous button
                        this.prevButton.addEventListener('click', function (event) {
                            event.preventDefault();
                            this.slider = CSlider.intval(CSlider.GetData(this, "slider"));
                            CSlider.prevSlide(this.slider);
                        });

                        // Fix for touched devices only
                        this.prevButton.addEventListener('touchend', this.prevButton.onclick);
                        this.prevButton.classList.add(this.navClassDisabled); // Set disabled button
                    }

                    // If next button was find
                    if (this.IsObject(this.nextButton)) {
                        
                        this.arrNav[index]["isSetNext"] = true; // Save flag for script know, has button or not
                        this.SetData(this.nextButton, "slider", index); // Set data parameter for next button

                        // Set onclick event to next button
                        this.nextButton.addEventListener('click', function (event) {
                            event.preventDefault();
                            this.slider = CSlider.intval(CSlider.GetData(this, "slider"));
                            CSlider.nextSlide(this.slider);
                        });

                        // Fix for touched devices only
                        this.nextButton.ontouchend = this.nextButton.onclick;
                        this.nextButton.classList.remove(this.navClassDisabled); // Set disabled button
                    }

                    // Is testing, need show navigations buttons and bars or not
                    if (this.arrCountSlides[index] <= this.arrCountViewSlide[index]) {
                        this.arrNav[index].nav.style.display = "none";

                    // Else if normal count items
                    } else {

                        // Add event to mouse down on slider
                        this.slider.addEventListener('mousedown', function (event) {
                            if (typeof event.clientX != "number") event.clientX = event.touches[0].clientX;
                            if (typeof event.clientY != "number") event.clientY = event.touches[0].clientY;
                            CSlider.OnDragStart(this, event);
                        });

                        // Add event mouse move to slider
                        this.slider.addEventListener('mousemove', function (event) {
                            if (typeof event.clientX != "number") event.clientX = event.touches[0].clientX;
                            if (typeof event.clientY != "number") event.clientY = event.touches[0].clientY;
                            if (CSlider.enableDrag) {
                                CSlider.OnDragMove(this, event);
                            }
                        });

                        // Add event to mouse up on slider
                        this.slider.addEventListener('mouseup', function (event) {
                            event.preventDefault();
                            if (typeof event.clientX != "number") event.clientX = event.changedTouches[0].clientX;
                            if (typeof event.clientY != "number") event.clientY = event.changedTouches[0].clientY;
                            CSlider.OnDragEnd(this, event);
                            return true;
                        });

                        // FIX: repeat all events for only touch devices
                        this.slider.addEventListener('touchstart', this.slider.onmousedown);
                        this.slider.addEventListener('touchmove', this.slider.onmousemove);
                        this.slider.addEventListener('touchend', this.slider.onmouseup);
                        this.slider.addEventListener('mouseleave', this.slider.onmouseup);

                        // To do this for fix bugs with transformation shift on next slides
                        if (this.startSlide >= 2) {
                            let iter = 0;
                            while (iter < this.startSlide) {
                                this.nextSlide(index);
                                ++iter;
                            }
                        }

                    }
                }
            }
        }
    },

    /**
     * On key press on slider event
     * 
     * @param {DOMElementEvent} event 
     */
    KeyPress: function (event) {
        if (event.code == "ArrowRight") {
            for (let index in CSlider.sliders) {
                CSlider.nextSlide(index);
            }
        }
        if (event.code == "ArrowLeft") {
            for (let index in CSlider.sliders) {
                CSlider.prevSlide(index);
            }
        }
    },

    /**
     * Append slides in end to slider
     * 
     * @param {DOMElement} slidesElements 
     * @param {int} sliderId 
     */
    AppendSlides: function (slidesElements, sliderId) {
        if (this.IsObject(slidesElements)) {
            sliderId = parseInt(sliderId);
            if (sliderId >= 0 && sliderId && slidesElements >= 1) {

                this.slider = this.arrSliders[sliderId];

                slideIndex = 0;
                while (slideIndex < slidesElements.length) {
                    ++slideIndex;
                }

                return true;
            }
        }

        return false;
    },

    /**
     * Append slide to end slider by sliderId
     * 
     * @param {DOMElement} slideElement 
     * @param {int} sliderId 
     */
    AppendSlide: function (slideElement, sliderId) {
        sliderId = parseInt(sliderId);
        if (this.IsObject(slideElement) && sliderId >= 0 && sliderId) {

            this.slider = this.arrSliders[sliderId];
            this.slides = this.FindByClass(this.slider, this.slidesClass)[0];

            if (this.IsObject(this.slides)) {
                if (this.AppendChild(this.slides, slideElement)) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        return false;
    },

    /**
     * For lazy load images
     * 
     * @param {Array} ArSlides 
     * @param {int} SliderId 
     */
    LoadIMGSlides: function (ArSlides, SliderId) {
        if (typeof ArSlides != "object") return false;
        if ((!parseInt(SliderId) && parseInt(SliderId) != 0) || parseInt(SliderId) <= -1) return false;

        let slider = this.sliders[SliderId];
        let bslides = this.FindByClass(slider, this.slidesClass)[0];

        bslides.innerHTML = "";
        this.SetTransition(slider, true);

        // Bro i still know, but i want to do this :) pls dont worry
        for (let i = 0; i < ArSlides.length; i++) {
            slide = ArSlides[i];
            pointText = slide.pointText;

            bslide = document.createElement('div');
            bslide.classList.add(this.slideClass);
            bslide.style.backgroundImage = "url('" + slide.src + "')";
            
            if (typeof pointText == "string") {
                bslide.dataset.textPoint = slide.pointText;
            } else {
                bslide.dataset.textPoint = "N";
            }

            bslides.appendChild(bslide);
        }

        this.Rendering(); // Rendering slider

    },

    /**
     * For add event on resize browser window
     * 
     * @param {DOMElementEvent} event 
     */
    OnResize: function (event) {
        CSlider.sliders = CSlider.GetListByClass(CSlider.sliderClass);
        let widthSlider = 0;
        for (let index in CSlider.sliders) {
            if (index >= 0) {
                CSlider.slider = CSlider.sliders[index];
                CSlider.innerSlider = CSlider.FindByClass(CSlider.slider, CSlider.sliderSClass)[0];
                widthSlider = CSlider.innerSlider.clientWidth;
                CSlider.slides = CSlider.FindByClass(CSlider.slider, CSlider.slidesClass)[0];
                CSlider.slidesElements = CSlider.FindByClass(CSlider.slides, CSlider.slideClass);
                CSlider.slidesWidth = 0;

                CSlider.countSlidesInSlider = CSlider.slides.childElementCount;

                let slideIndex = 0;
                while (slideIndex <= CSlider.countSlidesInSlider - 1) {

                    CSlider.slide = CSlider.slidesElements[slideIndex];

                    if (!CSlider.IsUndefined(CSlider.slide)) {
                        CSlider.slide.style.width = (widthSlider / CSlider.arrCountViewSlide[index]) + "px";
                        CSlider.slideWidth = widthSlider / CSlider.arrCountViewSlide[index]; // save width for first shift
                        CSlider.slidesWidth += CSlider.slideWidth;
                    }

                    ++slideIndex;
                }

                CSlider.arrSlidersWidth[index] = CSlider.slidesWidth;
                CSlider.SetWidth(CSlider.slides, CSlider.slidesWidth);

                CSlider.arrTransforms[index] = CSlider.arrActiveSlide[index] * widthSlider;
                CSlider.SetTransfromX(CSlider.slides, CSlider.arrTransforms[index]);

                CSlider.arrSlideWidth[index] = widthSlider / CSlider.arrCountViewSlide[index];

                CSlider.standartedSlideTransform(index);
            }
        }
    },

    /**
     * Event on slide draggable start
     * 
     * @param {Object} _this 
     * @param {DOMElementEvent} event 
     */
    OnDragStart: function (_this, event) {

        let slider_id = parseInt(CSlider.GetData(_this, "slider"));

        CSlider.ScrollEnable = false;
        CSlider.SliderMoveEnable = false;

        CSlider.startPositionY = event.clientY;

        CSlider.SpeedDelimiter = 1;
        this.startPositionX = event.clientX;
        this.startPositionXDelm = event.clientX / CSlider.SpeedDelimiter;

        this.startTransformX = this.arrTransforms[slider_id];
        _this.slides = this.FindByClass(_this, this.slidesClass)[0];

        this.StartDragDate = new Date();

        if (CSlider.OffTransition(_this.slides)) {
            this.enableDrag = true;
            this.sizeTransformXToSwipe = this.arrSlidersWidth[slider_id] / this.percentToSwipe;
        }
    },

    /**
     * Event on slide move
     * 
     * @param {Object} _this
     * @param {any} event 
     */
    OnDragMove: function (_this, event) {
        if (CSlider.enableDrag) {

            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else {
                document.selection.empty();
            }

            _this.transformXIsTest = event.clientX - this.startPositionX;
            _this.transformYIsTest = event.clientY - this.startPositionY;

            if (!this.ScrollEnable && !this.SliderMoveEnable && (_this.transformYIsTest >= 15 || _this.transformYIsTest <= -15)) {
                this.ScrollEnable = true;
            } else if (!this.ScrollEnable && !this.SliderMoveEnable && (_this.transformXIsTest >= 15 || _this.transformXIsTest <= -15)) {
                this.SliderMoveEnable = true;
            }

            if (this.ScrollEnable) {
                return false;
            } else {
                event.preventDefault();
            }

            // Передвижение
            _this.selSliderId = this.intval(this.GetData(_this, this.sliderSClass));
            _this.slides = this.FindByClass(_this, this.slidesClass)[0];

            if (parseInt(this.arrActiveSlide[_this.selSliderId]) > parseInt(this.arrCountSlides[_this.selSliderId]) - 1 - parseInt(this.arrCountViewSlide[_this.selSliderId]) && _this.transformXIsTest <= -0.001) {
                this.SpeedDelimiter += this.arrSpeedDelimiterIterator[_this.selSliderId];
                if (this.SpeedDelimiter >= this.arrMaxSpeedDelimiter[_this.selSliderId]) this.SpeedDelimiter = this.arrMaxSpeedDelimiter[_this.selSliderId];
                this.startPositionXDelm = this.startPositionX / this.SpeedDelimiter;

                dclientX = event.clientX / this.SpeedDelimiter;
                _this.transformX = dclientX - this.startPositionXDelm + this.startTransformX;

            } else if (parseInt(this.arrActiveSlide[_this.selSliderId]) <= 0 && _this.transformXIsTest >= 0.001) {

                this.SpeedDelimiter += this.arrSpeedDelimiterIterator[_this.selSliderId];
                if (this.SpeedDelimiter >= this.arrMaxSpeedDelimiter[_this.selSliderId]) this.SpeedDelimiter = this.arrMaxSpeedDelimiter[_this.selSliderId];
                this.startPositionXDelm = this.startPositionX / this.SpeedDelimiter;

                dclientX = event.clientX / this.SpeedDelimiter;
                _this.transformX = dclientX - this.startPositionXDelm + this.startTransformX;

            } else {

                this.SpeedDelimiter -= this.arrSpeedDelimiterIterator[_this.selSliderId];
                if (this.SpeedDelimiter <= 1) this.SpeedDelimiter = 1;
                this.startPositionXDelm = this.startPositionX / this.SpeedDelimiter;

                dclientX = event.clientX / this.SpeedDelimiter;

                if (this.SpeedDelimiter != 1) {
                    _this.transformX = dclientX - this.startPositionXDelm + this.startTransformX;
                } else {
                    _this.transformX = dclientX - this.startPositionX + this.startTransformX;
                }

            }

            this.SetTransfromX(_this.slides, _this.transformX);
            this.arrTransforms[_this.selSliderId] = _this.transformX;

        }
    },

    /**
     * Event on draggable slide ended
     * 
     * @param {Object} _this 
     * @param {DOMElementEvent} event 
     */
    OnDragEnd: function (_this, event) {
        if (!CSlider.enableDrag) return false;
        CSlider.enableDrag = false;
        _this.selSliderId = this.intval(this.GetData(_this, this.sliderSClass));
        _this.slides = this.FindByClass(_this, this.slidesClass)[0];
        this.EndDragDate = new Date();
        this.DragTime = this.EndDragDate - this.StartDragDate;
        this.isTestTransformX = event.clientX - this.startPositionX;

        if (this.DragTime <= 500) {
            if (this.isTestTransformX > 10 && this.isTestTransformX < this.sizeTransformXToSwipe) {
                if (!this.prevSlide(_this.selSliderId)) this.standartedSlideTransform(_this.selSliderId);
            } else if (this.isTestTransformX < -10 && this.isTestTransformX > -this.sizeTransformXToSwipe) {
                if (!this.nextSlide(_this.selSliderId)) this.standartedSlideTransform(_this.selSliderId);
            } else {
                CSlider.standartedSlideTransform(parseInt(_this.selSliderId));
            }
        }

        if (this.isTestTransformX > this.sizeTransformXToSwipe) {
            if (!this.prevSlide(_this.selSliderId)) this.standartedSlideTransform(_this.selSliderId);
            return true;
        } else if (this.isTestTransformX < -this.sizeTransformXToSwipe) {
            if (!this.nextSlide(_this.selSliderId)) this.standartedSlideTransform(_this.selSliderId);
            return true;
        } else {

            if (event.type != "mouseleave" && this.enableFancyBox) {
                this.slide = this.FindByClass(_this.slides, this.slideClass)[this.arrActiveSlide[_this.selSliderId]];
                this.fancySRC = this.GetData(this.slide, "openFancy");
                if (this.isTestTransformX == 0 && this.IsFunction($) && !this.IsUndefined(this.fancySRC)) {
                    if (this.IsObject($.fancybox)) {
                        $.fancybox.open({ src: this.fancySRC, type: "image" });
                    }
                }
            }

            CSlider.standartedSlideTransform(parseInt(_this.selSliderId));
            return true;
        }

        // I'm dont trust :)
        CSlider.standartedSlideTransform(parseInt(_this.selSliderId));
        return true;
    },

    /**
     * Set default shift transforms for slides in slider by sliderId
     * 
     * @param {int} slider_id 
     */
    standartedSlideTransform: function (slider_id) {

        this.slider = this.arrSliders[slider_id];
        this.slides = this.FindByClass(this.slider, this.slidesClass)[0];
        this.OnTransition(this.slides);
        this.arrTransforms[slider_id] = -this.arrSlideWidth[slider_id] * this.arrActiveSlide[slider_id];
        this.SetTransfromX(this.slides, this.arrTransforms[slider_id]);

    },

    /**
     * Show next slide
     * 
     * @param {int} slider_id 
     */
    nextSlide: function (slider_id) {

        // Run parrent callbacks
        if (this.IsFunction(this.fnBeforeNextSlide)) this.fnBeforeNextSlide(event);
        if (this.IsFunction(this.fnBeforeSlideChange)) this.fnBeforeSlideChange();
        // end Run parrent callbacks

        this.slider = this.sliders[slider_id];

        if (this.IsUndefined(this.slider)) return false;

        this.slides = this.FindByClass(this.slider, this.slidesClass)[0];

        // Enable animation
        this.OnTransition(this.slides);

        // Save last slide
        this.oldActiveSlide = this.arrActiveSlide[slider_id];

        // Iterating now slide
        this.arrActiveSlide[slider_id] += 1;

        // Testing is last slide
        if (this.arrActiveSlide[slider_id] > this.arrCountSlides[slider_id] - this.arrCountViewSlide[slider_id]) {
            this.arrActiveSlide[slider_id] = this.oldActiveSlide;
            return false;
        }

        // Blocked navigation buttons or not
        if (this.IsObject(this.arrNav[slider_id])) {
            this.arrActiveSlide[slider_id] += 1;
            if (this.arrActiveSlide[slider_id] > this.arrCountSlides[slider_id] - this.arrCountViewSlide[slider_id]) {
                if (this.arrNav[slider_id].isSetNext) {
                    this.arrNav[slider_id].next.classList.add(this.navClassDisabled);
                }
            } else {
                if (this.arrNav[slider_id].isSetNext) {
                    if (this.arrNav[slider_id].next.classList.contains(this.navClassDisabled)) this.arrNav[slider_id].next.classList.remove(this.navClassDisabled)
                }
            }
            this.arrActiveSlide[slider_id] -= 1;
            if (this.arrNav[slider_id].isSetPrev) this.arrNav[slider_id].prev.classList.remove(this.navClassDisabled);
        }

        // Find active slide
        this.activeSlideElement = this.FindByClass(this.slides, this.slideClass)[this.arrActiveSlide[slider_id]];

        // Find old active slide
        this.oldActiveSlideElement = this.FindByClass(this.slides, this.slideClass)[this.oldActiveSlide];

        // Testing is has className in activeSlide
        if (!this.activeSlideElement.classList.contains(this.activeSlideClass)) {
            this.activeSlideElement.classList.add(this.activeSlideClass);
            this.oldActiveSlideElement.classList.remove(this.activeSlideClass);
        }

        this.arrTransforms[slider_id] = -this.arrSlideWidth[slider_id] * this.arrActiveSlide[slider_id];
        this.SetTransfromX(this.slides, this.arrTransforms[slider_id]);

        // Work with points if they is enabled
        if (this.arrEnablePoints[slider_id]) {
            this.lastBlockPoints = this.arrPoints[slider_id];
            this.lastPoints = this.lastBlockPoints.children;
            for (let i = 0; i < this.lastPoints.length; i++) {
                this.lastPoint = this.lastPoints[i];
                this.lastPoint.classList.remove(this.pointCurrentClass);
            }
            this.lastPoints[this.arrActiveSlide[slider_id]].classList.add(this.pointCurrentClass);
        }

        this.SlidesElements = this.FindByClass(this.slides, this.slideClass);
        this.slideImages = [];

        // Lazy loading another images, if this is needed now to do
        if (this.arrBackgroundImages[slider_id][this.arrActiveSlide[slider_id]] !== null) {

            this.slideImages[0] = this.FindByClass(this.SlidesElements[this.arrActiveSlide[slider_id]], "image")[0];
            this.slideImages[0].style.backgroundImage = "url('" + this.arrBackgroundImages[slider_id][this.arrActiveSlide[slider_id]] + "')";

            if (this.IsObject(this.SlidesElements[this.arrActiveSlide[slider_id] + 1])) {
                this.slideImages[1] = this.FindByClass(this.SlidesElements[this.arrActiveSlide[slider_id] + 1], "image")[0];
                this.slideImages[1].style.backgroundImage = "url('" + this.arrBackgroundImages[slider_id][this.arrActiveSlide[slider_id] + 1] + "')";
            }

            if (this.IsObject(this.SlidesElements[this.arrActiveSlide[slider_id] + 2])) {
                this.slideImages[2] = this.FindByClass(this.SlidesElements[this.arrActiveSlide[slider_id] + 2], "image")[0];
                this.slideImages[2].style.backgroundImage = "url('" + this.arrBackgroundImages[slider_id][this.arrActiveSlide[slider_id] + 2] + "')";
            }
        }

        // Run parrent callbacks
        if (this.IsFunction(this.fnAfterNextSlide)) this.fnAfterNextSlide(event);
        if (this.IsFunction(this.fnAfterSlideChange)) this.fnAfterSlideChange();
        // end Run parrent callbacks

        return true;
    },

    /**
     * Show previous slide
     * 
     * @param {int} slider_id 
     */
    prevSlide: function (slider_id) {

        // Run parrent callbacks
        if (this.IsFunction(this.fnBeforePrevSlide)) this.fnBeforePrevSlide();
        if (this.IsFunction(this.fnBeforeSlideChange)) this.fnBeforeSlideChange();
        // end of Run parrent callbacks

        this.slider = this.arrSliders[slider_id];
        this.slides = this.FindByClass(this.slider, this.slidesClass)[0];
        this.OnTransition(this.slides);

        this.oldActiveSlide = this.arrActiveSlide[slider_id];

        --this.arrActiveSlide[slider_id];
        if (this.arrActiveSlide[slider_id] < 0) {
            this.arrActiveSlide[slider_id] = 0;
            return false;
        }

        // Disabling next or back button
        if (this.IsObject(this.arrNav[slider_id])) {
            if (this.arrActiveSlide[slider_id] <= 0) {
                if (this.arrNav[slider_id].isSetPrev) {
                    this.arrNav[slider_id].prev.classList.add(this.navClassDisabled);
                }
            } else {
                if (this.arrNav[slider_id].isSetPrev) {
                    if (this.arrNav[slider_id].prev.classList.contains(this.navClassDisabled)) this.arrNav[slider_id].prev.classList.remove(this.navClassDisabled)
                }
            }
            if (this.arrNav[slider_id].isSetNext) this.arrNav[slider_id].next.classList.remove(this.navClassDisabled);
        }

        this.activeSlideElement = this.FindByClass(this.slides, this.slideClass)[this.arrActiveSlide[slider_id]];
        this.oldActiveSlideElement = this.FindByClass(this.slides, this.slideClass)[this.oldActiveSlide];

        if (!this.activeSlideElement.classList.contains(this.activeSlideClass)) {
            this.activeSlideElement.classList.add(this.activeSlideClass);
            this.oldActiveSlideElement.classList.remove(this.activeSlideClass);
        }

        this.arrTransforms[slider_id] = -this.arrSlideWidth[slider_id] * this.arrActiveSlide[slider_id];
        this.SetTransfromX(this.slides, this.arrTransforms[slider_id]);

        // Working with dots if this is needed
        if (this.arrEnablePoints[slider_id]) {
            this.lastBlockPoints = this.arrPoints[slider_id];
            this.lastPoints = this.lastBlockPoints.children;
            for (let i = 0; i < this.lastPoints.length; i++) {
                this.lastPoint = this.lastPoints[i];
                this.lastPoint.classList.remove(this.pointCurrentClass);
            }
            this.lastPoints[this.arrActiveSlide[slider_id]].classList.add(this.pointCurrentClass);
        }

        // Run parrent callbacks
        if (this.IsFunction(this.fnAfterPrevSlide)) this.fnAfterPrevSlide();
        if (this.IsFunction(this.fnAfterSlideChange)) this.fnAfterSlideChange();
        // end Run parrent callbacks

        return true;
    },

    /**
     * Show slide (slide_id) in slider (slider_id)
     * 
     * @param {int} slide_id 
     * @param {int} slider_id 
     */
    viewSlide: function (slide_id, slider_id = 0) {
        slide_id = parseInt(slide_id);
        if (isNaN(slide_id) || slide_id <= -1) return false;

        // Fixed another bugs with moves
        if (this.IsFunction(this.fnBeforeSlideChange)) this.fnBeforeSlideChange();
        // end of Fixed another bugs with moves

        this.oldActiveSlide = this.arrActiveSlide[slider_id];

        this.arrActiveSlide[slider_id] = slide_id;
        if (this.arrActiveSlide[slider_id] < 0) {
            this.arrActiveSlide[slider_id] = 0;
        } else if (this.arrActiveSlide[slider_id] > this.arrCountSlides[slider_id] - this.arrCountViewSlide[slider_id]) {
            this.arrActiveSlide[slider_id] = this.arrCountSlides[slider_id] - this.arrCountViewSlide[slider_id];
        }

        this.activeSlideElement = this.FindByClass(this.slides, this.slideClass)[this.arrActiveSlide[slider_id]];
        this.oldActiveSlideElement = this.FindByClass(this.slides, this.slideClass)[this.oldActiveSlide];

        if (!this.activeSlideElement.classList.contains(this.activeSlideClass)) {
            this.activeSlideElement.classList.add(this.activeSlideClass);
            this.oldActiveSlideElement.classList.remove(this.activeSlideClass);
        }

        this.arrTransforms[slider_id] = -this.arrSlideWidth[slider_id] * this.arrActiveSlide[slider_id];
        this.SetTransfromX(this.slides, this.arrTransforms[slider_id]);

        // Work with dots
        if (this.arrEnablePoints[slider_id]) {
            this.lastBlockPoints = this.arrPoints[slider_id];
            this.lastPoints = this.lastBlockPoints.children;
            for (let i = 0; i < this.lastPoints.length; i++) {
                this.lastPoint = this.lastPoints[i];
                this.lastPoint.classList.remove(this.pointCurrentClass);
            }
            this.lastPoints[this.arrActiveSlide[slider_id]].classList.add(this.pointCurrentClass);
        }

        // Fixed another bugs with moves
        if (this.IsFunction(this.fnAfterSlideChange)) this.fnAfterSlideChange();
        // end of Fixed another bugs with moves

        return true;
    },

    /**
     * Enable transition in slider
     * 
     * @param {DOMElement} slides 
     */
    OnTransition: function (slides) {
        if (typeof slides == "object") {
            return this.SetTransition(slides, false);
        } else if (typeof slides == "number") {
            this.selSlides = this.FindByClass(this.slider, this.slidesClass)[0];
            return this.SetTransition(this.selSlides, false);
        } else return false;
    },

    /**
     * Disable transition in slider
     * 
     * @param {DOMElement} slides 
     */
    OffTransition: function (slides) {
        if (typeof slides == "object") {
            return this.SetTransition(slides, true);
        } else if (typeof slides == "number") {
            this.selSlides = this.FindByClass(this.slider, this.slidesClass)[0];
            return this.SetTransition(this.selSlides, true);
        } else return false;
    },

    /* 
     *
     * Below are functions, framing for native functions
     *
     * */

    /**
     * Get all elements with class class_name
     * 
     * @param {String} class_name 
     */
    GetListByClass: function (class_name) {
        return this.FindByClass(document, class_name);
    },

    /**
     * Set transition to DOM element
     * 
     * @param {Object} object 
     * @param {Boolean} isOff 
     */
    SetTransition: function (object, isOff) {
        if (typeof object == "object") {
            if (isOff) {
                return object.style.transition = "none";
            } else {
                return object.style.transition = "all " + this.animateSpeed + " ease";
            }
        } else {
            return false;
        }
    },

    /**
     * Append child to DOM element
     * 
     * @param {Object} object 
     * @param {DOMElement} appendItem 
     * @param {int} objectIndex 
     */
    AppendChild: function (object, appendItem, objectIndex = 0) {
        if (this.IsObject(object)) {
            object.appendChild(appendItem);
            console.log(object);
            return object;
        } else if (this.IsString(object)) {
            workObject = this.GetListByClass(object)[objectIndex];
            if (this.IsObject(workObject)) {
                workObject.appendChild(appendItem);
                return workObject;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    /**
     * Checking a property against a function
     * 
     * @param {any} variable 
     */
    IsFunction: function (variable) {
        return this.IsType(variable, this.fn);
    },

    /**
     * Checking a property on an object
     * 
     * @param {any} variable 
     */
    IsObject: function (variable) {
        return this.IsType(variable, this.object);
    },

    /**
     * Checking a property is an string
     * 
     * @param {any} variable 
     */
    IsString: function (variable) {
        return this.IsType(variable, this.string);
    },

    /**
     * Checking a property on an undefined
     * 
     * @param {any} variable 
     */
    IsUndefined(variable) {
        return this.IsType(variable, this.undef);
    },

    /**
     * Compare variable type and type name
     * 
     * @param {any} variable 
     * @param {String} type 
     */
    IsType(variable, type) {
        if (typeof variable == type) return true; else return false;
    },

    /**
     * Set tramsform to DOM element
     * 
     * @param {DOMElement} DOMElement 
     * @param {float} transformPX 
     */
    SetTransfromX: function (DOMElement, transformPX) {
        return DOMElement.style.transform = "translateX(" + transformPX + "px)";
    },

    /**
     * Set width to DOM Element
     * 
     * @param {DOMElement} DOMElement 
     * @param {float} widthPX 
     */
    SetWidth: function (DOMElement, widthPX) {
        return DOMElement.style.width = widthPX + "px";
    },

    /**
     * Find all DOM Elements by className
     * 
     * @param {DOMElement} DOMElement 
     * @param {String} className 
     */
    FindByClass: function (DOMElement, className) {
        return DOMElement.querySelector('.'+className);
    },

    /**
     * Set attribute to DOM Element
     * 
     * @param {DOMElement} DOMElement 
     * @param {String} attrName 
     * @param {String} attrValue 
     */
    SetAttr: function (DOMElement, attrName, attrValue) {
        return DOMElement.setAttribute(attrName, attrValue);
    },

    /**
     * Getting attribute from DOM Element
     * 
     * @param {DOMElement} DOMElement 
     * @param {String} attrName 
     */
    GetAttr: function (DOMElement, attrName) {
        return DOMElement.getAttribute(attrName);
    },

    /**
     * Set data parameter to DOM Element
     * 
     * @param {DOMElement} DOMElement 
     * @param {String} dataName 
     * @param {String} dataValue 
     */
    SetData: function (DOMElement, dataName, dataValue) {
        return DOMElement.dataset[dataName] = dataValue;
    },

    /**
     * Getting value from data attribute in DOM Element
     * 
     * @param {DOMElement} DOMElement 
     * @param {String} dataName 
     */
    GetData: function (DOMElement, dataName) {
        return DOMElement.dataset[dataName];
    },


    /**
     * Analog for parseInt with testing
     * 
     * @param {any} variable 
     */
    intval: function (variable) {
        if (Math.abs(variable) ) {
            return Math.abs(variable);
        }

        return 0;
    },

    /**
     * Setter for options in object
     * 
     * @param {String} optionName 
     * @param {String} optionValue 
     */
    SetOption(optionName, optionValue) {
        if (this.IsString(optionValue) || typeof optionValue == "boolean" || typeof optionValue == "number") {
            this[optionName] = optionValue;
        } else return false;
    },

};

window.CSlider = CSlider;