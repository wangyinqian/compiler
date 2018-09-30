"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TemplatePaser = function () {
    function TemplatePaser(selector, data) {
        _classCallCheck(this, TemplatePaser);

        this.init(selector, data);
    }

    _createClass(TemplatePaser, [{
        key: "init",
        value: function init(selector, jsonData) {
            var _this = this;

            var ele = this.query(selector),
                html = ele.outerHTML;

            var data = {};

            var newStr = html.replace(/<[\w]+[\s\w="':\-.;{}]*>[{}.\w]*|<\/[\w]+>/g, function (n) {
                if (!data.isFor) {
                    return _this.repalceExpression(n, "", jsonData, data);
                } else {
                    if (n.indexOf(data.tag) == -1) {
                        data.fragment = (data.fragment || "") + n;return "";
                    } else {
                        var list = jsonData[data.target],
                            len = Array.isArray(list) ? list.length : Object.keys(list).length;

                        var str = "";

                        for (var i = 0; i < len; i++) {
                            str = str + _this.repalceExpression(data.fragment, data.keyName, list[i]);
                        }

                        return data = {}, str;
                    }
                }
            });

            ele.outerHTML = newStr;
        }
    }, {
        key: "repalceExpression",
        value: function repalceExpression(str, itemName, data, config) {
            var _this2 = this;

            return str.replace(/m:([\w]+)="([{\s.\w}:;]*)"|{([\s.\w]*)}/g, function (n, name, key, key1, i, m) {
                if (name == "for") {
                    var value = key.split(" ");

                    config.isFor = true, config.keyName = value[0], config.target = value[2], config.tag = m.substring(1, m.indexOf(" "));

                    return "";
                } else {
                    if (name == "style") {
                        if (key.charAt(0) == "{") {
                            var obj = _this2.getValue(data, key.slice(1, -1), itemName);

                            return name + "=\"" + Object.keys(obj).map(function (e) {
                                var pro = /[A-Z]{1}/.test(e) ? e.replace(/[A-Z]/g, function (n) {
                                    return "-" + n.toLowerCase();
                                }) : e;

                                var value = obj[e];

                                if (typeof value == "number") {
                                    value = value + "px";
                                }

                                return pro + ":" + value + ";";
                            }).join("") + "\"";
                        } else {
                            return name + "=\"" + key.replace(/{([\w.\s]*)}/g, function (n, key) {
                                return _this2.getValue(data, key, itemName);
                            }) + "\"";
                        }
                    } else {
                        return key ? key.replace(/{([\s.\w]*)}/, function (n, key) {
                            return _this2.getValue(data, key, itemName);
                        }) : _this2.getValue(data, key1, itemName);
                    }
                }
            });
        }
    }, {
        key: "getValue",
        value: function getValue(data, key, itemName) {
            if (key) {
                if (key != itemName) {
                    if (itemName) {
                        key = key.substring(key.indexOf(".") + 1);
                    }

                    if (key.indexOf(".") != -1) {
                        var keys = key.split("."),
                            value = "";

                        for (var i = 0, len = keys.length; i < len; i++) {
                            value = value ? value[keys[i]] : data[keys[i]];
                        }

                        return value;
                    }

                    return data[key];
                }

                return data;
            }

            return "";
        }
    }, {
        key: "query",
        value: function query(selector) {
            if (typeof selector == "string") {
                return document.querySelector(selector);
            } else {
                return selector;
            }
        }
    }, {
        key: "innerStyle",
        value: function innerStyle(value) {
            var _styleValue = Object.keys(value).map(function (e) {
                var _val = value[e];

                return e + ":" + (typeof _val != "number" ? _val : _val + "px");
            }).join(";");

            return "style = \"" + _styleValue + "\"";
        }
    }]);

    return TemplatePaser;
}();
