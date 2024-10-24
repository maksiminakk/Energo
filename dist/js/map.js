document.addEventListener('DOMContentLoaded', function () {
    const map = document.getElementById('map');
    if (map) {
        ymaps.ready(function () {
            var myMap = new ymaps.Map(map, {
                center: [55.733835, 37.588227],
                zoom: 12,
                controls: ['zoomControl', 'rulerControl']
            });

            var myPlacemark2 = new ymaps.Placemark([55.755864, 37.617698], {
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
            myMap.geoObjects.add(myPlacemark2);
            myMap.events.add('click', function () {
                myPlacemark.options.set('iconImageHref', 'img/icons/map-icon.svg');
            });
            myPlacemark.events
                .add('click', function (e) {
                    e.get('target').options.set('iconImageHref', 'img/icons/hover-map-icon.svg');
                    if (e.get('target') !== myPlacemark) {
                        myPlacemark.options.set('iconImageHref', 'img/icons/map-icon.svg');
                    }
                });
            myPlacemark2.events
                .add('click', function (e) {
                    e.get('target').options.set('iconImageHref', 'img/icons/hover-map-icon.svg');
                    if (e.get('target') !== myPlacemark2) {
                        e.get('target').options.set('iconImageHref', 'img/icons/map-icon.svg');
                    }
                });
        });

    }
    setTimeout(() => {
        const mapWrapper = document.querySelector('.ymaps-2-1-79-inner-panes');
        if (mapWrapper) {
            mapWrapper.insertAdjacentHTML('beforeend', '<div class="map__mask" style="z-index: 1000;"> <!-- support --> </div>');
        }
    }, "1500");
});