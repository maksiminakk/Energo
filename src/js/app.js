"use strict";

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.body.classList.add('_touch');

} else {
    document.body.classList.add('_pc');
};

window.addEventListener("DOMContentLoaded", function () {
    function isWebp() {

        function testWebP(callback) {
            let webP = new Image();
            webP.onload = webP.onerror = function () {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }

        testWebP(function (support) {
            let className = support === true ? 'webp' : 'no-webp';
            document.documentElement.classList.add(className);
        });
    }
    isWebp();

    const menuBody = document.querySelector('.header-bottom');
    const iconMenu = document.querySelector('.header-top__menu-link');
    if (iconMenu) {
        iconMenu.addEventListener("click", function () {
            document.body.classList.toggle('_lock');
            iconMenu.classList.toggle('_active');
            menuBody.classList.toggle('_active');
        });
    }

    //SPOLLERS
    const spollersArray = document.querySelectorAll('[data-spollers]');
    if (spollersArray.length > 0) {
        //получение обычных спойлеров
        const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
            return !item.dataset.spollers.split(",")[0];
        });
        //инициализация спойлера
        if (spollersRegular.length > 0) {
            initSpollers(spollersRegular);
        }
        //получение спойлеров с медиа запросами
        const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
            return item.dataset.spollers.split(",")[0];
        });

        // инициализация спойлеров с медиа запросами
        if (spollersMedia.length > 0) {
            const breakpointsArray = [];
            spollersMedia.forEach(item => {
                const params = item.dataset.spollers;
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });

            //получение уникальных брейкпоинтов
            let mediaQueries = breakpointsArray.map(function (item) {
                return '(' + item.type + "-width:" + item.value + "px)," + item.value + ',' + item.type;
            });
            mediaQueries = mediaQueries.filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });

            //работа с каждым брейкпоинтом
            mediaQueries.forEach(breakpoint => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);

                //обьекты с нужными значениями
                const spollersArray = breakpointsArray.filter(function (item) {
                    if (item.value === mediaBreakpoint && item.type === mediaType) {
                        return true;
                    }
                });
                //событие
                matchMedia.addListener(function () {
                    initSpollers(spollersArray, matchMedia);
                });
                initSpollers(spollersArray, matchMedia);
            });
        }
        //инициализация
        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach(spollersBlock => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add('_init');
                    initSpollerBody(spollersBlock);
                    spollersBlock.addEventListener("click", setSpollerAction);
                } else {
                    spollersBlock.classList.remove('_init');
                    initSpollerBody(spollersBlock, false);
                    spollersBlock.removeEventListener("click", setSpollerAction);
                }
            });
        }

        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
            if (spollerTitles.length > 0) {
                spollerTitles.forEach(spollerTitle => {
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute('tabindex');
                        if (!spollerTitle.classList.contains('_active')) {
                            spollerTitle.nextElementSibling.hidden = true;
                        }
                    } else {
                        spollerTitle.setAttribute('tabindex', '-1');
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                });
            }
        }

        function setSpollerAction(e) {
            const el = e.target;
            if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
                const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
                const spollersBlock = spollerTitle.closest('[data-spollers]');
                const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
                if (!spollersBlock.querySelectorAll('._slide').length) {
                    if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                        hideSpollersBody(spollersBlock);
                    }
                    spollerTitle.classList.toggle('_active');
                    _slideToggle(spollerTitle.nextElementSibling, 500);
                }
                e.preventDefault();
            }
        }

        function hideSpollersBody(spollersBlock) {
            const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
            if (spollerActiveTitle) {
                spollerActiveTitle.classList.remove('_active');
                _slideUp(spollerActiveTitle.nextElementSibling, 500);
            }
        }
    }

    //================================================================================================

    //SlideToggle 
    let _slideUp = (target, duration = 500) => {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            target.style.transitionProperty = 'height, margin, padding';
            target.style.transitionDuration = duration + 'ms';
            target.style.height = target.offsetHeight + 'px';
            target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = true;
                target.style.removeProperty('height');
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('mragin-top');
                target.style.removeProperty('margin-bottom');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
            }, duration);
        }
    }

    let _slideDown = (target, duration = 500) => {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            if (target.hidden) {
                target.hidden = false;
            }
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout(() => {
                target.style.removeProperty('height');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
            }, duration);
        }
    }

    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) {
            return _slideDown(target, duration);
        } else {
            return _slideUp(target, duration);
        }
    }


    const popupLinks = document.querySelectorAll('.popup-link');
    const body = document.querySelector('body');
    const lockPadding = document.querySelectorAll(".lock-padding");

    let unlock = true;

    const timeout = 500;

    if (popupLinks.length > 0) {
        for (let index = 0; index < popupLinks.length; index++) {
            const popupLink = popupLinks[index];
            popupLink.addEventListener("click", function (e) {
                const popupName = popupLink.getAttribute('href').replace('#', '');
                const curentPopup = document.getElementById(popupName);
                popupOpen(curentPopup);
                e.preventDefault();
            });
        }
    }

    const popupCloseIcon = document.querySelectorAll('.close-popup');
    if (popupCloseIcon.length > 0) {
        for (let index = 0; index < popupCloseIcon.length; index++) {
            const el = popupCloseIcon[index];
            el.addEventListener('click', function (e) {
                popupClose(el.closest('.popup'));
                e.preventDefault();
            });
        }
    }

    function popupOpen(curentPopup) {
        if (curentPopup && unlock) {
            const popupActive = document.querySelector('.popup.open');
            if (popupActive) {
                popupClose(popupActive, false);
            } else {
                bodyLock();
            }
            curentPopup.classList.add('open');
            curentPopup.addEventListener("click", function (e) {
                if (!e.target.closest('.popup__content')) {
                    popupClose(e.target.closest('.popup'));
                }
            });
        }
    }

    function popupClose(popupActive, doUnlock = true) {
        if (unlock) {
            popupActive.classList.remove('open');
            if (doUnlock) {
                bodyUnLock();
            }
        }
    }

    function bodyLock() {
        const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = lockPaddingValue;
            }
        }
        body.style.paddingRight = lockPaddingValue;
        body.classList.add('_lock');

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    function bodyUnLock() {
        setTimeout(function () {
            if (lockPadding.length > 0) {
                for (let index = 0; index < lockPadding.length; index++) {
                    const el = lockPadding[index];
                    el.style.paddingRight = '0px';
                }
            }
            body.style.paddingRight = '0px';
            body.classList.remove('_lock');
        }, timeout);

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    document.addEventListener('keydown', function (e) {
        const popupActive = document.querySelector('.popup.open');
        if (e.which === 27) {
            if (popupActive) {
                popupClose(popupActive);
            }

        }
    });


    [].forEach.call(document.querySelectorAll('.tel'), function (input) {
        var keyCode;

        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            var pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            var matrix = "+7 (___) ___ ____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5) this.value = ""
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)

    });

    const inputs = document.querySelectorAll('.input');
    if (inputs.length > 0) {
        inputs.forEach(input => {
            input.addEventListener("input", function (e) {
                if (input.value.length > 0) {
                    addActiveClass(input);
                } else {
                    removeActiveClass(input);
                }

            })

        });
    }

    // const form = document.getElementById('form');\
    const forms = document.querySelectorAll('.form');
    const submitButton = document.getElementById('code-link');
    forms.forEach(form => {
        if (form.length > 0) {
            form.addEventListener('submit', formSend);
        }
        async function formSend(e) {
            e.preventDefault();
            let error = formValidate(form);
        }

        function formValidate(form) {
            let error = 0;
            let formReq = document.querySelectorAll('._req');

            for (let index = 0; index < formReq.length; index++) {
                const input = formReq[index];
                formRemoveError(input);
                if (input.classList.contains('tel')) {
                    if (numberTest(input)) {
                        formAddError(input);
                        error++;
                    }
                }
                if (input.classList.contains('_mail')) {
                    if (mailTest(input)) {
                        formAddError(input);
                        error++;
                    }
                } else {
                    if (input.value === '') {
                        formAddError(input);
                        error++;
                    }
                }

                // if (input.classList.contains('_mail')) {
                //     if (codeTest(input)) {
                //         formAddError(input);
                //         error++;
                //     }
                // }

            }
            return error;
        }
    });

    const map = document.getElementById('map');
    if (map) {
        // ymaps.ready(function () {
        //     var myMap = new ymaps.Map(map, {
        //             center: [55.661574, 37.573856],
        //             zoom: 18
        //         }, {
        //             searchControlProvider: 'yandex#search'
        //         }),

        //         // Создаём макет содержимого.
        //         iconContent = ymaps.templateLayoutFactory.createClass(
        //             '<div class="map__panel">$[properties.iconContent]</div>'
        //         ),

        //         myPlacemark = new ymaps.Placemark([56.014707, 37.204531], {
        //             hintContent: 'Увеличение мощности в магазине Ярче',
        //             balloonContent: 'Здание в Москве на улице Бестужевых имело опосредованное присоединение на 15 кВт через автостоянку. Собственник 3 раза пытался увеличить мощность, но каждый раз ему отказывали'
        //         }, {
        //             // Опции.
        //             // Необходимо указать данный тип макета.
        //             iconLayout: 'default#image',
        //             // Своё изображение иконки метки.
        //             iconImageHref: 'img/icons/map-icon.svg',
        //             // Размеры метки.
        //             iconImageSize: [42, 48],
        //             // Смещение левого верхнего угла иконки относительно
        //             // её "ножки" (точки привязки).
        //             iconImageOffset: [-5, -38]
        //         }),


        //         myPlacemarkWithContent = new ymaps.Placemark([55.661574, 37.573856], {
        //             hintContent: 'Увеличение мощности в магазине Ярче',
        //             balloonContent: 'Здание в Москве на улице Бестужевых имело опосредованное присоединение на 15 кВт через автостоянку. Собственник 3 раза пытался увеличить мощность, но каждый раз ему отказывали',
        //             iconContent: '<img src="img/icons/map-icon.svg">',
        //         }, {
        //             // Опции.
        //             // Необходимо указать данный тип макета.
        //             iconLayout: 'default#imageWithContent',
        //             // Своё изображение иконки метки.
        //             iconImageHref: 'img/ball.png',
        //             // Размеры метки.
        //             iconImageSize: [48, 48],
        //             // Смещение левого верхнего угла иконки относительно
        //             // её "ножки" (точки привязки).
        //             iconImageOffset: [-24, -24],
        //             // Смещение слоя с содержимым относительно слоя с картинкой.
        //             iconContentOffset: [15, 15],
        //             // Макет содержимого.
        //             iconContentLayout: iconContent
        //         });

        //     myMap.geoObjects
        //         .add(myPlacemark)
        //         .add(myPlacemarkWithContent);
        //     myMap.controls.remove('geolocationControl'); // удаляем геолокацию
        //     myMap.controls.remove('searchControl'); // удаляем поиск
        //     myMap.controls.remove('trafficControl'); // удаляем контроль трафика
        //     myMap.controls.remove('typeSelector'); // удаляем тип
        //     myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
        //     myMap.controls.remove('zoomControl'); // удаляем контрол зуммирования
        //     myMap.controls.remove('rulerControl'); // удаляем контрол правил
        //     myMap.behaviors.disable(['scrollZoom']);

        // });
        ymaps.ready(function () {
            var myMap = new ymaps.Map(map, {
                center: [55.733835, 37.588227],
                zoom: 12,
                // Обратите внимание, что в API 2.1 по умолчанию карта создается с элементами управления.
                // Если вам не нужно их добавлять на карту, в ее параметрах передайте пустой массив в поле controls.
                controls: [],

            });

            var myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                balloonContentBody: [
                    '<div class="map-item">',
                    '<div class="map-item__label">',
                    'Увеличение мощности в магазине Ярче',
                    '</div>',
                    '<div class="map-item__text">',
                    '<p>',
                    'Здание в Москве на улице Бестужевых имело опосредованное присоединение на 15 кВт через автостоянку. Собственник 3 раза пытался увеличить мощность, но каждый раз ему отказывали',
                    '</p>',
                    '</div>',
                    '</div>'
                ].join('')
            }, {
                preset: '',
                iconLayout: 'default#image',
                iconImageHref: 'img/icons/map-icon.svg',
                iconImageSize: [40, 52],
                hideIconOnBalloonOpen: false,
                balloonOffset: [85, 160],
                hideIconOnBalloonOpen: false,
            });

            myMap.geoObjects.add(myPlacemark);
            myMap.events.add('click', function () {
                myPlacemark.options.set('iconImageHref', 'img/icons/map-icon.svg');
            });
            myPlacemark.events
                // .add('mouseenter', function (e) {
                //     // Ссылку на объект, вызвавший событие,
                //     // можно получить из поля 'target'.
                //     e.get('target').options.set('iconImageHref', 'img/icons/hover-map-icon.svg');
                // })
                // .add('mouseleave', function (e) {
                //     e.get('target').options.set('iconImageHref','img/icons/map-icon.svg');
                // })
                .add('click', function (e) {
                    e.get('target').options.set('iconImageHref', 'img/icons/hover-map-icon.svg');
                });



        });

    }
    setTimeout(() => {
        const mapWrapper = document.querySelector('.ymaps-2-1-79-inner-panes');
        if (mapWrapper) {
            mapWrapper.insertAdjacentHTML('beforeend', '<div class="map__mask" style="z-index: 1000;"> <!-- support --> </div>');
        }
    }, "1500");

    const dropdwonItems = document.querySelectorAll('.dropdown__content');
    if (dropdwonItems.length > 0) {
        dropdwonItems.forEach(function (dropDownWrapper) {
            const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
            const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
            const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
            const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');

            // Клик по кнопке. Открыть/Закрыть select
            dropDownBtn.addEventListener('click', function (e) {
                toggleActiveClass(dropDownList);
                toggleActiveClass(dropDownBtn);
            });

            // Выбор элемента списка. Запомнить выбранное значение. Закрыть дропдаун
            dropDownListItems.forEach(function (listItem) {
                listItem.addEventListener('click', function (e) {
                    e.stopPropagation();
                    dropDownBtn.innerText = this.innerText;
                    dropDownBtn.focus();
                    dropDownInput.value = this.dataset.value;
                    removeActiveClass(dropDownList);
                    removeActiveClass(dropDownBtn);
                });
            });

            // Клик снаружи дропдауна. Закрыть дропдаун
            document.addEventListener('click', function (e) {
                if (e.target !== dropDownBtn) {
                    removeActiveClass(dropDownList);
                    removeActiveClass(dropDownBtn);
                }
            });

            // Нажатие на Tab или Escape. Закрыть дропдаун
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Tab' || e.key === 'Escape') {
                    removeActiveClass(dropDownList);
                    removeActiveClass(dropDownBtn);
                }
            });
        });
    }

    // const reviewsWrapper = document.querySelector('.reviews__wrapper'),
    //     reviewsMobileSlider = document.querySelector('.reviews__row')
    const worksSlider = new Swiper('.show-works__slider ', {
        sumulateTouch: false, //or false
        touchRatio: 1,
        touchAngel: 45,
        initialSlide: 3,
        grabCursor: true, //or false
        slideToClickedSlide: false, //or false
        hashNavigation: {
            watchState: false, // or false
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.show-works__arrow_next',
            prevEl: '.show-works__arrow_prev',
        },
        // autoHeight: true,
        slidesPerView: 3,
        watchoverflow: false,
        spaceBetween: 24,
        slidesPerGroup: 1,
        centeredSlides: true,
        slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
        loop: false, // or false - не работает с мультирядностью
        loopedSlides: 0, // работает с loop
        freeMode: false,
        //скорость переключения слайдов:
        speed: 600,
        effect: 'slide',
        breakpoints: {
            100: {
                initialSlide: 1,
                slidesPerView: 'auto',
                centeredSlides: false,
            },
            492: {
                initialSlide: 1,
                slidesPerView: 'auto',
                centeredSlides: false,

            },
            767: {
                initialSlide: 1,
                slidesPerView: 'auto',
                centeredSlides: false,

            },
            1024: {
                slidesPerView: 3,
                centeredSlides: true,
            },
            1500: {
                slidesPerView: 3.8,
            }
        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    const faqSlider = new Swiper('.faq-slider__slider ', {
        sumulateTouch: false,
        touchRatio: 1,
        touchAngel: 45,
        grabCursor: true,
        slideToClickedSlide: false,
        hashNavigation: {
            watchState: false,
        },
        navigation: {
            nextEl: '.faq__arrow_next',
            prevEl: '.faq__arrow_prev',
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
            pageUpDown: true,
        },
        slidesPerView: 3,
        watchoverflow: false,
        spaceBetween: 16,
        slidesPerGroup: 1,
        loopedSlides: 0,
        freeMode: false,
        speed: 600,
        effect: 'slide',
        breakpoints: {
            100: {
                spaceBetween: 16,
                slidesPerView: 'auto',
            },
            492: {

            },
            767: {
                spaceBetween: 16,
                slidesPerView: 'auto',
            },
            1024: {
                slidesPerView: 3,
            }
        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    if (window.innerWidth > 1024) {
        document.querySelector('.sublist').classList.add('dropdown__list');
        const reviewsSlider = new Swiper('.reviews__row ', {
            sumulateTouch: false, //or false
            touchRatio: 1,
            touchAngel: 45,
            grabCursor: true, //or false
            slideToClickedSlide: false, //or false
            hashNavigation: {
                watchState: false, // or false
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
                pageUpDown: true,
            },
            autoHeight: true,
            slidesPerView: 3,
            watchoverflow: false,
            spaceBetween: 30,
            slidesPerGroup: 1,
            centeredSlides: false,
            slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
            loop: false, // or false - не работает с мультирядностью
            loopedSlides: 0, // работает с loop
            freeMode: false,
            //скорость переключения слайдов:
            speed: 600,
            effect: 'slide',
            breakpoints: {
                100: {
                    spaceBetween: 10,
                },
                492: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                767: {
                    spaceBetween: 24,
                    slidesPerView: 1,
                },
                1024: {
                    slidesPerView: 3,
                }
            },
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
        });
    }
    if (window.innerWidth < 767) {
        const certificatesSlider = new Swiper('.certificates__row ', {
            sumulateTouch: false,
            touchRatio: 1,
            touchAngel: 45,
            grabCursor: true,
            slideToClickedSlide: false,
            hashNavigation: {
                watchState: false,
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
                pageUpDown: true,
            },
            autoHeight: false,
            slidesPerView: 3,
            watchoverflow: false,
            spaceBetween: 30,
            slidesPerGroup: 1,
            centeredSlides: true,
            slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
            loop: false, // or false - не работает с мультирядностью
            loopedSlides: 0, // работает с loop
            freeMode: false,
            //скорость переключения слайдов:
            speed: 600,
            effect: 'slide',
            breakpoints: {
                100: {
                    spaceBetween: 10,
                    slidesPerView: 'auto',
                    centeredSlides: true
                },
                492: {

                    spaceBetween: 20,
                },
                767: {
                    spaceBetween: 24,
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            },
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
        });
    }
    if (window.innerWidth < 1400) {
        const projectsContent = document.querySelector('.projects__content');
        if (projectsContent) {
            projectsContent.classList.add('container');
        }
    }
    const checboxes = document.querySelectorAll('.checkbox');
    checboxes.forEach(checkbox => {
        checkbox.addEventListener("click", function () {
            toggleActiveClass(checkbox);
        });
    });

    const tabBtns = Array.from(document.querySelectorAll(".tab__btn"));
    const tabSlide = Array.from(document.querySelectorAll(".tab__slide"));
    const numBtns = tabBtns.length;
    if (tabBtns.length > 0) {
        tabBtns[0].classList.add("_active");
        tabSlide[0].classList.add("_active");

        let activeBtn = tabBtns[0];
        let activeSlide = tabSlide[0];

        tabBtns.forEach((el) => {
            el.addEventListener("click", onTabBtnClick);
        });

        function onTabBtnClick(e) {
            e.preventDefault();
            const btn = e.target.closest(".tab__btn");
            changeBtn(btn);
        }

        function changeBtn(btn) {
            if (btn.classList.contains("_active")) {
                return;
            }
            activeBtn.classList.remove("_active");
            btn.classList.add("_active");
            activeBtn = btn;
            changeIndicator(btn);
        }

        function changeIndicator(btn) {
            const indexBtn = tabBtns.indexOf(btn);
            changeSlide(indexBtn);
        }

        function changeSlide(index) {
            activeSlide.classList.remove("_active");
            tabSlide[index].classList.add("_active");
            activeSlide = tabSlide[index];
        }
    }

    
    const quizItems = this.document.querySelectorAll('.quiz__item');

    quizItems.forEach(item => {
        item.addEventListener("click", function () {
            const activeStep = item.closest('.quiz__step');
            activeStep.nextElementSibling.classList.add('_active');
            activeStep.classList.remove('_active');
        });
    });

    const fileInput = this.document.getElementById('fileInput'),
        filePreview = this.document.getElementById('filePreview');

    if (fileInput) {
        fileInput.addEventListener('change', function () {
            uploadFile(fileInput.files[0]);
        });
    }
    
    function uploadFile (file) {
        if (!['application/pdf'].includes(file.type)) {
            alert('Разрешены только pdf файлы');
            fileInput.value = '';
            return;
        }

        var reader = new FileReader();
        reader.fileName = file.name;
        reader.onload = function (e) {
            filePreview.innerHTML = `<div class="quiz__preview quiz-preview">
            <div class="quiz-preview__left  ">
                <div class="quiz-preview__icon">
                    <img src="img/icons/article.svg" alt="">
                </div>
                <div id="filePreview" class="quiz-preview__title">
                    ${e.target.fileName}
                </div>
            </div>
            <div class="quiz-preview__right">
                <button type="button" class="quiz-preview__button">

                </button>
            </div>
        </div>`;
        };
        reader.onerror = function (e) {
            alert('Ошибка');

        };
        reader.readAsDataURL(file);
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }

    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    function numberTest(input) {
        return !/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(input.value);
    }

    function mailTest(input) {
        return !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(input.value);
    }

    const servicesItems = document.querySelectorAll('.services__item');
    if (servicesItems.length > 0) {
        servicesItems.forEach(servicesItem => {
            servicesItem.addEventListener("click", function () {
                toggleActiveClass(servicesItem);
            });
        });
    }

    function toggleActiveClass(el) {
        el.classList.toggle('_active');
        el.parentElement.classList.toggle('_active');
    }

    function addActiveClass(el) {
        el.classList.add('_active');
        el.parentElement.classList.add('_active');
    }

    function removeActiveClass(el) {
        el.classList.remove('_active');
        el.parentElement.classList.remove('_active');
    }


});

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.body.classList.add('_touch');

} else {
    document.body.classList.add('_pc');
};



