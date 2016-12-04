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
            
            // 执行render
            this.render();
        },
        // 入口
        render: function () {
            // 创建iscroll
            this._createIscroll();
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
        _DayNumOfMonth: function (Year, Month) {
            return new Date(Year, Month, 0).getDate();
        },
        _createIscroll: function () {
            //
        },
        _createTemplate: function () {

            //

            return _html;
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