/**
 * calendarjs
 * xisa
 * 1.1.2(2014-2016)
 */
 /*
    依赖iscroll 
    底层库使用 Zepto 或者 jQuery
 */
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Calendarjs = factory();
  }
}(this, function() {
    'use strict';
    function Calendarjs(element, options) {
        this.ele = $(element);
        var id   = this.ele.attr('id');
        // 如果没有ID 则自动创建一个id
        if (!id) {
            id = 'calendarjs' + Math.random().toString().replace('0.', '');
            this.ele.attr('id', id);
        }
        this.id      = id;
        this._events = {};

        this.init(options);
    }

    Calendarjs.prototype = {
        version: '0.3.0',
        // 初始化
        init: function (options) {
            var nowDate = new Date(), op, systemDate;

            op = this.options = $.extend(true, {
                texts: {today: '今天', start: '开始', end: '结束'},
                weekName: ['日', '一', '二', '三', '四', '五', '六'],
                span: 30,   // 选择日期跨度有几天
                displayMonthNumber: 3,
                nowDate: nowDate,
                systemDate: nowDate,
                windowWidth: window.screen.width,
                windowHeight: window.screen.height,
                clickNoRepeat: true,   // 防止重复点击
                defalutDate: nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' +  nowDate.getDate(),
            }, options);

            op.intervalDate = [op.defalutDate, op.defalutDate];
            systemDate = new Date(op.systemDate);

            // 第一个版本只考虑横向滚动
            if (op.type === 'schedule') {
                op.wScroll = true;
            }

            // 系统时间
            op.newDateYMD = {
                getYear: systemDate.getFullYear(),
                getMonth: systemDate.getMonth(),
                getDay: systemDate.getDate()
            }

            // 返回间隔时间的每一天
            op.getIntervalDate = this._getIntervalDate(op.intervalDate[0], op.intervalDate[1]);

            // var render = this.options.render;
            // if (render) {
            //     this.options.target = render.replace('.', "").replace('#', "") + '-widget-calendar';
            //     this.render();
            // }

            // 执行render
            this.render();
        },
        // 入口
        render: function () {
            // 创建iscroll
        },
        // 滚动动画
        scrollAnimation: function (index, flg) {
            var op = this.options,
                clickNoRepeat = op.clickNoRepeat,
                left;

            op.clickPage = true;

            // 是否是点击切换到上下月
            if (!flg) {
                op.isClickScroll = true;
            }
            left = index === 0 ? 0 : -op.windowWidth * 2;

            // 防止多次点击
            if (!clickNoRepeat) return;

            clickNoRepeat = false;
            op.is.scrollTo(left, 0, 300);

            setTimeout(function () {
                clickNoRepeat = true;
            }, 301);
        },
        // 滑动到上一个月
        slideScrollPrev: function (flg) {
            // 重新赋值滚动到那一页
            this.options.currentPage = 0;
            this.scrollAnimation(0, flg);
        },
        // 滑动到下一个月
        slideScrollNext: function (flg) {
            // 重新赋值滚动到那一页
            this.options.currentPage = 2;
            this.scrollAnimation(2, flg);
        },
        // 设置日期
        setDate: function (date) {
            var op = this.options, callback, _d;
            // 第一次加载滑动可以执行回调
            if (this._firstRender) {
                op.isClickScroll = true;
            }
            // 重置
            this._firstRender = false;

            op.newSystemDate = date;
            if (typeof date === 'string') {
                _d = new Date(date);
                op.newSystemDate = {
                    getYear: _d.getFullYear(),
                    getMonth: _d.getMonth() - 1,
                    getDay: 1
                };
            }

            // 销毁之前的iscroll
            op.is.destroy();
            op.is = null;
            $(op.render).html('');
            // 重新初始化日期 重新渲染dom
            this._init(op);

            // 滚动完毕之后回调当前是那一年和月份
            callback = op.callback;
            
            if ($.isFunction(callback) && op.isClickScroll) {
                var nowDate = $( "#" + op.target).find('.widget-select-date:nth-child(2)').attr('data-date').split('-');
                
                callback({
                    year: nowDate[0],
                    month: nowDate[1],
                    date: nowDate[0] + '-' + nowDate[1]
                });
            }
        },
        reloadIscroll: function (index) {

            if (index !== 1) {
                var _d = $( "#" + this.options.target).find('.widget-select-date:nth-child(2)').attr('data-date')
                    , _dArr = _d.split('-')
                    , _m = parseInt(_dArr[1]) + (index == 2 ? 1 : -1)
                    , newSystemDate = new Date( _dArr[0], _m-1, 1)
                    ;

                this.setDate({
                    getYear: newSystemDate.getFullYear(),
                    getMonth: newSystemDate.getMonth()-1,
                    getDay: 1
                });
            }
        },
        _event: function () {
            
            var self = this
                , op = self.options
                , render = op.render
                , span = op.span
                , texts = op.texts
                , todayText = texts.today
                , startText = texts.start
                , endText = texts.end
                , callback = op.callback
                , target = "#" + op.target
                , is = op.is
                , wScroll = op.wScroll
                , tdString = target + ' .widget-select-date-table tr td'
                , td = $(tdString)
                , evt = self.evt
                , adpter = op.adpter
                , adpterLength = 0
                , type = op.type
                ;

            target = $(target);

            // 横向滚动
            if (wScroll) {
                is.on('scrollStart', function () {
                    target.addClass('widget-select-date-td-bdr');
                    self.options.clickPage = false;
                    // if (type === 'schedule') {
                    //     //
                    // }
                });
                var scrollMoveIndex = 0;
                is.on('scrollMove', function () {
                    scrollMoveIndex = this.x;
                });
                is.on('scrollEnd', function () {
                    target.removeClass('widget-select-date-td-bdr');
                    if (type === 'schedule') {
                        var index = this.currentPage.pageX;
                        if (Math.abs(scrollMoveIndex) > op.windowWidth*2) {
                            index = 2;
                        }
                        // 调用分页方法
                        if (op.clickPage) { // 防止多次点击
                            index = op.currentPage;
                        }
                        // 重新渲染dom
                        self.reloadIscroll.call(self, index);
                    }
                });
            }

            // 点击事件
            evt.bind(target, '.widget-select-date-table tr td', "click", function (dom) {
                // 是否是点击切换到上下月
                self.options.isClickScroll = true;
                var attrSelect = 'data-select'
                    , firstClickDate = target.find('.click').attr('data-date')  // 第一次点击
                    , endClickDate = dom.attr('data-date')            // 结束日期
                    , getIntervalDay = firstClickDate ? self._getIntervalDate(firstClickDate, endClickDate) : 0
                    , obj = {} // 返回数据
                    ;
                if (type === 'schedule') {
                    target.find('.click').removeClass('click');
                    target.find('.active').removeClass('active');
                    dom.addClass('click');  
                    if ($.isFunction(adpter) && $.isFunction(callback)) {
                        var adpterFn = adpter() || [];
                        adpterLength = $.isArray(adpterFn) ? adpterFn.length : 0;
                        var data = {};
                        for (var d = 0; d < adpterLength; d++) {
                            var dataF = adpterFn[d]
                                , flg = new Date(dataF.date).getTime() === new Date(endClickDate).getTime() ? true : false
                                ;
                            if (flg && dataF.values) {
                                data = dataF.values.data;
                            }
                        }
                        var newDateYearMonth = $( "#" + self.options.target).find('.widget-select-date:nth-child(2)').attr('data-date').split('-');

                        var endClickDateArr = endClickDate.split('-');

                        if (new Date(endClickDate).getTime() < new Date(newDateYearMonth[0] + '-' + newDateYearMonth[1] + '-1').getTime()) {
                            
                            // 重新渲染dom
                            setTimeout(function () {
                                self.options.isClickScroll = false;
                                // false滚动回调方法不会执行
                                self.slideScrollPrev(true);
                            }, 6);
                            
                        } else if (new Date(endClickDateArr[0], (Math.abs(endClickDateArr[1]) - 1), endClickDateArr[2]).getTime() > new Date(newDateYearMonth[0], newDateYearMonth[1], 0).getTime()) {
                            setTimeout(function () {
                                self.options.isClickScroll = false;
                                // false滚动回调方法不会执行
                                self.slideScrollNext(true);
                            }, 6);
                        }

                        self.options.endClickDate = endClickDate;
                        callback({
                            year: endClickDate.split('-')[0],
                            month: endClickDate.split('-')[1],
                            date: endClickDate,
                            data: data
                        });
                    }
                } 
                else if ( !dom.hasClass('widget-color-gray') ) {

                    target.find('.defalut-class').attr(attrSelect, '');
                    target.find('.day').attr(attrSelect, todayText);
                    td.removeClass('active').removeClass('defalut-class');

                    var firstDay = firstClickDate ? Date.parse(firstClickDate) : 0
                        , lastDay = Date.parse(endClickDate)
                        , intervalDay = firstClickDate ? self._getDateDiff(firstDay, lastDay) + 1 : ''
                        ;

                    if (intervalDay > span && lastDay > firstDay) {

                        if( !$('#toast').length ){
                            op.popup('选中时间段不能大于' + span + '天', 2000);
                        }

                        dom.addClass('active');

                        setTimeout(function () {
                            td.removeClass('active');
                        }, 100);

                    } else {

                        if (firstClickDate &&  firstDay > lastDay) {

                            td.removeClass('click').removeAttr(attrSelect, '');
                            dom.addClass('click');
                            target.find('.day').attr(attrSelect, todayText);
                            target.find('.click').attr(attrSelect, startText);

                        } else {
                            if (firstClickDate == endClickDate) {

                                td.removeClass('click');
                                target.find('.day').attr(attrSelect, todayText);

                            }else{

                                dom.addClass('click');

                                if (firstClickDate) { // 返回选中的日期区间数据

                                    dom.attr(attrSelect, endText);
                                    obj = {
                                        span: intervalDay,           // 间隔多少天
                                        startDate: firstClickDate,   // 开始时间
                                        endDate: endClickDate,       // 结束时间
                                        intervalDate: getIntervalDay // 间隔的每一天日期
                                    }
                                    
                                    // 连续时间段现在颜色
                                    td.each(function () {
                                        var attrDate = $(this).attr('data-date');
                                        if (obj.intervalDate.indexOf(attrDate) >= 0) {  // 判断数组里面是否包含
                                            $(this).addClass('active');
                                        }
                                    });
                                    if ($.isFunction(callback)) {
                                        callback(obj);
                                    }

                                    // 回调完毕清空之前选择的数据
                                    var selectTd = $(tdString + '.active')
                                        , length = selectTd.length
                                        ;
                                    obj = {};
                                    firstDay = null;
                                    endClickDate = null;
                                    td.removeClass('click').removeAttr(attrSelect);
                                    target.find('.day').attr(attrSelect, todayText);
                                    selectTd.eq(0).attr(attrSelect, startText);
                                    selectTd.eq(length - 1).attr(attrSelect, endText);

                                } else {

                                    target.find('.click').attr(attrSelect, startText);

                                }
                            }
                        }
                    }
                }
            });
        },
        // 获取时间戳
        _getTime: function (date) {
            if (date) {
                return new Date(Date.parse(date.replace(/-/g,"/"))).getTime();
            } else {
                return 0;
            }
        },
        // 时间间隔计算
        _getDateDiff: function (startDate, endDate) { 
            var startTime   = typeof startDate == 'string' ? this._getTime(startDate) : startDate  
                , endTime   = typeof endDate == 'string' ? this._getTime(endDate) : endDate
                , timestamp = Math.abs(startTime - endTime) / (1000*60*60*24)
                ;     
            return timestamp;    
        },
        // 返回间隔时间的每一天
        _getIntervalDate: function (startDate, endDate) {
            var intervalDay      = this._getDateDiff(endDate, startDate) // 计算间隔有多少天
                , startDateToArr = startDate.split('-')
                , year           = parseInt( startDateToArr[0] )
                , month          = parseInt( startDateToArr[1] ) - 1
                , day            = parseInt( startDateToArr[2] )
                ;
            for (var arr = [], m = 0; m <= intervalDay; m++ ) {
                var newDate = new Date(year, month, day + m);
                arr.push( newDate.getFullYear() + '-' + (newDate.getMonth() + 1 ) + '-' + newDate.getDate() );
            }
            return arr;
        },
        // 得到某个月份的天数
        _DayNumOfMonth: function (Year, Month) {
            return new Date(Year, Month, 0).getDate();
        },
        _createIscroll: function () {
            var op = this.options
                , render = op.render
                , type = op.type
                , html = this._createTemplate()
                , title = op.texts.title
                ;

            if (title) {
                $(render).attr('data-title', title).addClass('title');
            }

            $(render).html(html);

            // 获取当前是年月
            op.nowDateYearMonth = $( "#" + op.target).find('.widget-select-date:nth-child(1)').attr('data-date').split('-');
            // 默认第一次加载回调年月
            if (this._firstRender) {
                var today = op.today
                    , callback = op.callback
                    ;
                if ($.isFunction(callback)) {
                    callback({
                        year: today.split('-')[0],
                        month: today.split('-')[1],
                        date: today
                    });
                }
            }
            var isOption = {};
            if (op.wScroll) {
                isOption = {
                    snap: true,
                    snapSpeed: 300,
                    snapThreshold: 0.085, // 滑动距离比
                    scrollX: op.wScroll,
                    scrollY: false
                }
            }
            op.is = new IScroll(render, isOption);

            // 日程组件 widget-select-date
            if (type === 'schedule') {

                var target = $('#' + op.target)
                    , width = op.windowWidth
                    , systemDate = new Date(op.systemDate)
                    , endClickDate = op.endClickDate
                    , year = systemDate.getFullYear()
                    , month = systemDate.getMonth() + 1
                    , day = systemDate.getDate()
                    , nowDate = target.find('td[data-date="' + year + '-' + month + '-' + day + '"]')
                    , hei = target.find('.widget-select-date-schedule').height()
                    ;
                target.parent(render).height(hei).addClass('textOverflow');
                op.is.refresh();

                op.is.scrollTo(-width, 0, 0);
                nowDate.attr('data-select', op.texts.today);
                
                if (typeof endClickDate === 'string') {
                    var clickDate = endClickDate.split('-');

                    if (clickDate[0] == year && clickDate[1] == month) {
                        nowDate.removeClass('active');
                    }
                    target.find('td[data-date="' + endClickDate + '"]').addClass('click');
                }

            }
        },
        _createTemplate: function () {

            var op = this.options,
                scheduleCls  = '',
                intervalDate = op.intervalDate,
                newDateYMD   = op.newSystemDate || op.newDateYMD,
                systemDate   = op.systemDate,
                displayMonthNumber = op.displayMonthNumber,
                getIntervalDate = op.getIntervalDate,
                wScroll      = op.wScroll,
                windowWidth  = op.windowWidth,
                adpterLength = 0,
                type      = op.type,
                weekName  = op.weekName,
                texts     = op.texts,
                todayText = texts.today,
                startText = texts.start,
                endText   = texts.end,
                adpter    = op.adpter,
                i = 0
                ;

            if (type === 'schedule') {
                
                displayMonthNumber = 3;
                scheduleCls = ' widget-select-date-schedule';
                if ($.isFunction(adpter)) {
                    adpter = adpter() || [];
                    adpterLength = $.isArray(adpter) ? adpter.length : 0;
                }
            }

            // 日期
            var  _html = '<article class="widget-select-date-iscroll' + scheduleCls + '" id="' + op.target + (wScroll ? '" style="width:' + windowWidth*displayMonthNumber + 'px;overflow:hidden;"' : '"') +'>';

            for (; i < displayMonthNumber; i++) {
                
                var newDate        = new Date(newDateYMD.getYear, newDateYMD.getMonth + i + (this._firstRender ? -1 : 0))
                    , year         = newDate.getFullYear()
                    , month        = newDate.getMonth() + 1
                    , firstDay     = new Date(year, month - 1, 1).getDay()   //  获取一个月中第一天是星期几
                    , currentMonthDay = this._DayNumOfMonth(year, month) // 获取当前月份多少天
                    , filling      = currentMonthDay + firstDay
                    ;
                    
                // 需要填补后面空位
                filling = filling % 7 === 0 ? filling : filling + (7 - filling % 7); 

                _html += '<div class="widget-select-date" data-date="' + year + '-' + month + '"' + (wScroll ? ' style="float:left;width:100vw"' : '') + '>' + 
                         '  <h3 class="widget-select-date-h3">' + ( year != op.newDateYMD.getYear ? (year + '年') : '' )+ month +'月</h3>' + 
                         '  <table width="100%" class="widget-select-date-table"><tbody>';
                                for (var n = 0; n < filling; n++) {
                                    if (n%7 === 0) { //计算有多少行tr
                                        _html += '<tr>';
                                        for ( var j = n; j < (n + 7) ; j++ ) {
                                            var _day = j - firstDay + 1
                                                , _year_month_day = year + '-' + month + '-' + _day
                                                , _week = new Date(year, month-1, _day).getDay()
                                                , _weekClass = (_week == 0 || _week == 6) ? 'green ' : ''
                                                , _isExpired = ''
                                                , _select = ''
                                                , _defalut = ''
                                                , _defalut_class = ''
                                                , _active = type === 'schedule' ? '' : (getIntervalDate.indexOf(_year_month_day) >= 0 ? 'active ' : '')
                                                , scheduleAttr = ''
                                                , scheduleTdCls = ''
                                                ;
                                                
                                            if (type === 'schedule') {
                                                for (var d = 0; d < adpterLength; d++){
                                                    var dataF = adpter[d]
                                                        , flg = new Date(dataF.date).getTime() === new Date(_year_month_day).getTime() ? true : false
                                                        ;
                                                    if (flg) {
                                                        var values = dataF.values;
                                                        if (values) {
                                                            var str = ''
                                                                , des = values.des
                                                                , text = values.text
                                                                ;
                                                            if (des) {
                                                                str += 'data-scheduledes="' + des + '" '
                                                            }
                                                            if (text) {
                                                                str += 'data-scheduletext="' + text + '"'
                                                            }

                                                            scheduleAttr = str;
                                                        }
                                                    }
                                                    
                                                }

                                                if (scheduleAttr !== '') {
                                                    scheduleTdCls = 'schedule-td ';
                                                }
                                            }

                                            if (year > newDateYMD.getYear || month > (newDateYMD.getMonth + 1)) {
                                                _isExpired = '';
                                            }

                                            var _s = new Date(systemDate);
                                            // 设置当天为默认颜色
                                            if (_s.getFullYear() == year && (_s.getMonth()+1) == month && _s.getDate() == _day) {
                                                _select = todayText;
                                                // 设置今天
                                                this.options.today = year + '-' + month + '-' + _day;
                                            }

                                            if (!op.today || new Date(_year_month_day).getTime() < new Date(op.today).getTime()) {
                                                _isExpired = 'widget-color-gray';
                                            }

                                            // 设置当天为默认颜色
                                            if ( type === 'schedule') {
                                                var _s = new Date(systemDate);
                                                if (_s.getFullYear() == year && (_s.getMonth()+1) == month && _s.getDate() == _day) {
                                                    _defalut_class = 'defalut-class';
                                                }
                                            } else {
                                                if (_year_month_day == intervalDate[0]) {

                                                    if (intervalDate[0] != intervalDate[1]) {
                                                        _defalut = startText;
                                                    }

                                                    _defalut_class = 'defalut-class';
                                                }

                                                if (_year_month_day == intervalDate[1]) {

                                                    if( intervalDate[0] != intervalDate[1] ) {
                                                        _defalut = endText;
                                                    }

                                                    _defalut_class = 'defalut-class';
                                                }
                                            }
                                            
                                            // 补全上一个月和下一个月
                                            if (j < firstDay || _day > currentMonthDay) {
                                                if (type === 'schedule') {
                                                    var expiredDate        = new Date(year, month-1, _day)
                                                        , expiredDateYear  = expiredDate.getFullYear()
                                                        , expiredDateMonth = expiredDate.getMonth()+1
                                                        , expiredDateDay   = expiredDate.getDate()
                                                        , attr = expiredDateYear + '-' + expiredDateMonth + '-' + expiredDateDay
                                                        ;

                                                    _html += '<td class="widget-color-gray none" data-date="' + attr + '" data-value="' + expiredDateDay + '"></td>';
                                                } else {
                                                    _html += '<td class="widget-color-gray none"></td>';
                                                }
                                                
                                            }
                                            else {
                                                var cls = ' class="' + scheduleTdCls + _defalut_class + ' ' + _active + ' ' + _weekClass + ' ' + _isExpired + ' ' + ( _select ? 'day' : '' ) + '"'
                                                    , attrDate   = ' data-date="' + _year_month_day + '"'
                                                    , attrValue  = ' data-value="' + _day + '"'
                                                    , attrWeek   = ' data-week="' + _week + '"'
                                                    , attrSelect = ' data-select="' + ( _defalut || _select ) + '"';
                                                    ;
                                                _html += '<td' + cls + attrDate + attrValue + attrWeek + attrSelect  + '>' + (scheduleTdCls !== '' ? '<span class="day" ' + scheduleAttr + '></span>' : '') + '</td>';
                                            }
                                        }
                                        _html += '</tr>';
                                    }
                                }
                _html += '</tbody></table></div>';
            }
            _html += '</article>';


            // 星期title
            _html += '<table width="100%" class="widget-select-date-table-header"><tr>';

            for (var w = 0, len = weekName.length; w < len; w++) {
                _html += '<th>' + weekName[w] + '</th>';
            }

            _html += '</tr></table>';

            return _html;
        },
        // 销毁calendarjs
        destroy: function () {
            // 删除上拉下拉刷新节点
        },
        // 刷新calendarjs
        refresh: function (refresh) {
            // 
        },
        // 点击事件
        evt: function Events(element, type, eventHandle, flg){
            var touchable = "ontouchstart" in window;
            var clickEvent = touchable ? "touchstart" : "click",
                mouseDownEvent = touchable ? "touchstart" : "mousedown",
                mouseUpEvent = touchable ? "touchend" : "mouseup",
                mouseMoveEvent = touchable ? "touchmove" : "mousemove",
                mouseMoveOutEvent = touchable ? "touchleave" : "mouseout";
            var _returnData = function(evt){
                var neweEvt = {};
                var cev = evt.originalEvent;
                if( cev == undefined ) {
                    cev = evt;
                }
                if(cev.changedTouches){
                    neweEvt.pageX = cev.changedTouches[0].pageX;
                    neweEvt.pageY = cev.changedTouches[0].pageY;
                    neweEvt.clientX = cev.changedTouches[0].clientX;
                    neweEvt.clientY = cev.changedTouches[0].clientY;
                }else{
                    neweEvt.pageX = evt.pageX;
                    neweEvt.pageY = evt.pageY;
                    neweEvt.clientX = evt.clientX;
                    neweEvt.clientY = evt.clientY;
                }
                neweEvt.evt = evt;
                return neweEvt;
            };
            var getTouchPos = function(e){
                return { x : e.clientX , y: e.clientY };
            }
            //计算两点之间距离
            var getDist = function(p1 , p2){
                if(!p1 || !p2) return 0;
                return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
            };
            var _onClick = function(dom, evt, callback){
                var neweEvt = _returnData(evt);
                callback(dom, neweEvt);
            };
            var _onClickDown = function(dom, evt, callback){
                var neweEvt = _returnData(evt);
                callback(dom, neweEvt);
            };
            var _onClickUp = function(dom, evt, callback){
                var neweEvt = _returnData(evt);
                callback(dom, neweEvt);
            };
            var _onMove = function(dom, evt, callback){
                var neweEvt = _returnData(evt);
                callback(dom, neweEvt);
            };
            var _onOut = function(evt, callback){
                var neweEvt = _returnData(evt);
                callback(dom, neweEvt);
            };
            var rootEle = this.ele;
            if( flg == undefined ) {
                flg = true;
            }
            
            switch(type){
                case "mousemove" :
                case "touchmove" :
                    if( flg ) {
                        rootEle.off(mouseMoveEvent, element);
                    }
                    rootEle.on(mouseMoveEvent, element, function(e){
                        _onMove($(this), e, eventHandle);
                    });
                    break;
                case "click" :
                case "tap" :
                    //按下松开之间的移动距离小于20，认为发生了tap
                    var TAP_DISTANCE = 20;
                    var pt_pos;
                    var ct_pos;
                    var startEvtHandler = function(e){
                        var ev = _returnData(e);
                        ct_pos = getTouchPos(ev);
                    };
                    var endEvtHandler = function(dom_,e, fn){
                        // e.stopPropagation();
                        var ev = _returnData(e);
                        var now = Date.now();
                        var pt_pos = getTouchPos(ev);
                        var dist = getDist(ct_pos , pt_pos);
                        if(dist < TAP_DISTANCE) {
                            _onClick(dom_, e, eventHandle);
                        }
                    };
                    if( flg ) {
                        rootEle.off(mouseDownEvent, element);
                        rootEle.off(mouseUpEvent, element);
                    }
                    rootEle.on(mouseDownEvent, element, function(e){
                        if(e.button != 2){ // 防止右键点击触发事件
                            startEvtHandler(e);
                        }
                    });
                    rootEle.on(mouseUpEvent, element, function(e){
                        if(e.button != 2){ // 防止右键点击触发事件
                            var $this = $(this);
                            endEvtHandler($this,e,eventHandle);
                        }
                    });
                    break;
                case "mousedown" :
                case "touchstart" :
                    if( flg ) {
                        rootEle.off(mouseDownEvent, element);
                    }
                    rootEle.on(mouseDownEvent, element, function(e){
                        _onClickDown($(this), e, eventHandle);
                    });
                    break;
                case "mouseup" :
                case "touchend" :
                    if( flg ) {
                        rootEle.off(mouseUpEvent, element);
                    }
                    rootEle.on(mouseUpEvent, element, function(e){
                        _onClickUp($(this), e, eventHandle);
                    });
                    break;
                case "mouseout" :
                    if( flg ) {
                        rootEle.off(mouseMoveOutEvent, element);
                    }
                    rootEle.on(mouseMoveOutEvent, element, function(e){
                        endEvtHandler(e, eventHandle);
                    });
                    break;
            }
        }
    }

    return Calendarjs;
}));