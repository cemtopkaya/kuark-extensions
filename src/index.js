var moment = require('moment'),
    Q = require('q'),
    _ = require('lodash');

var result = {};
module.exports = result;

function Extensions() {

    //region OBJECT
    Object.defineProperty(result, '__stack', {
        get: function () {
            var orig = Error.prepareStackTrace;
            Error.prepareStackTrace = function (_, stack) {
                return stack;
            };
            var err = new Error;
            Error.captureStackTrace(err, arguments.callee);
            var stack = err.stack;
            Error.prepareStackTrace = orig;
            return stack;
        }
    });

    Object.defineProperty(result, '__line', {
        get: function () {
            return result.__stack[1].getLineNumber();
        }
    });

    Object.defineProperty(result, '__function', {
        get: function () {
            return result.__stack[1].getFunctionName();
        }
    });

    Object.defineProperty(result, '__file', {
        get: function () {
            return result.__stack[1].getFileName().split('/').slice(-1)[0];
        }
    });

    result.counter = 0;
    //stacktostring FAIL
    Object.defineProperty(result, 'ssr', {
        get: function () {
            console.log("\033[041m******************************************" +
                "\nFunction: " + result.__stack[1].getFunctionName() +
                "\nFile\t: " + result.__stack[1].getFileName().split('/').slice(-1)[0] +
                "\nLine\t: " + result.__stack[1].getLineNumber() +
                "\n******************************************\033[0m")
        },
        set: function (_params) {

            console.log("\033[041m******************************************" +
                "\nFunction: " + result.__stack[1].getFunctionName() +
                "\nFile\t: " + result.__stack[1].getFileName().split('/').slice(-1)[0] +
                "\nLine\t: " + result.__stack[1].getLineNumber() + "\n" +
                "\n Param\t: " + JSON.stringify(arguments, null, '  ') +
                "\n******************************************\033[0m");
        }
    });

    //stacktostring SUCCESS
    Object.defineProperty(result, 'ssg', {
        get: function () {
            console.log("\033[092m******************************************" +
                "\nFunction: " + result.__stack[1].getFunctionName() +
                "\nFile\t: " + result.__stack[1].getFileName().split('/').slice(-1)[0] +
                "\nLine\t: " + result.__stack[1].getLineNumber() +
                "\n******************************************\033[0m")
        },
        set: function (_params) {
            var simdi = new Date().getTime(),
                meta1 = {
                    "Function": result.__stack[1].getFunctionName(),
                    "File": result.__stack[1].getFileName().split('/').slice(-1)[0],
                    "Line": result.__stack[1].getLineNumber()
                },
                esMesaji = "http://127.0.0.1:9200/logs-" + moment().format("YYYY.MM.DD") + "/_search/?size=1000&q=message:" + simdi,
            /*ozet = "Function: " + __stack[1].getFunctionName() +
             "\nFile\t: " + __stack[1].getFileName().split('/').slice(-1)[0] +
             "\nLine\t: " + __stack[1].getLineNumber() + "\n" +
             "\n Param\t: " + JSON.stringify(arguments, null, 2),*/
                sArguments = JSON.stringify(arguments, null, 2);


            if (sArguments.length < 200) {
                meta1.Param = arguments;
            } else {
                meta1.Param = esMesaji;
                console.log(simdi, arguments);
            }

            var consoleMesaji = "\033[9" + (++result.counter % 7) + "m******************************************\n" + JSON.stringify(meta1, null, 2) + "\n******************************************\033[0m";

            console.log(consoleMesaji);
        }
    });

    //endregion

    //region STRING

    String.prototype.splitWithOptions = function (_seperator, _leaveFalsyElements) {
        var arr = this.split(_seperator);
        return _leaveFalsyElements
            ? arr
            : arr.filter(Boolean);
    };

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };

    String.prototype.turkishToUpper = function () {
        var string = this;
        var letters = {
            "i": "İ",
            "ş": "Ş",
            "ğ": "Ğ",
            "ü": "Ü",
            "ö": "Ö",
            "ç": "Ç",
            "ı": "I"
        };
        string = string.replace(/(([iışğüçö]))+/g, function (letter) {
            return letters[letter];
        });
        return string.toUpperCase();
    };

    String.prototype.turkishToLower = function () {
        var string = this;
        var letters = {
            "İ": "i",
            "I": "ı",
            "Ş": "ş",
            "Ğ": "ğ",
            "Ü": "ü",
            "Ö": "ö",
            "Ç": "ç"
        };
        string = string.replace(/(([İIŞĞÜÇÖ]))+/g, function (letter) {
            return letters[letter];
        });
        return string.toLowerCase();
    };


    //endregion

    //region Function

    Function.prototype.thenX = function () {

        //console.log("************* allX ************");
        if (!Array.isArray(this)) {
            l.e("allX fonksiyonu ancak bir dizi üstünde çalışır!");
            throw "allX fonksiyonu ancak bir dizi üstünde çalışır!";
        }


        /**
         * all.apply kullandığımızda herhangi bir promise null dönerse dizi olarak dönmüyor
         * bu yüzden allResolved önerilmiş daha sonrada allSettled önerilmiş
         */
        //return Q.all.apply(null,this);
        /*
         https://github.com/kriskowal/q/issues/257
         return Q.allSettled([rejectedWith5, fulfilledWith10]).spread(function (one, two) {
         assert(one.state === "rejected");
         assert(one.reason === 5);

         assert(two.state === "fulfilled");
         assert(two.value === 10);
         });

         */

        return Q.allSettled(this)
            .then(function (_replies) {
                var arrReplies = _replies.map(function (_reply) {
                    if (_reply.state == "rejected") {
                        console.error("************* allX PROMISE REJECTED : ");
                        console.error("Promise  STATE : %s", _reply.state);
                        console.error("Promise  VALUE : %s", _reply.value);
                        console.error("Promise REASON : %s", _reply.reason);
                        console.error("------------- allX PROMISE REJECTED *************");
                    }

                    return _reply.value;
                });

                //l.i("************* allX THEN result : ");
                //l.i("\t", JSON.stringify(arrReplies));

                return arrReplies;
            });

        var sonucAllX = Q.allSettled(this);
        return sonucAllX.then(function (_sonuclar) {
            //ssg = [{"allX.then(function(sonuclar : ": _sonuclar}];
            return _sonuclar.map(function (_sonuc) {
                _sonuc.value;
            });
        });
    };

    //endregion

    //region ARRAY

    /**
     * Underscoore ya da lodash deki map metodunu çağıran extended fonk.
     * @param {function} f_function - Her bir eleman için çalışmasını istediğimiz fonksiyon
     * @returns {Array|[]} Boş ya da dolu dizi döner
     */
    Array.prototype.mapXU = function (f_function) {
        return _.map(this, f_function);
    };

    /**
     * Gelen dizinin sadece istenen prop değerlerini dizi olarak döner
     * @example
     * var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
     * _.map(stooges, 'name');
     * => ["moe", "larry", "curly"]
     * @param {string} _prop
     * @returns {Array}
     */
    Array.prototype.pluckX = function (_prop) {
        return _.map(this, _prop);
    };


    /**
     * Daha kısa yazılması için map fonksiyonu
     * Çağıracağımız fonksiyonu ilk olarak dizinin elemanını, sonra gelen diğer parametreleri geçeceğiz
     * @param {object|null} instance, fonksiyonun çalıştırılacağı nesne (this olacak)
     * @param {function} f_function, Çalıştırılacak fonksiyon
     * @param {object...=} args
     * @returns {*}
     */
    Array.prototype.mapX = function (instance, f_function, args) {

        if (!Array.isArray(this)) {
            l.e("mapX fonksiyonu ancak bir dizi üstünde çalışır!");
            throw "mapX fonksiyonu ancak bir dizi üstünde çalışır!";
        }

        var args = Array.prototype.slice.call(arguments);
        if (typeof args[0] === "function") {
            l.e("mapX fonksiyonunun ikinci parametresi çalıştırmak istediğiniz fonksiyon olmalı!");
            l.e("Birincisi ise fonksiyonu üstünde koşturmak istediğiniz obje yada null olmalı!");
            throw "mapX fonksiyonunun ikinci parametresi çalıştırmak istediğiniz fonksiyon olmalı. Birincisi ise fonksiyonu üstünde koşturmak istediğiniz obje yada null olmalı!";
        }
        /* l.i("************* mapX Parametreleri : ");
         l.i("\tthis             : %s", JSON.stringify(this));
         l.i("\targuments.length : %s", arguments.length);
         l.i("\tfunction.name    : %s", f_function.name);*/

        var instance = args[0] || null,
            f = args[1],
            params = args.length == 2 ? [] : args.slice(2, args.length);

        var arrResult = this.map(function (_elm, _idx, _arr) {
            // dizinin elemanını en başa ekliyorumki fonksiyonun kesinlikle kullanacağı bir parametre varsa
            // o da bu dizinin elemanıdır. Diğer parametreler ise mapX fonksiyonuna eklenmiş diğerleri olacaktır.

            //ssg = [{"instance": instance}, {"params": [_elm].concat(params)}];
            return f.apply(instance, [_elm].concat(params));
        });

        return arrResult;
    };


    /**
     * Daha kısa yazılması için dizinin sonuna allX fonksiyonu ekledim
     * Promise dizisinin hızlıca all metodunu çağırmak için.
     * Dönen sonuç bir dizi olacaktır. Her promise sonucu {state:("fullfilled"|"rejected"), value:object} şeklindedir. fullfilled sonuçlar başarılıdır.
     * {@link https://github.com/kriskowal/q/issues/257}
     * @returns {Promise|{state:("fullfilled"|"rejected"), value:object}[]}}
     */
    Array.prototype.allX = function () {

        if (!Array.isArray(this)) {
            l.e("allX fonksiyonu ancak bir dizi üstünde çalışır!");
            throw "allX fonksiyonu ancak bir dizi üstünde çalışır!";
        }

        return Q.allSettled(this)
            .then(function (_replies) {
                var arrReplies = _replies.map(function (_reply) {
                    if (_reply.state == "rejected") {
                        console.error("************* allX PROMISE REJECTED : ");
                        console.error("Promise  STATE : %s", _reply.state);
                        console.error("Promise  VALUE : %s", _reply.value);
                        console.error("Promise REASON : %s", _reply.reason);
                        console.error("------------- allX PROMISE REJECTED *************");
                    }

                    return _reply.value;
                });

                return arrReplies;
            });
    };

    /**
     *
     * @param prop
     * @param val
     * @returns {*}
     */
    Array.prototype.whereX = function (prop, val) {

        var f_deepDig = function (_prop) {

            if (typeof _prop != "object") {
                return _prop;
            }

            var sProp = "";
            for (var pName in _prop) {
                sProp += pName;
                val = _prop[pName];

                //console.log("pName:%s, sProp:%s, val:%s", pName, sProp, val)

                if (typeof val == "object") {
                    sProp += "." + f_deepDig(val);
                }
            }

            return sProp.trim('.');
        };

        prop = f_deepDig(prop);
        //console.log("prop: " + prop);

        var f_findProp = function (_obj, _prop) {
            var propValue;

            if (_prop.indexOf(".") == -1) {
                return _obj[_prop];
            }
            else {
                _prop.split(".").every(function (p) {
                    if (typeof _obj[p] != "object") {
                        propValue = _obj[p];
                        return false;  // property bulundu, değerini dönüyoruz
                    }

                    _obj = _obj[p];
                    return true; // henüz bir şey bulamadım, aramaya devam
                });
                return propValue;
            }
        };

        for (var i = 0; Array.isArray(this) && i < this.length; i++) {
            if (f_findProp(this[i], prop) == val) {
                return this[i];
            }
        }
        return null;
    };

    /**
     * Istenilen elemanı bulur bulmaz kendisini döner. Dizi dönmez!
     * @param {string} prop
     * @param {*} _requestedVal
     * @returns {*}
     */
    Array.prototype.whereX2 = function (prop, _requestedVal) {
        var f_lookUp = function (_elm, _prop) {
            if (_elm.hasOwnProperty(_prop) && _elm[_prop]) {
                return _elm[_prop];
            }
            return null;
        };


        for (var i = 0; i < this.length; i++) {
            var elm = this[i];

            if (prop.indexOf(".") == -1) {
                val = f_lookUp(elm, prop, val);
            } else {
                var innerElm = elm,
                    val;
                prop.split(".").every(function (_prop, _idx, _arr) {
                    innerElm = f_lookUp(innerElm, _prop);

                    // eğer prop'unu arayacağımız obje null değilse ve Genel.Tahta.Id propertysi içinde sonuncuya gelmemişsek every'ye devam etmek için true döneceğiz
                    if ((_idx != _arr.length - 1) && typeof innerElm == "object") {
                        if (Array.isArray(innerElm)) { // Bu property dizi ve kendisinin whereX'ini çağıracağız
                            elm = innerElm.whereX2(_arr.slice(_idx + 1).join("."), _requestedVal);
                            val = elm ? elm[_arr[_arr.length - 1]] : undefined;
                            return false;
                        }
                        return true;
                    } else {
                        // every'ye devam edemeyiz
                        val = innerElm
                        return false;
                    }

                });
            }

            if (_requestedVal == val) {
                return elm;
            }
        }

        return null;
    };

    /**
     * Aranan objeyi _ (lodash ya da underscore) üstünden arar
     * @param {object} _arananObje
     * @returns {Array}
     */
    Array.prototype.whereXU = function (_arananObje) {
        return _.filter(this, _arananObje);
    };

    /**
     * Gelen dizinin kendinden farklı olan kayıtları döner(örn a:[1,2,3] b:[3] =>>[1,2])
     * @param {Array}  _arr
     * @returns {Array}
     */
    Array.prototype.differenceXU = function (_arr) {
        return _.difference(this, _arr);
    };

    /**
     * Gelen dizi ile kendisinin kesişenlerini döner(örn a:[1,2,3] b:[3] =>>[3])
     * @param {Array}  _arr
     * @returns {Array}
     */
    Array.prototype.intersectionXU = function (_arr) {
        return _.intersection(this, _arr);
    };

    /**
     * Gelen dizi ile kendisini birleştirip geri döner
     * @param {Array} _arr
     * @returns {Array}
     */
    Array.prototype.unionXU = function (_arr) {
        return _.union(this, _arr);
    };

    Array.prototype.findOne = function (prop, _requestedVal) {
        var result = null;
        debugger;

        var f_lookUp = function (_elm, _prop) {
            if (_elm.hasOwnProperty(_prop) && _elm[_prop]) {
                return _elm[_prop];
            }
            return null;
        };


        for (var i = 0; i < this.length; i++) {
            var elm = this[i];

            if (prop.indexOf(".") == -1) {
                result = f_lookUp(elm, prop, val);
            } else {
                var innerElm = elm,
                    val;
                prop.split(".").every(function (_prop, _idx, _arr) {
                    innerElm = f_lookUp(innerElm, _prop);

                    // eğer prop'unu arayacağımız obje null değilse ve Genel.Tahta.Id propertysi içinde sonuncuya gelmemişsek every'ye devam etmek için true döneceğiz
                    if ((_idx != _arr.length - 1) && typeof innerElm == "object") {
                        return true;
                    } else {
                        // every'ye devam edemeyiz
                        val = innerElm
                        return false;
                    }

                });
            }

            if (_requestedVal == val) {
                return elm;
            }
        }

        return null;
    };

    Array.prototype.jparse = function () {
        var sonuc = this.map(function (elm) {
            return elm ? JSON.parse(elm) : null;
        });
        return sonuc;
    };

    Array.prototype.last = function () {
        return this[this.length - 1];
    };

    Array.prototype.groupX = function (_gruplanacak, _sayilacak) {
        var result = _.chain(this)
            .groupBy(_gruplanacak)
            .map(function (value, key) {
                return {
                    Key: key,
                    Count: _.size(_.map(value, _sayilacak))
                }
            })
            .value();
        return result;
    };

    Array.fq_jparse = function (_arrDb) {
        console.log("gelen param: " + _arrDb);
        var d = Q.defer();
        try {
            if (Object.prototype.toString.call(_arrDb) === '[object Array]') {
                console.log("diziymiş");
                if (_arrDb.length > 0) {
                    console.log("0 dan büyük ve jparse metodu varmıymış: " + _arrDb.jparse);
                    d.resolve(_arrDb.jparse());
                } else {
                    d.resolve([]);
                }
            } else {
                d.reject("f_jparse içinde hata. Parametre dizi tipinde değil! Parametrenin tipi: " + (typeof _arrDb) + " ve değeri: " + _arrDb);
            }
        } catch (_ex) {
            console.log("Istisna oldu ve _ex: " + _ex);
            d.reject(_ex);
        }
        return d.promise;
    };

    /**
     * sumx metodunun Örnek kullanımı
     * sumX(_.map(value, "Fiyat"))
     * Fiyatların toplamını getirir
     * @param numbers
     */
    Array.sumX = function (numbers) {
        return _.reduce(numbers, function (result, current) {
            return result + parseFloat(current);
        }, 0);
    };

    Array.prototype.sortByFieldX = function (prop, desc) {
        this.sort(function (a, b) {
            if (desc)
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            else
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        });
        return this;
    };

    Array.prototype.findByFieldX = function (_fields, _q) {
        if (_q == undefined) {

            throw ("Aranan değer BOŞ geldi.");
        }
        var tempSource = this.slice(0);
        var eachSource = this.slice(0);
        var result = [];

        for (var j = 0, bLastField = false; $.isArray(_fields) && j < _fields.length;) {
            var field = _fields[j];

            for (var k = 0; k < eachSource.length; k++) {
                var o = eachSource[k];

                var bEqual = false;
                if (o && o[field] != undefined) {
                    switch (typeof o[field]) {
                        case 'string':
                            if (o[field].toString().toTurkishToUpperX().indexOf(_q.toTurkishToUpperX()) >= 0) {
                                bEqual = true;
                            }
                            break;
                        case 'boolean':
                            if (o[field] == _q) {
                                bEqual = true;
                            }
                            break;
                        case 'number':
                            if (o[field] == parseInt(_q)) {
                                bEqual = true;
                            }
                            break;
                        default:
                            bEqual = false;
                            break;
                    }

                    if (bEqual) {
                        result.push(o);
                    }

                    /* Son alanda arama yapmıyorsak diziden çıkartalım, yoksa performans kaybetmeyelim */
                    if (!bLastField) {
                        tempSource.splice(k, 1);
                    }
                }
            }

            /* Son alanda arama yapmıyorsak atama yapalım */
            if (!bLastField) {
                eachSource = tempSource;
            }

            bLastField = ((++j) <= _fields.length - 1);
        }
        return result;
    };

    Array.prototype.takeX = function (_iXAdet, _bBastan) {
        if (typeof _bBastan == "boolean" && !_bBastan) {
            return this.slice(this.length - _iXAdet, this.length);
        }
        return this.slice(0, _iXAdet);
    };

    Array.prototype.diffArrayX = function (a, b) {
        var seen = [], diff = [];
        for (var i = 0; i < b.length; i++) {
            seen[b[i]] = true;
        }

        for (var i = 0; i < a.length; i++) {
            if (!seen[a[i]]) {
                diff.push(a[i]);
            }
        }
        return diff;
    };


    //endregion

    //region DATE

    Date.prototype.f_addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + parseInt(days));
        return dat;
    };

    Date.momentFormatX = function (obj, prop, format) {
        return obj[prop] = moment(obj[prop]).format(format || "DD.MM.YYYY");
    };

    Date.prototype.momentFormatX = function (format) {
        return moment(this).format(format || "DD.MM.YYYY");
    };

    Date.prototype.AyinBiriX = function () {
        return new Date(this.getFullYear(), this.getMonth(), 1);
    };

    Date.prototype.AyinSonuX = function () {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0);
    };

    Date.prototype.HaftaBasiX = function () {
        var first = this.getDate() - this.getDay(); // First day is the day of the month - the day of the week
        return new Date(this.getFullYear(), this.getMonth(), first + 1);
    };
    Date.prototype.HaftaSonuX = function () {
        var first = this.getDate() - this.getDay();
        var last = first + 7;
        return new Date(this.getFullYear(), this.getMonth(), last);
    };

    Date.prototype.setMonthX = function (iKacAy) {
        var copiedDate = new Date(this.getTime());
        var sonuc = copiedDate.setMonth(copiedDate.getMonth() + iKacAy);
        return new Date(sonuc);
    };

    Date.nowX = function () {
        return new Date();
    };


    //endregion

    return result;
}

if(!result.hasOwnProperty("__stack")){
    Extensions();
}