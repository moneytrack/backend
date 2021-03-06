"use strict";
/**
 * Copyright (c) 2015 Nikolai Mavrenkov <koluch@koluch.ru>
 *
 * Distributed under the MIT License (See accompanying file LICENSE or copy at http://opensource.org/licenses/MIT).
 *
 * Created: 30.12.2015 22:03
 */
var moment = require("moment")

var common = require("./_common.js");

/*

    Categories:
        Home
            Payments
                Rent
                Internet
        Food
            Work
            Home

    November 26, 2015:
        12:46 - 315 - Food/Work - Lunch (Teremok)
        15:17 - 20000 - Home/Payments/Rent
        20:52 - 1053.56 - Food/Home - Some goods (Okay)

    November 27, 2015:
        13:10 - 400 - Lunch, sushi
        21:12 - 293.10 - Diksi

    November 28, 2015:
        18:31 - 1574.56 - Some goods from Okay

    November 29, 2015:

    November 30, 2015:
        10:34 - 500 - Transport - Podoroznik
        12:15 - 326 - Food/Work - Lunch (KFC)
        16:12 - 4210 - Family/Presents - Present for papa

    December 01, 2015:
        12:37 - 336 - Food/Work - Lunch (Teremok)
        21:32 - 502.90 - Home/Payments/Internet - Interzet

    December 02, 2015:
        13:06 - 297 - Food/Work - Lunch (Teremok)


*/



/******************************************************************************/

var sender = new common.Sender();

var url = "http://192.168.1.185:8081"

function dispatch(json)  {
    var result = sender.post(url + '/dispatch', { json: json})
    if(result.body) {
        return JSON.parse(result.body)
    }
}

function time(str) {
    return moment(str).valueOf()
}

function money(rubels) {
    return Math.floor(rubels * 100)
}


var loginResponse = sender.post(url +  '/_ah/login?continue=%2Fauth', {form: {
    'email':'test@example.com',
    'continue':'/login',
    'action':'Log In'
}});

sender.get(url + '/clean')

sender.get(url + '/login')

var initialState = JSON.parse(sender.get(url + '/dispatch').body)

var rootCategoryId = initialState.rootCategoryId

// Expenses
/*
    November 26, 2015:
        12:46 - 315 - Food/Work - Lunch (Teremok)
        15:17 - 20000 - Home/Payments/Rent
        20:52 - 1053.56 - Food/Home - Some goods (Okay)
*/
var DAYS = 500
var EXPENSE_PER_DAY = 3;
var cats = initialState.categoryList.map(x => x.id).filter(x => x !== rootCategoryId)

var words = ("using props passed down from parent to generate state in "
+ "often leads to duplication of source of truth where the real data "
+ "is whenever possible compute values on-the-fly to ensure that they dont "
+ "get out of sync later on and cause maintenance trouble").split(/\s+/g)


var dev = 0.4; // deviation

function randomInt(upper) {
    return Math.floor(upper * Math.random())
}

function choose(arr) {
    return arr[parseInt(Math.random() * arr.length)]
}


const makeText = function(len) {
    var result = [];
    var count = len - (len * dev) + (len * dev * 2 * Math.random())
    for(var i = 0; i < count; ++i) {
        result.push(choose(words))
    }

    return result.join(" ");
}

function makeNumber(num) {
    return num - (num * dev) + (num * dev * 2 * Math.random())
}

var time = moment();
time.subtract(DAYS, "days")

for(var day = 0; day < DAYS; ++day) {
    for(var expense = 0; expense < makeNumber(EXPENSE_PER_DAY); ++expense) {

        time.set('hours', 9 + randomInt(21 - 9))
        time.set('minutes', randomInt(60))

        dispatch({
            type:"NEW_EXPENSE",
            amount: money(makeNumber(300)),
            categoryId: choose(cats),
            comment: makeText(5),
            date: time.valueOf()
        })

    }
    time.add(1, 'days')
}
