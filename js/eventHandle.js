    var isSlide;
    var isDown = false;
    var timer;
    var audio = $('audio');
    var control;
    var songs = [];
    var index = 0;
    songs.push({
        'name': '传奇',
        'singer': '王菲'
    }, {
        'name': '知道不知道',
        'singer': '刘若英'
    });
    console.log(songs)
    setTimeout(function () {
        control = new Control();
        control.initLyricsPlate(songs[0].name);
        control.initEndTime(control.time);
        // 监听CD的点击事件，实现CD 和 歌词板 互换
        $('section').on('click', '.lyricsPlate,.CDPlate', function () {
            $(this).fadeOut(200).siblings().fadeIn(200);
        })
        // 监听播放键点击事件
        $('.play img').click(function (e) {
            e.stopImmediatePropagation();
            clearInterval(timer);
            if ($(this).attr('play') == 'false') {
                $(this).attr('src', './images/pause.png').attr('play', 'true');
                timer = setInterval(function () {
                    setControlBar(control);
                }, 1000);
                audio.get(0).play();
                console.log('点击了播放键')
            } else {
                clearInterval(timer);
                audio.get(0).pause();
                $(this).attr('src', './images/play.png').attr('play', 'false');
                console.log('点击了暂停')
            }
        })
        $('.like').click(function () {
            $(this).toggleClass('likeon');
        });
        $('.next').click(function (e) {
            e.stopImmediatePropagation();
            control.nextSong(control);
        });
        $('.previous').click(function (e) {
            e.stopImmediatePropagation();
            control.previousSong(control);
        });
        $('audio').on('ended', function () {
            control.nextSong(control);
        })
        // 用户触摸屏幕，拖拽进度条事件
        $('#circle').on('touchstart', function () {
            isDown = true;
            clearInterval(timer);
        }).on('touchend', function (e) {
            e.stopImmediatePropagation();
            control.setCurrentTime(control.getSlideBar());
            setControlBar(control);
            timer = setInterval(function () {
                setControlBar(control);
            }, 1000);
            isDown = false;
        }).on('touchmove', function (e) {
            // 将鼠标的x坐标经过计算变成线的长度
            var lineLength = e.originalEvent.targetTouches[0].pageX - $('#nowtime').width() - $(
                '#circle').width();
            e.preventDefault();
            if (isDown == true) {
                control.setSlideBar(lineLength, true);
            }
        });
    }, 1000);