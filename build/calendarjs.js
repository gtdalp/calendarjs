﻿/**
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
    // 农历转公历年
    var calendar = {
        // 常见节假日
        holidays: {
            /*农历节日*/
            "t0101": "春节 ",
            "t0115": "元宵节",
            "t0202": "龙头节",
            "t0505": "端午节",
            "t0707": "七夕节",
            "t0715": "中元节",
            "t0815": "中秋节",
            "t0909": "重阳节",
            "t1001": "寒衣节",
            "t1015": "下元节",
            "t1208": "腊八节",
            "t1223": "小年",
            /*公历节日*/
            "0202": "湿地日",
            "0308": "妇女节",
            "0315": "消费者权益日",
            "0401": "愚人节",
            "0422": "地球日",
            "0501": "劳动节",
            "0512": "护士节",
            "0518": "博物馆日",
            "0605": "环境日",
            "0623": "奥林匹克日",
            "1020": "骨质疏松日",
            "1117": "学生日",
            "1201": "艾滋病日",
            "0101": "元旦",
            "0312": "植树节",
            "0504": "五四青年节",
            "0601": "儿童节",
            "0701": "建党节",
            "0801": "建军节",
            "0903": "抗战胜利日",
            "0910": "教师节",
            "1001": "国庆节",
            "1224": "平安夜",
            "1225": "圣诞节",
            "0214": "情人节",
            "0520": "母亲节",
            "0630": "父亲节",
            "1144": "感恩节"
        },
        /**
          * 农历1900-2100的润大小信息表
          * @Array Of Property
          * @return Hex 
          */
        lunarInfo:[0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,//1900-1909
                0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,//1910-1919
                0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,//1920-1929
                0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,//1930-1939
                0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,//1940-1949
                0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,//1950-1959
                0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,//1960-1969
                0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,//1970-1979
                0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,//1980-1989
                0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,//1990-1999
                0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,//2000-2009
                0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,//2010-2019
                0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,//2020-2029
                0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,//2030-2039
                0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,//2040-2049
                /**Add By JJonline@JJonline.Cn**/
                0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50, 0x06b20,0x1a6c4,0x0aae0,//2050-2059
                0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,//2060-2069
                0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,//2070-2079
                0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,//2080-2089
                0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,//2090-2099
                0x0d520],//2100
                    
        
        /**
          * 公历每个月份的天数普通表
          * @Array Of Property
          * @return Number 
          */
        solarMonth:[31,28,31,30,31,30,31,31,30,31,30,31],
        
     
        /**
          * 天干地支之天干速查表
          * @Array Of Property trans["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
          * @return Cn string 
          */
        Gan:["\u7532","\u4e59","\u4e19","\u4e01","\u620a","\u5df1","\u5e9a","\u8f9b","\u58ec","\u7678"],
        
        
        /**
          * 天干地支之地支速查表
          * @Array Of Property 
          * @trans["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
          * @return Cn string 
          */
        Zhi:["\u5b50","\u4e11","\u5bc5","\u536f","\u8fb0","\u5df3","\u5348","\u672a","\u7533","\u9149","\u620c","\u4ea5"],
        
        
        /**
          * 天干地支之地支速查表<=>生肖
          * @Array Of Property 
          * @trans["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
          * @return Cn string 
          */
        Animals:["\u9f20","\u725b","\u864e","\u5154","\u9f99","\u86c7","\u9a6c","\u7f8a","\u7334","\u9e21","\u72d7","\u732a"],
        
        
        /**
          * 24节气速查表
          * @Array Of Property 
          * @trans["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
          * @return Cn string 
          */
        solarTerm:["\u5c0f\u5bd2","\u5927\u5bd2","\u7acb\u6625","\u96e8\u6c34","\u60ca\u86f0","\u6625\u5206","\u6e05\u660e","\u8c37\u96e8","\u7acb\u590f","\u5c0f\u6ee1","\u8292\u79cd","\u590f\u81f3","\u5c0f\u6691","\u5927\u6691","\u7acb\u79cb","\u5904\u6691","\u767d\u9732","\u79cb\u5206","\u5bd2\u9732","\u971c\u964d","\u7acb\u51ac","\u5c0f\u96ea","\u5927\u96ea","\u51ac\u81f3"],
        
        
        /**
          * 1900-2100各年的24节气日期速查表
          * @Array Of Property 
          * @return 0x string For splice
          */
        sTermInfo:[ 
            '9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c3598082c95f8c965cc920f',
            '97bd0b06bdb0722c965ce1cfcc920f','b027097bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf97c359801ec95f8c965cc920f','97bd0b06bdb0722c965ce1cfcc920f','b027097bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd0b06bdb0722c965ce1cfcc920f',
            'b027097bd097c36b0b6fc9274c91aa','9778397bd19801ec9210c965cc920e','97b6b97bd19801ec95f8c965cc920f',
            '97bd09801d98082c95f8e1cfcc920f','97bd097bd097c36b0b6fc9210c8dc2','9778397bd197c36c9210c9274c91aa',
            '97b6b97bd19801ec95f8c965cc920e','97bd09801d98082c95f8e1cfcc920f','97bd097bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec95f8c965cc920e','97bcf97c3598082c95f8e1cfcc920f',
            '97bd097bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf97c3598082c95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf97c3598082c95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f',
            '97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf97c359801ec95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd097bd07f595b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9210c8dc2','9778397bd19801ec9210c9274c920e','97b6b97bd19801ec95f8c965cc920f',
            '97bd07f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c920e',
            '97b6b97bd19801ec95f8c965cc920f','97bd07f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec9210c965cc920e','97bd07f1487f595b0b0bc920fb0722',
            '7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf7f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e','97bcf7f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf7f1487f531b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
            '97bcf7f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c9274c920e','97bcf7f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
            '9778397bd097c36b0b6fc9210c91aa','97b6b97bd197c36c9210c9274c920e','97bcf7f0e47f531b0b0bb0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c920e',
            '97b6b7f0e47f531b0723b0b6fb0722','7f0e37f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36b0b70c9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e37f1487f595b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc9210c8dc2','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9274c91aa',
            '97b6b7f0e47f531b0723b0787b0721','7f0e27f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
            '9778397bd097c36b0b6fc9210c91aa','97b6b7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c8dc2','977837f0e37f149b0723b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722','7f0e37f5307f595b0b0bc920fb0722','7f0e397bd097c35b0b6fc9210c8dc2',
            '977837f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0721','7f0e37f1487f595b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc9210c8dc2','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','977837f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
            '977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14998082b0787b06bd',
            '7f07e7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
            '977837f0e37f14998082b0723b06bd','7f07e7f0e37f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722','7f0e37f1487f595b0b0bb0b6fb0722','7f0e37f0e37f14898082b0723b02d5',
            '7ec967f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e37f1487f531b0b0bb0b6fb0722',
            '7f0e37f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e37f1487f531b0b0bb0b6fb0722','7f0e37f0e37f14898082b072297c35','7ec967f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e37f0e37f14898082b072297c35',
            '7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f149b0723b0787b0721',
            '7f0e27f1487f531b0b0bb0b6fb0722','7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14998082b0723b06bd',
            '7f07e7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722','7f0e37f0e366aa89801eb072297c35',
            '7ec967f0e37f14998082b0723b06bd','7f07e7f0e37f14998083b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14898082b0723b02d5','7f07e7f0e37f14998082b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722','7f0e36665b66aa89801e9808297c35','665f67f0e37f14898082b0723b02d5',
            '7ec967f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e36665b66a449801e9808297c35',
            '665f67f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e36665b66a449801e9808297c35','665f67f0e37f14898082b072297c35','7ec967f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721','7f0e26665b66a449801e9808297c35','665f67f0e37f1489801eb072297c35',
            '7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722'
        ],
        
        
        /**
          * 数字转中文速查表
          * @Array Of Property 
          * @trans ['日','一','二','三','四','五','六','七','八','九','十']
          * @return Cn string 
          */
        nStr1:["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d","\u4e03","\u516b","\u4e5d","\u5341"],
        
        
        /**
          * 日期转农历称呼速查表
          * @Array Of Property 
          * @trans ['初','十','廿','卅']
          * @return Cn string 
          */
        nStr2:["\u521d","\u5341","\u5eff","\u5345"],
        
     
        /**
          * 月份转农历称呼速查表
          * @Array Of Property 
          * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
          * @return Cn string 
          */
        nStr3:["\u6b63","\u4e8c","\u4e09","\u56db","\u4e94","\u516d","\u4e03","\u516b","\u4e5d","\u5341","\u51ac","\u814a"],
        
        
        /**
          * 返回农历y年一整年的总天数
          * @param lunar Year
          * @return Number
          * @eg:var count = calendar.lYearDays(1987) ;//count=387
          */
        lYearDays:function(y) {
            var i, sum = 348;
            for(i=0x8000; i>0x8; i>>=1) { sum += (calendar.lunarInfo[y-1900] & i)? 1: 0; }
            return(sum+calendar.leapDays(y));
        },
        
        
        /**
          * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
          * @param lunar Year
          * @return Number (0-12)
          * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
          */
        leapMonth:function(y) { //闰字编码 \u95f0
            return(calendar.lunarInfo[y-1900] & 0xf);
        },
        
        
        /**
          * 返回农历y年闰月的天数 若该年没有闰月则返回0
          * @param lunar Year
          * @return Number (0、29、30)
          * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
          */
        leapDays:function(y) {
            if(calendar.leapMonth(y))  { 
                return((calendar.lunarInfo[y-1900] & 0x10000)? 30: 29); 
            }
            return(0);
        },
        
        
        /**
          * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
          * @param lunar Year
          * @return Number (-1、29、30)
          * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
          */
        monthDays:function(y,m) {
            if(m>12 || m<1) {return -1}//月份参数从1至12，参数错误返回-1
            return( (calendar.lunarInfo[y-1900] & (0x10000>>m))? 30: 29 );
        },
        
        
        /**
          * 返回公历(!)y年m月的天数
          * @param solar Year
          * @return Number (-1、28、29、30、31)
          * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
          */
        solarDays:function(y,m) {
            if(m>12 || m<1) {return -1} //若参数错误 返回-1
            var ms = m-1;
            if(ms==1) { //2月份的闰平规律测算后确认返回28或29
                return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28);
            }else {
                return(calendar.solarMonth[ms]);
            }
        },
     
        /**
         * 农历年份转换为干支纪年
         * @param  lYear 农历年的年份数
         * @return Cn string
         */
        toGanZhiYear:function(lYear) {
            var ganKey = (lYear - 3) % 10;
            var zhiKey = (lYear - 3) % 12;
            if(ganKey == 0) ganKey = 10;//如果余数为0则为最后一个天干
            if(zhiKey == 0) zhiKey = 12;//如果余数为0则为最后一个地支
            return calendar.Gan[ganKey-1] + calendar.Zhi[zhiKey-1];
            
        },
     
        /**
         * 公历月、日判断所属星座
         * @param  cMonth [description]
         * @param  cDay [description]
         * @return Cn string
         */
        toAstro:function(cMonth,cDay) {
            var s   = "\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf";
            var arr = [20,19,21,21,21,22,23,23,23,23,22,22];
            return s.substr(cMonth*2 - (cDay < arr[cMonth-1] ? 2 : 0),2) + "\u5ea7";//座
        },
     
     
        /**
          * 传入offset偏移量返回干支
          * @param offset 相对甲子的偏移量
          * @return Cn string
          */
        toGanZhi:function(offset) {
            return calendar.Gan[offset%10] + calendar.Zhi[offset%12];
        },
        
        
        /**
          * 传入公历(!)y年获得该年第n个节气的公历日期
          * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起 
          * @return day Number
          * @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
          */
        getTerm:function(y,n) {
            if(y<1900 || y>2100) {return -1;}
            if(n<1 || n>24) {return -1;}
            var _table = calendar.sTermInfo[y-1900];
            var _info = [
                parseInt('0x'+_table.substr(0,5)).toString() ,
                parseInt('0x'+_table.substr(5,5)).toString(),
                parseInt('0x'+_table.substr(10,5)).toString(),
                parseInt('0x'+_table.substr(15,5)).toString(),
                parseInt('0x'+_table.substr(20,5)).toString(),
                parseInt('0x'+_table.substr(25,5)).toString()
            ];
            var _calday = [
                _info[0].substr(0,1),
                _info[0].substr(1,2),
                _info[0].substr(3,1),
                _info[0].substr(4,2),
                
                _info[1].substr(0,1),
                _info[1].substr(1,2),
                _info[1].substr(3,1),
                _info[1].substr(4,2),
                
                _info[2].substr(0,1),
                _info[2].substr(1,2),
                _info[2].substr(3,1),
                _info[2].substr(4,2),
                
                _info[3].substr(0,1),
                _info[3].substr(1,2),
                _info[3].substr(3,1),
                _info[3].substr(4,2),
                
                _info[4].substr(0,1),
                _info[4].substr(1,2),
                _info[4].substr(3,1),
                _info[4].substr(4,2),
                
                _info[5].substr(0,1),
                _info[5].substr(1,2),
                _info[5].substr(3,1),
                _info[5].substr(4,2),
            ];
            return parseInt(_calday[n-1]);
        },
        
        
        /**
          * 传入农历数字月份返回汉语通俗表示法
          * @param lunar month
          * @return Cn string
          * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
          */
        toChinaMonth:function(m) { // 月 => \u6708
            if(m>12 || m<1) {return -1} //若参数错误 返回-1
            var s = calendar.nStr3[m-1];
            s+= "\u6708";//加上月字
            return s;
        },
        
        
        /**
          * 传入农历日期数字返回汉字表示法
          * @param lunar day
          * @return Cn string
          * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
          */
        toChinaDay:function(d){ //日 => \u65e5
            var s;
            switch (d) {
                case 10:
                s = '\u521d\u5341'; break;
            case 20:
                s = '\u4e8c\u5341'; break;
                break;
            case 30:
                s = '\u4e09\u5341'; break;
                break;
            default :
                s = calendar.nStr2[Math.floor(d/10)];
                s += calendar.nStr1[d%10];
            }
            return(s);
        },
        
        
        /**
          * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
          * @param y year
          * @return Cn string
          * @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
          */
        getAnimal: function(y) {
            return calendar.Animals[(y - 4) % 12]
        },
        
        
        /**
          * 传入公历年月日获得详细的公历、农历object信息 <=>JSON
          * @param y  solar year
          * @param m solar month
          * @param d  solar day
          * @return JSON object
          * @eg:console.log(calendar.solar2lunar(1987,11,01));
          */
        solar2lunar:function (y,m,d) { //参数区间1900.1.31~2100.12.31
            if(y<1900 || y>2100) {return -1;}//年份限定、上限
            if(y==1900&&m==1&&d<31) {return -1;}//下限
            if(!y) { //未传参  获得当天
                var objDate = new Date();
            }else {
                var objDate = new Date(y,parseInt(m)-1,d)
            }
            var i, leap=0, temp=0;
            //修正ymd参数
            var y = objDate.getFullYear(),m = objDate.getMonth()+1,d = objDate.getDate();
            var offset   = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;
            for(i=1900; i<2101 && offset>0; i++) { temp=calendar.lYearDays(i); offset-=temp; }
            if(offset<0) { offset+=temp; i--; }
            
            //是否今天
            var isTodayObj = new Date(),isToday=false;
            if(isTodayObj.getFullYear()==y && isTodayObj.getMonth()+1==m && isTodayObj.getDate()==d) {
                isToday = true;
            }
            //星期几
            var nWeek = objDate.getDay(),cWeek = calendar.nStr1[nWeek];
            if(nWeek==0) {nWeek =7;}//数字表示周几顺应天朝周一开始的惯例
            //农历年
            var year = i;
            
            var leap = calendar.leapMonth(i); //闰哪个月
            var isLeap = false;
            
            //效验闰月
            for(i=1; i<13 && offset>0; i++) {
                //闰月
                if(leap>0 && i==(leap+1) && isLeap==false){ 
                    --i;
                    isLeap = true; temp = calendar.leapDays(year); //计算农历闰月天数
                }
                else{
                    temp = calendar.monthDays(year, i);//计算农历普通月天数
                }
                //解除闰月
                if(isLeap==true && i==(leap+1)) { isLeap = false; }
                offset -= temp;
            }
            
            if(offset==0 && leap>0 && i==leap+1)
            if(isLeap){
                isLeap = false;
            }else{ 
                isLeap = true; --i;
            }
            if(offset<0){ offset += temp; --i; }
            //农历月
            var month   = i;
            //农历日
            var day     = offset + 1;
            
            //天干地支处理
            var sm      =   m-1;
            var gzY     =   calendar.toGanZhiYear(year);
            
            //月柱 1900年1月小寒以前为 丙子月(60进制12)
            var firstNode   = calendar.getTerm(year,(m*2-1));//返回当月「节」为几日开始
            var secondNode  = calendar.getTerm(year,(m*2));//返回当月「节」为几日开始
            
            //依据12节气修正干支月
            var gzM     =   calendar.toGanZhi((y-1900)*12+m+11);
            if(d>=firstNode) {
                gzM     =   calendar.toGanZhi((y-1900)*12+m+12);
            }
            
            //传入的日期的节气与否
            var isTerm = false;
            var Term   = null;
            if(firstNode==d) {
                isTerm  = true;
                Term    = calendar.solarTerm[m*2-2];
            }
            if(secondNode==d) {
                isTerm  = true;
                Term    = calendar.solarTerm[m*2-1];
            }
            //日柱 当月一日与 1900/1/1 相差天数
            var dayCyclical = Date.UTC(y,sm,1,0,0,0,0)/86400000+25567+10;
            var gzD = calendar.toGanZhi(dayCyclical+d-1);
            //该日期所属的星座
            var astro = calendar.toAstro(m,d);
            
            return {'lYear':year,'lMonth':month,'lDay':day,'Animal':calendar.getAnimal(year),'IMonthCn':(isLeap?"\u95f0":'')+calendar.toChinaMonth(month),'IDayCn':calendar.toChinaDay(day),'cYear':y,'cMonth':m,'cDay':d,'gzYear':gzY,'gzMonth':gzM,'gzDay':gzD,'isToday':isToday,'isLeap':isLeap,'nWeek':nWeek,'ncWeek':"\u661f\u671f"+cWeek,'isTerm':isTerm,'Term':Term,'astro':astro};
        },
            
            
        /**
          * 传入公历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
          * @param y  lunar year
          * @param m lunar month
          * @param d  lunar day
          * @param isLeapMonth  lunar month is leap or not.
          * @return JSON object
          * @eg:console.log(calendar.lunar2solar(1987,9,10));
          */
        lunar2solar:function(y,m,d,isLeapMonth) {   //参数区间1900.1.31~2100.12.1
            var isLeapMonth = !!isLeapMonth;
            var leapOffset  = 0;
            var leapMonth   = calendar.leapMonth(y);
            var leapDay     = calendar.leapDays(y);
            if(isLeapMonth&&(leapMonth!=m)) {return -1;}//传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
            if(y==2100&&m==12&&d>1 || y==1900&&m==1&&d<31) {return -1;}//超出了最大极限值       
            var day  = calendar.monthDays(y,m);
            var _day = day; 
           //bugFix 2016-9-25 
           //if month is leap, _day use leapDays method 
           if(isLeapMonth) { 
              _day = calendar.leapDays(y,m); 
           } 
           if(y < 1900 || y > 2100 || d > _day) {return -1;}//参数合法性效验
            
            //计算农历的时间差
            var offset = 0;
            for(var i=1900;i<y;i++) {
                offset+=calendar.lYearDays(i);
            }
            var leap = 0,isAdd= false;
            for(var i=1;i<m;i++) {
                leap = calendar.leapMonth(y);
                if(!isAdd) {//处理闰月
                    if(leap<=i && leap>0) {
                        offset+=calendar.leapDays(y);isAdd = true;
                    }
                }
                offset+=calendar.monthDays(y,i);
            }
            //转换闰月农历 需补充该年闰月的前一个月的时差
            if(isLeapMonth) {offset+=day;}
            //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
            var stmap   =   Date.UTC(1900,1,30,0,0,0);
            var calObj  =   new Date((offset+d-31)*86400000+stmap);
            var cY      =   calObj.getUTCFullYear();
            var cM      =   calObj.getUTCMonth()+1;
            var cD      =   calObj.getUTCDate();
            
            return calendar.solar2lunar(cY,cM,cD);
        }
    }
    
    Calendarjs.prototype = {
        version: '0.3.0',
        // 初始化
        init: function (options) {
            var nowDate = new Date();
            this.options = {
                // 系统时间
                systemDate : nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate(),
                // 每个月背景颜色
                bgStyle: ['D54C20', 'CF4857', '81628C', '1C6A81', '13A99E', 'F4634E', '1D7C5A', 'CC9966', 'CC99CC', 'FF9999', '663366', 'FF9933'],
                // 星期名称 周日必须在第一位
                weekName: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                // 是否显示农历
                isLunarDate: true,
                // 农历24节气 
                isLunarDateHoliday: true,
                // 公历节日
                isHoliday: true,
                // 防止多次点击
                firstClick: true,

            }
            $.extend(true, this.options, options);
            // 执行render
            this.render();
        },
        // 入口
        render: function () {
            // 创建月份模板
            this.createTemplate();
            // 创建头部(星期名称)
            this.createWeekNameTemplate();   
            // 点击
            this.event();         
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
        slideScrollPrev: function () {
            this.setDate(2);
        },
        // 滑动到下一个月
        slideScrollNext: function () {
            this.setDate(0);
        },
        // 设置日期
        setDate: function (i) {
            var op = this.options,
                id = $('#' + this.id),
                n = i === 2 ? -2 : 2,
                // 系统时间
                systemDate = op.systemDate.split('-'),
                table = id.find('.calendarjs-iscroll .widget-ui-calendarjs-date'),
                nowYearMonth = table.eq(1).attr('data-yearmonth').split('-'),
                html = this.createMonthTemplate(nowYearMonth[0], parseInt(nowYearMonth[1]) + n),
                dom = id.find('div.calendarjs-iscroll');
                
            // 删除第一个月或者最后一个月
            table.eq(i).remove();

            // 添加上一个月或者下一个的节点
            if (i === 2) {
                // 添加上一个月节点
                dom.prepend(html);
            } else if (i === 0) {
                // 添加下一个月节点
                dom.append(html);
            }          

            // 销毁之前的iscroll
            this.options.iscroll.destroy();
            this.options.iscroll = null;

            // 重新创建iscroll
            this.createIscroll('#' + this.id);
        },
        // 点击事件
        event: function () {
            var op = this.options,
                id = '#' + this.id, td,
                prevAndNext = id + ' .widget-ui-calendarjs-header-title>a',
                dom = id + ' .calendarjs-iscroll';
            
            // 点击每一天
            this.evt($(dom), 'click', function (d, e) {

                // 防止多次点击
                if (!op.firstClick) return;
                op.firstClick = false;

                var iscroll = this.options.iscroll;
                var max = iscroll.maxScrollX;
                td = $(e.evt.target).parent('td');
                // 上一个月
                if (td.hasClass('lastMonth')) {
                    setTimeout(function () {
                        iscroll.scrollTo(0, 0, 300);
                    }, 6);
                    setTimeout(function () {
                        this.slideScrollPrev();
                    }.bind(this), 305);
                }
                // 下一个月
                if (td.hasClass('tomorrow')) {
                    setTimeout(function () {
                        iscroll.scrollTo(max, 0, 300);
                    }, 6);
                    setTimeout(function () {
                        this.slideScrollNext();
                    }.bind(this), 305);
                }
                // 点中的是td
                if (td[0]) {
                    d.find('td.click').removeClass('click');
                    td.addClass('click');
                }
            }.bind(this));

            // 点击上一个月/下一个月
            this.evt($(prevAndNext), 'click', function (dom) {

                // 防止多次点击
                if (!op.firstClick) return;
                op.firstClick = false;

                var iscroll = this.options.iscroll,
                        max = iscroll.maxScrollX;

                // 点击上一个月
                if (dom.hasClass('calendarjs-header-title-prev')) {
                    max = 0;
                    setTimeout(function () {
                        this.slideScrollPrev();
                    }.bind(this), 305);
                }
                // 点击下一个月
                else if (dom.hasClass('calendarjs-header-title-next')) {
                    setTimeout(function () {
                        this.slideScrollNext();
                    }.bind(this), 305);
                }
                setTimeout(function () {
                    iscroll.scrollTo(max, 0, 300);
                }, 6);
            }.bind(this));
        },
        // 得到某个月份的天数
        getMonthDay: function (Year, Month) {
            return new Date(Year, Month, 0).getDate();
        },
        // 创建iscroll
        createIscroll: function (id) {
            var self = this,
                op = this.options,
                dom = $(id).find('.calendarjs-iscroll .widget-ui-calendarjs-date');

            // 当前年月
            op.yearmonth = dom.eq(1).attr('data-yearmonth');
            
            $(id).find('.calendarjs-header-title-yearmonth').html(op.yearmonth);
            op.iscroll = new IScroll(id, {
                scrollX: true,
                // 这个值可以改变改变动画的势头持续时间/速度。更高的数字使动画更短。你可以从0.01开始去体验，这个值和基本的值比较，基本上没有动能。
                deceleration: 0.01,
                startX: -dom.eq(0).width()-10,
                snap: dom
            });
            // 当前在第几页
            op.currentPage = 1;
            var firstX = 0;
            op.iscroll.on('scrollStart', function () {
                firstX = this.x;
            });
            op.iscroll.on('scrollMove', function () {
                // console.log(this.x - firstX)
            });
            // 滚动结束
            op.iscroll.on('scrollEnd', function () {
                var index = this.currentPage.pageX;

                // 滑动在当前月份不做操作
                if (op.currentPage != index) {
                    // 上一个月
                    if (index === 0) {
                        self.slideScrollPrev();
                    }
                    // 下一个月
                    else if (index === 2) {
                        self.slideScrollNext();
                    }
                }
            });
            // 防止多次点击
            setTimeout(function () {
                op.firstClick = true;
            }, 500);
            
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
            html += '<div class="widget-ui-calendarjs-header-title">';
            html += '   <a href="javascript:void(0);" class="calendarjs-header-title-prev">prev</a>\
                        <span class="calendarjs-header-title-yearmonth">' + op.yearmonth + '</span>\
                        <a href="javascript:void(0);" class="calendarjs-header-title-next">next</a>\
                    ';
            html += '</div>';
            // 创建星期名称
            id.append(html);
        },
        // 创建月份模板 y年 m月
        createMonthTemplate: function (y, m) {
            var op = this.options, i = 0, n = 0, filling, date, week, year, day, month, lunar, lDay, IDayCn, IMonthCn, Term, str, holidays, strD, strM, holidaysI,
                d = new Date(y, m-1, 1),
                firstDayWeek = d.getDay() - 1,
                // 得到某个月份的天数 
                len = this.getMonthDay(y, m) + firstDayWeek + 1,
                systemDate = op.systemDate.split('-'),
                // 农历24节气 
                isLunarDateHoliday = op.isLunarDateHoliday,
                isLunarDate = op.isLunarDate,
                isHoliday = op.isHoliday,
                cls = '',
                html = '<table width="100%" class="widget-ui-calendarjs-date" data-yearmonth="' + d.getFullYear() + '-' + (d.getMonth() + 1) + '"><tbody>';

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
                        day = date.getDate();
                        month = date.getMonth() + 1;
                        year = date.getFullYear();
                        // 公历年月日转农历数据
                        lunar = calendar.solar2lunar(year, month, day);
                        // 24节气
                        Term = isLunarDateHoliday ? lunar.Term : '';
                        // 农历的第一天
                        lDay = lunar.lDay;
                        // 农历当天
                        IDayCn = lunar.IDayCn;
                        // 农历月份
                        IMonthCn = lunar.IMonthCn;
                        // 显示农历月份或者农历当天
                        str = lDay == 1 ? IMonthCn : IDayCn;
                        // 是否显示农历二十四节气
                        str = Term || str;
                        
                        cls = '';

                        // 小于10前面加0
                        if (day < 10) {
                            strD = '0' + day; 
                        } else {
                            strD = '' + day;
                        }
                        // 小于10前面加0
                        if (month < 10) {
                            strM = '0' + month; 
                        } else {
                            strM = '' + month;
                        }
                        holidaysI = strM + strD;

                        // 节假日 农历节假日
                        holidays = (isHoliday ? calendar.holidays[holidaysI] : '') || calendar.holidays['t' + holidaysI];
                        
                        // 昨天
                        if (i === 0 && day > 10) {
                            cls = ' class="lastMonth"';
                        } 
                        // 明天
                        else if ((i/7) >= 4 && day < 10){
                            cls = ' class="tomorrow"';
                        } 
                        // 今天
                        else if (systemDate[0] == year && systemDate[1] == month && systemDate[2] == day) {
                            cls = ' class="today"';
                        }
                        // 节假日
                        else if (holidays && isHoliday) {
                            cls = ' class="holidays"';
                        }
                        // 24节气
                        else if (Term && isLunarDateHoliday) {
                            cls = ' class="solarterms24"';
                        }
                        html += '<td' + cls + ' data-day="' + year + '-' + month  + '-' + day + '">';
                        // 一个星期里面的每一天
                        html += '<div class="calendarjs-date-border">' + day + '</div>';
                        // 是否显示农历
                        if (isLunarDate) {
                            html += '<div class="lunar-calendar">' + (holidays || str) + '</div>';
                        }
                        html += '</td>';
                    }
                    html += '</tr>';
                }
            }

            html += '</tbody></table>';

            return html;
        },
        // 创建模板
        createTemplate: function () {
            var op = this.options, i = 0, id = $('#' + this.id),
                // 系统时间
                systemDate = op.systemDate.split('-'),
                // 每个月背景颜色
                bgStyle = op.bgStyle,
                // 是否显示农历
                isLunarDate = op.isLunarDate,
                // 模板
                html = '';

            for (var i = 0; i < 3; i++) {
                html += this.createMonthTemplate(systemDate[0], parseInt(systemDate[1]) + (i - 1));
            }

            // 创建星期名称
            id.append('<div class="calendarjs-iscroll">' + html + '</div>');

            this.createIscroll('#' + this.id);
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
        evt: function (element, type, eventHandle, flg){
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
            var rootEle = element;
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