
function Control() {
    this.time = audio[0].duration; // 总时长
    this.totalLength = $('#greyline').width() - $('#circle').width(); //拉条能走的总长度
}
Control.prototype = {
    // 设置当前播放的时间
    initEndTime: function () {
        // 执行函数，设置歌曲时长标签
        $('#endtime').text(currentTimeTonowTime(this.time));
    },
    initLyricsPlate: function (name) {
        var offSet = 0;
        $('.lyricsPlate ul').empty();
        let obj = lrcs[name]
        for (let key in obj) {
            $('.lyricsPlate ul').append("<li id=" + key + " offSet=" + offSet + ">" + obj[key] + "</li>");
            offSet -= 75;
        }
        this.lyricsPlateHeight = $('.lyricsPlate').height();
    },
    setLyricsPlate: function (control) {
        var ct = control.getCurrentTime();
        for (let i = 0; i < $('.lyricsPlate ul li').length; i++) {
            for (let j = ct; j > 0; j--) {
                if (currentTimeTonowTime(j) == $('.lyricsPlate ul li').eq(i).attr('id')) {
                    let offset = $('.lyricsPlate ul li').eq(i).attr('offSet');
                    $('.lyricsPlate ul li').eq(i).css('color', 'rgb(0, 205, 126)');
                    $('.lyricsPlate ul li').eq(i).siblings().css('color', 'white');
                    $('.lyricsPlate').css('margin-top', offset + 'px');
                }
            }
        }
    },
    setCurrentTime: function (slideBarWidth) {
        let currentTime = slideBarWidth / this.totalLength * this.time;
        $('audio').get(0).currentTime = currentTime;
    },
    // 设置拉条的长度，以及显示当前时间，isSlide 为true时，为手动拉进度条的事件。false执行自然播放事件
    setSlideBar: function (currentTime, isSlide) {
        // isSlide ==false 通过传进时间来改变长度，
        // isSlide ==true  通过传进拉拽长度来改变长度。
        if (isSlide == false) {
            // 判断当前播放时间
            if (currentTime > this.time || currentTime < 0) {
                return;
            }
            $('#line').width(currentTime / this.time * this.totalLength + 'px');
            $('#circle').css('left', currentTime / this.time * this.totalLength + 'px');
        } else {
            // 判断当滚动条过长时停止
            if (currentTime > this.totalLength || currentTime < 0) {
                return;
            }
            $('#line').width(currentTime + 'px');
            $('#circle').css('left', currentTime + 'px');
            currentTime = currentTime / this.totalLength * this.time; //此时传进来的是长度，把长度转换成对应的时间
        }
        $('#nowtime').text(currentTimeTonowTime(currentTime));
    },
    // 获取当前播放的时间
    getCurrentTime: function () {
        return $('audio').get(0).currentTime;
    },
    // 获取当前拉条长度
    getSlideBar: function () {
        return $('#line').width();
    },
    // 下一首
    nextSong: function (obj) {
        infoChange(obj, '知道不知道','刘若英');
    },
    previousSong: function (obj) {
        infoChange(obj, '传奇','王菲');
    }
}
// 设置刷新控制台信息的函数
function setControlBar(control) {
    // 重置滑条长度
    control.setSlideBar(control.getCurrentTime(), false);
    control.setLyricsPlate(control);
}

// 切换歌曲 更换信息的函数
function infoChange(obj, name,singer) {
    obj.name = name;;
    audio.attr('src', 'src/' + name + '.mp3');
    $('audio').on('canplay', function () {
        obj.time = this.duration;
        obj.initEndTime();
        obj.initLyricsPlate(name)
    })
    $('.title').text(name);
    $('.singer span').text(singer);
    $('.play img').attr('src', './images/pause.png').attr('play', 'false');
    $('.play img').click();
    $('#CD').css('background-image', 'url(./images/'+singer+'.jpg)')
    $('.mask').css('background-image', 'url(./images/'+singer+'.jpg)')
    $('.CDPlate').fadeIn(200).siblings().fadeOut(200);
    $('#onesentence').text('');
    $('.lyricsPlate').css('margin-top', '0px');
}

// 将当前播放时间转化为00：00格式的字符串
function currentTimeTonowTime(currentTime) {
    let min = parseInt(currentTime / 60);
    let second = parseInt(currentTime % 60);
    if (min < 10) {
        min = '0' + min;
    }
    if (second < 10) {
        second = '0' + second;
    }
    return min + ':' + second;
}