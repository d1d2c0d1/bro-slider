/*

  Name: BRO Slider
  Description: This script uses for creating u beatiful and usability slider.

  Version: alpha 0.9.0
  Date Last Update: 2017-12-28
  Date create: 2017-11-15

  Email author: d1d2c0d1@gmail.com
  Company email: hello@studio.country

  If you want a help autor company you can write email message on
  hello@studio.country and tell u quest.

  Thank's for watch and use this script!


*/

var CSlider = {

    // Глобальные свойства библиотеки
    fn: "function",
    string: "string",
    object: "object",
    undef: "undefined",
    animateSpeed: "0.3s",
    arrMaxSpeedDelimiter: [],
    arrSpeedDelimiterIterator: [],

    sliderClass: "cslider",  // стандартный класс обертки слайдера
    slidesClass: "slides",   // стандартный класс обертки слайдов
    slideClass: "slide",    // стандартный класс слайда
    sliderSClass: "slider",
    activeSlideClass: "active",
    navClassDisabled: "disabled",
    pointsClass: "slider-points",
    pointCurrentClass: "current",
    pointClass: "dot",

    sliderNavClass: "slider-nav", // стандартный класс навигации слайдера
    sliderNavNextClass: "next",       // стандартный класс элемента «далее»
    sliderNavPrevClass: "prev",       // стандартный класс элемента «назад»

    enableDrag: false,       // включить драг события
    percentToSwipe: 7,

    slideWidth: 0,          // ширина одного слайда (будет определена в инициаторе)
    arrTransforms: [],         // массив с трансформацией (будет определена в инициаторе)
    arrActiveSlide: [],         // массив активных слайдов для разных слайдеров (будет определена в инициаторе)
    arrSlideWidth: [],         // массив с шириной каждого слайда из набора слайдеров на странице (будет определена в инициаторе)
    arrCountSlides: [],         // массив с количествами слайдов в каждом слайдере
    arrSliders: [],         // Массив всех слайдеров
    arrSlidersWidth: [],         // массив после иниициализации содержит ширину всех слайдеров
    arrCountViewSlide: [],         // полученное количество слайдов для показа
    arrNav: [],         // все навигации по слайдерам
    arrPoints: [],         // все наборы точек
    arrEnablePoints: [],         // включение выключение обработки точек (нагрузка на клиента увеличивается при включенных точках)
    arrBackgroundImages: [],      // изображения для подгрузки во времявыполнения
    arrSliderViewPoints: [],      // показывать точки или нет

    // Метод для инициализации библиотеки
    Init: function (sliderClass, opt) {

        // Параметры и функции переданные из вне
        if (this.IsObject(opt)) {

            // Принимаем клиентские параметры
            this.SetOption("sliderClass", opt.sliderClass);
            this.SetOption("slideClass", opt.slideClass);
            this.SetOption("sliderNavNextClass", opt.sliderNavNextClass);
            this.SetOption("sliderSClass", opt.sliderSecondClass);
            this.SetOption("slidesClass", opt.slidesClass);
            this.SetOption("animateSpeed", opt.animateSpeed);
            this.SetOption("enableFancyBox", opt.fancybox);
            this.SetOption("enableKeyBoard", opt.keyboard);
            this.SetOption("startSlide", opt.startSlide);

            // Принимаем клиентские методы
            if (this.IsObject(opt.events)) {

                // Следующий слайд
                if (this.IsFunction(opt.events.beforeNextSlide)) this.fnBeforeNextSlide = opt.events.beforeNextSlide; // при начале работы функции NextSlide
                if (this.IsFunction(opt.events.afterNextSlide)) this.fnAfterNextSlide = opt.events.afterNextSlide; // в конце работы функции NextSlide

                // Прошлый слайд
                if (this.IsFunction(opt.events.beforePrevSlide)) this.fnBeforePrevSlide = opt.events.beforePrevSlide; // при начале работы функции PrevSlide
                if (this.IsFunction(opt.events.afterPrevSlide)) this.fnAfterPrevSlide = opt.events.afterPrevSlide; // в конце работы функции PrevSlide

                // Перелистывание слайдов в любую сторону
                if (this.IsFunction(opt.events.beforeSlideChange)) this.fnBeforeSlideChange = opt.events.beforeSlideChange; // при начале перелистывания
                if (this.IsFunction(opt.events.afterSlideChange)) this.fnAfterSlideChange = opt.events.afterSlideChange; // при окончании перелистывания

            }
        }

        if (sliderClass != null && !this.IsUndefined(sliderClass) && this.IsString(sliderClass)) {
            if (sliderClass.length >= 2) this.sliderClass = sliderClass; // Устанавливаем класс для слайдеров
        }

        this.sliders = this.GetListByClass(this.sliderClass); // Находим все слайдеры на странице по классу

        this.ReLoad();

        // Подключаем событие resize
        window.addEventListener('resize', this.OnResize);

        if (this.enableKeyBoard) {
            window.addEventListener('keydown', this.KeyPress);
        }
    },

    // Перезагрузка библиотеки
    ReLoad: function () {

        // итерируем все слайдеры на странице
        for (var index in this.sliders) {
            if (this.intval(index) >= 0) {
                this.arrBackgroundImages[index] = [];
                this.slider = this.sliders[index]; // получаем слайдер № index
                this.arrSliders[index] = this.slider; // сохраняем DOM элемент слайдера
                this.slides = this.FindByClass(this.slider, this.slidesClass)[0]; // получаем элемент div.slides
                this.countSlidesInSlider = this.slides.childElementCount;         // Получаем количество слайдов

                // Если количество слайдов больше либо равно 1
                if (this.countSlidesInSlider >= 2) {

                    // сохраняем полное количество слайдов в слайдере
                    this.arrCountSlides[index] = this.countSlidesInSlider;            // Сохраняем количество слайдов
                    this.innerSlider = this.FindByClass(this.slider, this.sliderSClass)[0]; // Получаем инер элемент cslider.slider
                    this.innerSliderWidth = this.innerSlider.clientWidth; // Получаем ширину для слайда от .slider

                    // количество показываемых слайдов в слайдере
                    this.arrCountViewSlide[index] = this.intval(this.GetData(this.slider, "viewSlides"));
                    if (this.arrCountViewSlide[index] <= 0 || this.IsUndefined(this.arrCountViewSlide[index]) || !this.arrCountViewSlide[index]) {
                        this.arrCountViewSlide[index] = 1;
                    }

                    // количество показываемых слайдов в слайдере
                    this.arrSliderViewPoints[index] = this.GetData(this.slider, "points") == "N" ? false : true;
                    if (this.IsUndefined(this.arrSliderViewPoints[index]) || !this.arrSliderViewPoints[index]) {
                        this.arrSliderViewPoints[index] = true;
                    }

                    // Получаем пользовательские параметры
                    this.currentSlide = this.GetData(this.slider, "startSlide"); // показать с слайда
                    this.arrMaxSpeedDelimiter[index] = parseFloat(this.GetData(this.slider, "maxSpeedDelimiter")); // ограничитель скорости
                    if (!this.arrMaxSpeedDelimiter[index] || this.arrMaxSpeedDelimiter[index] < 1 || this.IsUndefined(this.arrMaxSpeedDelimiter[index])) {
                        this.arrMaxSpeedDelimiter[index] = 3;
                    }

                    // Получаем ограничитель скорости слайдера
                    this.arrSpeedDelimiterIterator[index] = parseFloat(this.GetData(this.slider, "speedDelimiter")); // ограничитель скорости 2
                    if (!this.arrSpeedDelimiterIterator[index] || this.arrSpeedDelimiterIterator[index] < 1 || this.IsUndefined(this.arrSpeedDelimiterIterator[index])) {
                        this.arrSpeedDelimiterIterator[index] = 3;
                    }

                    // Получаем набор точек нашего слайдера
                    this.arrPoints[index] = this.FindByClass(this.slider, this.pointsClass)[0];
                    if (this.IsObject(this.arrPoints[index])) {
                        this.arrEnablePoints[index] = true;

                        // Теперь адаптируемся, что нам нужно создавать будет в точках
                        this.ExamplePoint = this.arrPoints[index].firstElementChild.cloneNode(true);
                        this.ExamplePoint.classList.remove(this.pointCurrentClass);

                        this.arrPoints[index].innerHTML = "";
                    } else {
                        this.arrEnablePoints[index] = false;
                    }

                    // Задаем первую анимацию
                    this.slides.style.transition = "all " + this.animateSpeed + " ease";

                    // Получаем все слайды
                    this.slidesElements = this.FindByClass(this.slides, this.slideClass)
                    this.slidesWidth = 0; // для подсчета ширины div.slide
                    slideIndex = 0; // итератор

                    if (this.IsUndefined(this.currentSlide) || this.currentSlide <= -1) {
                        this.currentSlide = 0;
                    } else {
                        this.currentSlide = this.intval(this.currentSlide);
                    }

                    // получаем блок навигации
                    this.sliderNav = this.FindByClass(this.slider, this.sliderNavClass)[0];

                    this.slideImages = [];


                    // Итерируем все слайды в слайдере
                    while (slideIndex <= this.countSlidesInSlider - 1) {

                        this.slide = this.slidesElements[slideIndex] // нужный слайд

                        this.slide.style.width = (this.innerSliderWidth / this.arrCountViewSlide[index]) + "px";

                        if (typeof this.slide != this.undef) {
                            this.slideWidth = this.innerSliderWidth / this.arrCountViewSlide[index]; // сохраним ширину слайда для первого сдвига
                            this.slidesWidth += this.slideWidth; // прибавляем ширину слайдера к общей ширине div.slides
                        }

                        this.SetData(this.slide, "slider", index);
                        this.SetData(this.slide, "slide", slideIndex);

                        // получаем изображение для слайда
                        this.arrBackgroundImages[index][slideIndex] = this.GetData(this.slide, "backgroundImage");
                        if (!this.IsString(this.arrBackgroundImages[index][slideIndex]) || this.arrBackgroundImages[index][slideIndex].length <= 0) {
                            this.arrBackgroundImages[index][slideIndex] = null;
                        } else {
                            if (slideIndex <= 1) {
                                // включаем первый и второй слайд сразу
                                this.slideImages[slideIndex] = this.FindByClass(this.slidesElements[slideIndex], "image")[0];
                                this.slideImages[slideIndex].style.backgroundImage = "url('" + this.arrBackgroundImages[index][slideIndex] + "')";
                            }
                        }

                        // включаем анимацию
                        this.SetTransition(this.slide, false);

                        // добавляем точки для слайдера если нужно
                        if (this.arrEnablePoints[index]) {
                            this.clonePoint = this.ExamplePoint.cloneNode(true);
                            pointText = this.GetData(this.slide, "textPoint");
                            this.clonePoint.innerHTML = pointText != "N" && typeof pointText != "undefined" ? pointText : "";
                            this.clonePoint.dataset.sliderId = index;
                            this.clonePoint.dataset.slideIndex = slideIndex;
                            this.lastAppendPoint = this.arrPoints[index].appendChild(this.clonePoint);
                            if (slideIndex == 0) this.lastAppendPoint.classList.add(this.pointCurrentClass);
                            this.clonePoint.onclick = function (event) {
                                event.preventDefault();
                                if (this.classList.contains("current")) return false;
                                CSlider.viewSlide(parseInt(this.dataset.slideIndex), parseInt(this.dataset.sliderId));
                            }
                            this.clonePoint.ontouchend = this.clonePoint.onclick;
                        }

                        ++slideIndex; // итерируем итератор
                    }
                    // Конец итерации слайдов в слайдере

                    this.arrSlidersWidth[index] = this.slidesWidth;

                    this.SetWidth(this.slides, this.slidesWidth); // Устанавливаем ширину div.slides
                    this.SetTransfromX(this.slides, 0); // Устанавливаем первую трансформацию слайдеру

                    this.arrTransforms[index] = 0; // сохраняем в библиотеке значение трансформации текущего слайдера
                    this.arrActiveSlide[index] = this.currentSlide; // сохраняем номер активного слайда в библиотеке текущего слайдера
                    this.arrSlideWidth[index] = this.slideWidth; // сохраняем номер активного слайда в библиотеке текущего слайдера

                    this.SetData(this.slider, "slider", index); // Устанавливаем id для .cslider
                    this.SetData(this.slider, "countSlides", this.countSlidesInSlider); // Устанавливаем id для .cslider

                    // Получаем элемент содержащий в себе навигацию
                    this.navigation = this.FindByClass(this.slider, this.sliderNavClass)[0];
                    if (this.IsObject(this.navigation)) { // если блок существует
                        this.prevButton = this.FindByClass(this.navigation, this.sliderNavPrevClass)[0]; // получаем кнопку назад
                        this.nextButton = this.FindByClass(this.navigation, this.sliderNavNextClass)[0]; // получаем кнопку вперед
                        this.arrNav[index] = { prev: this.prevButton, next: this.nextButton, nav: this.navigation };
                    }

                    // если кнопка назад существует
                    if (this.IsObject(this.prevButton)) {
                        this.arrNav[index]["isSetPrev"] = true;
                        this.SetData(this.prevButton, "slider", index);
                        this.prevButton.onclick = function (event) {
                            event.preventDefault();
                            this.slider = CSlider.intval(CSlider.GetData(this, "slider"));
                            CSlider.prevSlide(this.slider);
                        }
                        this.prevButton.ontouchend = this.prevButton.onclick;
                        this.prevButton.classList.add(this.navClassDisabled);
                    }

                    // если кнопка вперед существует
                    if (this.IsObject(this.nextButton)) {
                        this.arrNav[index]["isSetNext"] = true;
                        this.SetData(this.nextButton, "slider", index);
                        this.nextButton.onclick = function (event) {
                            event.preventDefault();
                            this.slider = CSlider.intval(CSlider.GetData(this, "slider"));
                            CSlider.nextSlide(this.slider);
                        }
                        this.nextButton.ontouchend = this.nextButton.onclick;
                        this.nextButton.classList.remove(this.navClassDisabled);
                    }

                    // проверяем нужно ли показывать навигацию по количеству элементов
                    if (this.arrCountSlides[index] <= this.arrCountViewSlide[index]) {
                        this.arrNav[index].nav.style.display = "none";

                        // иначе если колчество элементов больше, то задаем события
                    } else {

                        // подключаем события нажатия кнопки мыши
                        this.slider.onmousedown = function (event) {
                            if (typeof event.clientX != "number") event.clientX = event.touches[0].clientX;
                            if (typeof event.clientY != "number") event.clientY = event.touches[0].clientY;
                            CSlider.OnDragStart(this, event);
                        }

                        // подключаем событие перемещения кнопки мыши по слайдеру
                        this.slider.onmousemove = function (event) {
                            if (typeof event.clientX != "number") event.clientX = event.touches[0].clientX;
                            if (typeof event.clientY != "number") event.clientY = event.touches[0].clientY;
                            if (CSlider.enableDrag) {
                                CSlider.OnDragMove(this, event);
                            }
                        }

                        // подключаем события отжатия кнопки мыши
                        this.slider.onmouseup = function (event) {
                            event.preventDefault();
                            if (typeof event.clientX != "number") event.clientX = event.changedTouches[0].clientX;
                            if (typeof event.clientY != "number") event.clientY = event.changedTouches[0].clientY;
                            CSlider.OnDragEnd(this, event);
                            return true;
                        }

                        // повторяем подключения для тач устройств
                        this.slider.ontouchstart = this.slider.onmousedown;
                        this.slider.ontouchmove = this.slider.onmousemove;
                        this.slider.ontouchend = this.slider.onmouseup;

                        this.slider.onmouseleave = this.slider.onmouseup;

                        if (this.startSlide >= 2) {
                            var iter = 0;
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

    KeyPress: function (event) {
        if (event.code == "ArrowRight") {
            for (var index in CSlider.sliders) {
                CSlider.nextSlide(index);
            }
        }
        if (event.code == "ArrowLeft") {
            for (var index in CSlider.sliders) {
                CSlider.prevSlide(index);
            }
        }
    },

    // Добавление слайдов в любое время в конец слайдера
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
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    AppendSlide: function (slideElement, sliderId) {
        sliderId = parseInt(sliderId);
        if (this.IsObject(slideElement) && sliderId >= 0 && sliderId) {

            this.slider = this.arrSliders[sliderId];
            this.slides = this.FindByClass(this.slider, this.slidesClass)[0];

            if (this.IsObject(this.slides)) {
                if (this.AppendChild(this.slides, slideElement)) {
                    console.log("ADDED");
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else return false;
    },

    LoadIMGSlides: function (ArSlides, SliderId) {
        if (typeof ArSlides != "object") return false;
        if ((!parseInt(SliderId) && parseInt(SliderId) != 0) || parseInt(SliderId) <= -1) return false;

        var slider = this.sliders[SliderId];
        var bslides = this.FindByClass(slider, this.slidesClass)[0];

        bslides.innerHTML = "";
        this.SetTransition(slider, true);

        for (var i = 0; i < ArSlides.length; i++) {
            slide = ArSlides[i];
            pointText = slide.pointText;

            bslide = document.createElement('div');
            bslide.classList.add(this.slideClass);
            bslide.style.backgroundImage = "url('" + slide.src + "')";
            if (typeof pointText == "string") bslide.dataset.textPoint = slide.pointText;
            else bslide.dataset.textPoint = "N";
            bslides.appendChild(bslide);
        }

        this.ReLoad();

    },

    OnResize: function (event) {
        CSlider.sliders = CSlider.GetListByClass(CSlider.sliderClass);
        var widthSlider = 0;
        for (var index in CSlider.sliders) {
            if (index >= 0) {
                CSlider.slider = CSlider.sliders[index];
                CSlider.innerSlider = CSlider.FindByClass(CSlider.slider, CSlider.sliderSClass)[0];
                widthSlider = CSlider.innerSlider.clientWidth;
                CSlider.slides = CSlider.FindByClass(CSlider.slider, CSlider.slidesClass)[0];
                CSlider.slidesElements = CSlider.FindByClass(CSlider.slides, CSlider.slideClass);
                CSlider.slidesWidth = 0;

                CSlider.countSlidesInSlider = CSlider.slides.childElementCount;

                var slideIndex = 0;
                while (slideIndex <= CSlider.countSlidesInSlider - 1) {

                    CSlider.slide = CSlider.slidesElements[slideIndex];

                    if (!CSlider.IsUndefined(CSlider.slide)) {
                        CSlider.slide.style.width = (widthSlider / CSlider.arrCountViewSlide[index]) + "px";
                        CSlider.slideWidth = widthSlider / CSlider.arrCountViewSlide[index]; // сохраним ширину слайда для первого сдвига
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

    // При старте перетаскивания
    OnDragStart: function (_this, event) {

        var slider_id = parseInt(CSlider.GetData(_this, "slider"));

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

        // alert(event.clientY);
    },

    // При перетаскивании
    OnDragMove: function (_this, event) {
        if (CSlider.enableDrag) {

            // alert(event.clientY);

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


            // Если нужно перелистываем слайдер и отключаем draggable
            // if(this.sizeTransformXToSwipe < _this.transformXIsTest) {
            //   this.enableDrag = false;
            //   if(!this.prevSlide(_this.selSliderId)) this.standartedSlideTransform(_this.selSliderId);
            // } else if(-this.sizeTransformXToSwipe > _this.transformXIsTest) {
            //   this.enableDrag = false;
            //   if(!this.nextSlide(_this.selSliderId)) this.standartedSlideTransform(_this.selSliderId);
            // }

        }
    },

    // При окончании перетаскивания
    OnDragEnd: function (_this, event) {
        // alert("ASD")
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
            // return true;
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

        CSlider.standartedSlideTransform(parseInt(_this.selSliderId));
        return true;
    },

    // Выравниваем слайд
    standartedSlideTransform: function (slider_id) {

        this.slider = this.arrSliders[slider_id];
        this.slides = this.FindByClass(this.slider, this.slidesClass)[0];
        this.OnTransition(this.slides);
        this.arrTransforms[slider_id] = -this.arrSlideWidth[slider_id] * this.arrActiveSlide[slider_id];
        this.SetTransfromX(this.slides, this.arrTransforms[slider_id]);

    },

    // Следующий слайд
    nextSlide: function (slider_id) {
        // Пользовательские функции
        if (this.IsFunction(this.fnBeforeNextSlide)) this.fnBeforeNextSlide(event);
        if (this.IsFunction(this.fnBeforeSlideChange)) this.fnBeforeSlideChange();
        // end Пользовательские функции

        this.slider = this.sliders[slider_id];

        if (this.IsUndefined(this.slider)) return false;

        this.slides = this.FindByClass(this.slider, this.slidesClass)[0];

        // включаем анимацию
        this.OnTransition(this.slides);

        // сохраняем последний слайд
        this.oldActiveSlide = this.arrActiveSlide[slider_id];

        // проверяем не последний ли слайд
        this.arrActiveSlide[slider_id] += 1;
        if (this.arrActiveSlide[slider_id] > this.arrCountSlides[slider_id] - this.arrCountViewSlide[slider_id]) {
            this.arrActiveSlide[slider_id] = this.oldActiveSlide;
            return false;
        }

        // блокируем кнопку или нет
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

        this.activeSlideElement = this.FindByClass(this.slides, this.slideClass)[this.arrActiveSlide[slider_id]];
        this.oldActiveSlideElement = this.FindByClass(this.slides, this.slideClass)[this.oldActiveSlide];


        if (!this.activeSlideElement.classList.contains(this.activeSlideClass)) {
            this.activeSlideElement.classList.add(this.activeSlideClass);
            this.oldActiveSlideElement.classList.remove(this.activeSlideClass);
        }

        this.arrTransforms[slider_id] = -this.arrSlideWidth[slider_id] * this.arrActiveSlide[slider_id];
        this.SetTransfromX(this.slides, this.arrTransforms[slider_id]);

        // Работаем с точками если они подключены
        if (this.arrEnablePoints[slider_id]) {
            this.lastBlockPoints = this.arrPoints[slider_id];
            this.lastPoints = this.lastBlockPoints.children;
            for (var i = 0; i < this.lastPoints.length; i++) {
                this.lastPoint = this.lastPoints[i];
                this.lastPoint.classList.remove(this.pointCurrentClass);
            }
            this.lastPoints[this.arrActiveSlide[slider_id]].classList.add(this.pointCurrentClass);
        }

        this.SlidesElements = this.FindByClass(this.slides, this.slideClass);

        this.slideImages = [];

        // Подгрузим изображения слайдов если это нужно
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

        // Пользовательские функции
        if (this.IsFunction(this.fnAfterNextSlide)) this.fnAfterNextSlide(event);
        if (this.IsFunction(this.fnAfterSlideChange)) this.fnAfterSlideChange();
        // end Пользовательские функции

        return true;
    },

    // Прошлый слайд
    prevSlide: function (slider_id) {
        // Пользовательские функции
        if (this.IsFunction(this.fnBeforePrevSlide)) this.fnBeforePrevSlide();
        if (this.IsFunction(this.fnBeforeSlideChange)) this.fnBeforeSlideChange();
        // end Пользовательские функции

        this.slider = this.arrSliders[slider_id];
        this.slides = this.FindByClass(this.slider, this.slidesClass)[0];
        this.OnTransition(this.slides);

        this.oldActiveSlide = this.arrActiveSlide[slider_id];

        --this.arrActiveSlide[slider_id];
        if (this.arrActiveSlide[slider_id] < 0) {
            this.arrActiveSlide[slider_id] = 0;
            return false;
        }

        // блокируем кнопку или нет
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

        // Работаем с точками если они подключены
        if (this.arrEnablePoints[slider_id]) {
            this.lastBlockPoints = this.arrPoints[slider_id];
            this.lastPoints = this.lastBlockPoints.children;
            for (var i = 0; i < this.lastPoints.length; i++) {
                this.lastPoint = this.lastPoints[i];
                this.lastPoint.classList.remove(this.pointCurrentClass);
            }
            this.lastPoints[this.arrActiveSlide[slider_id]].classList.add(this.pointCurrentClass);
        }

        // Пользовательские функции
        if (this.IsFunction(this.fnAfterPrevSlide)) this.fnAfterPrevSlide();
        if (this.IsFunction(this.fnAfterSlideChange)) this.fnAfterSlideChange();
        // end Пользовательские функции

        return true;
    },

    // Показать нужный слайд
    viewSlide: function (slide_id, slider_id = 0) {
        slide_id = parseInt(slide_id);
        if (isNaN(slide_id) || slide_id <= -1) return false;

        // Пользовательские функции
        if (this.IsFunction(this.fnBeforeSlideChange)) this.fnBeforeSlideChange();
        // end Пользовательские функции

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

        // Работаем с точками если они подключены
        if (this.arrEnablePoints[slider_id]) {
            this.lastBlockPoints = this.arrPoints[slider_id];
            this.lastPoints = this.lastBlockPoints.children;
            for (var i = 0; i < this.lastPoints.length; i++) {
                this.lastPoint = this.lastPoints[i];
                this.lastPoint.classList.remove(this.pointCurrentClass);
            }
            this.lastPoints[this.arrActiveSlide[slider_id]].classList.add(this.pointCurrentClass);
        }

        // Пользовательские функции
        if (this.IsFunction(this.fnAfterSlideChange)) this.fnAfterSlideChange();
        // end Пользовательские функции

        return true;
    },

    // Enable transition for .slides
    OnTransition: function (slides) {
        if (typeof slides == "object") {
            return this.SetTransition(slides, false);
        } else if (typeof slides == "number") {
            this.selSlides = this.FindByClass(this.slider, this.slidesClass)[0];
            return this.SetTransition(this.selSlides, false);
        } else return false;
    },

    // Disabled transition for .slides
    OffTransition: function (slides) {
        if (typeof slides == "object") {
            return this.SetTransition(slides, true);
        } else if (typeof slides == "number") {
            this.selSlides = this.FindByClass(this.slider, this.slidesClass)[0];
            return this.SetTransition(this.selSlides, true);
        } else return false;
    },

    /* Ниже идут функции, обрамление для нативных функций  */

    // Получить все элементы имеющие класс class_name
    GetListByClass: function (class_name) {
        return this.FindByClass(document, class_name);
    },

    // Установить transition
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

    // Добавление элементов в объект
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

    // Проверка свойства на функцию
    IsFunction: function (variable) {
        return this.IsType(variable, this.fn);
    },

    // Проверка свойства на объект
    IsObject: function (variable) {
        return this.IsType(variable, this.object);
    },

    // Проверка на строку
    IsString: function (variable) {
        return this.IsType(variable, this.string);
    },

    // Проверка на существование переменной
    IsUndefined(variable) {
        return this.IsType(variable, this.undef);
    },

    // Проверка типа
    IsType(variable, type) {
        if (typeof variable == type) return true; else return false;
    },

    // Установка значения transform для элемента DOM страницы
    SetTransfromX: function (DOMElement, transformPX) {
        return DOMElement.style.transform = "translateX(" + transformPX + "px)";
    },

    // Установка ширины элемента
    SetWidth: function (DOMElement, widthPX) {
        return DOMElement.style.width = widthPX + "px";
    },

    // Найти элементы с классом className в элементе DOMElement
    FindByClass: function (DOMElement, className) {
        return DOMElement.getElementsByClassName(className);
    },

    // Задать атрибут для элемента
    SetAttr: function (DOMElement, attrName, attrValue) {
        return DOMElement.setAttribute(attrName, attrValue);
    },

    // Получить значение атрибута
    GetAttr: function (DOMElement, attrName) {
        return DOMElement.getAttribute(attrName);
    },

    // Установка значения атрибута data к элементу
    SetData: function (DOMElement, dataName, dataValue) {
        return DOMElement.dataset[dataName] = dataValue;
    },

    // Получить значение атрибута data
    GetData: function (DOMElement, dataName) {
        return DOMElement.dataset[dataName];
    },


    // Преобразование переменной к целочисленному типу
    intval: function (variable) {
        return Math.abs(variable);
    },

    // Сохраняем свойство
    SetOption(optionName, optionValue) {
        if (this.IsString(optionValue) || typeof optionValue == "boolean" || typeof optionValue == "number") {
            this[optionName] = optionValue;
        } else return false;
    },

};