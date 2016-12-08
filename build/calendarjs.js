/**
 * calendarjs
 * xisa
 * 0.3.0(2014-2016)
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
            this.options = options;
            // 执行render
            this.render();
        },
        // 入口
        render: function () {

            // 创建头部(星期名称)
            this.createWeekNameTemplate();
            
            // this._createIscroll();
            this.createTemplate();
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

            //
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

                });
            }

            
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
            
            return arr;
        },
        // 得到某个月份的天数
        getMonthDay: function (Year, Month) {
            return new Date(Year, Month, 0).getDate();
        },
        _createIscroll: function () {
            //
        },
        // 创建头部(星期名称)
        createWeekNameTemplate: function () {
            var op = this.options, id = $('#' + this.id), i = 0,
                weekName = op.weekName,
                len = weekName.length,
                html = '';

            html += '<div class="widget-ui-calendarjs-header">';

            for (; i < len; i++) {
                html += '<span>' + weekName[i] + '</span>';
            }

            html += '</div>';

            // 创建星期名称
            id.prepend(html);
        },
        // 创建月份模板 y年 m月
        createMonthTemplate: function (y, m) {
            var op = this.options, i = 0, n = 0, filling = 35, date, week, y, d, month, lunar, lDay, IDayCn, IMonthCn, Term, str,
                // 得到某个月份的天数
                len = this.getMonthDay(y, m),
                firstDayWeek = new Date(y, m-1, 1).getDay() - 1,
                cls = '',
                html = '';
                console.log(firstDayWeek)
            // 需要填补后面空位
            filling = len % 7 === 0 ? len : len + (7 - len % 7); 

            for (; i < filling; i++) {
                // 一个星期
                if (i % 7 === 0) {
                    html += '<tr>';
                    // 循环一周
                    for ( n = i; n < (i + 7) ; n++ ) {
                        str = '';
                        date = new Date(y, m-1, n-firstDayWeek);
                        week = date.getDay();
                        d = date.getDate();
                        month = date.getMonth() + 1;
                        y = date.getFullYear();
                        // 公历年月日转农历数据
                        lunar = calendar.solar2lunar(y, month, d);
                        // 24节气
                        Term = lunar.Term;
                        // 农历的第一天
                        lDay = lunar.lDay;
                        // 农历当天
                        IDayCn = lunar.IDayCn;
                        // 农历月份
                        IMonthCn = lunar.IMonthCn;
                        // 显示农历月份或者农历当天
                        str = lDay == 1 ? IMonthCn : IDayCn;
                        // 是否显示农历二十四节气
                        str = Term ? Term : str;
                        cls = '';
                        // 昨天
                        if (i === 0 && d > 10) {
                            cls = ' class="yesterday"';
                        } else if ((i/7) >= 4 && d < 10){
                            cls = ' class="tomorrow"';
                        }
                        html += '<td' + cls + ' data-day="' + y + '-' + month  + '-' + d + '">';
                        // 一个星期里面的每一天
                        html += '<div class="calendarjs-date-border">' + d + '</div>';
                        html += '<div class="lunar-calendar">' + str + '</div>';
                        html += '</td>';
                    }
                    html += '</tr>';
                }

            }
            return html;
        },
        // 创建模板
        createTemplate: function () {
            var op = this.options, i = 0, id = $('#' + this.id),
                // 系统时间
                systemDate = op.systemDate,
                // 每个月背景颜色
                bgStyle = op.bgStyle,
                // 是否显示农历
                isLunarDate = op.isLunarDate,
                // 是否显示农历节日
                isHoliday = op.isHoliday,
                // 模板
                html = '';

            // header
            html += '<table width="100%" class="widget-ui-calendarjs-date"><tbody>';
            html += this.createMonthTemplate(2016, 12);
            html += '</tbody></table>';
            
            // 创建星期名称
            id.append(html);
        },
        // 销毁calendarjs
        destroy: function () {
            // 删除上拉下拉刷新节点
        },
        // 刷新calendarjs
        refresh: function (refresh) {
            // 
        }
    }

    return Calendarjs;
}));