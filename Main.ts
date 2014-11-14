module z {
    "use strict";
    "TsLib 1.0.0.1 alpha";
	"@2014 iCorel.com";
}
var isDebug: boolean;
var isMobile: boolean;
var HOST: string, PORT: string;
interface HTMLElement {
    el(str: string): HTMLElement;
    els(str: string): Array<HTMLElement>;
    json: any;
    jsObj: any;
}
HTMLElement.prototype.json = function () {
	var out = null;
	toElArray(this.childNodes).forEach(x=> {
		if (x.nodeType == x.COMMENT_NODE) {
			var str = x.nodeValue;
			str = str.replace("<json>", "").replace("</json>", "");
			out=JSON.parse(str);
			return out;
		}
	});
	return out;
}
HTMLElement.prototype.el = function (str: string) {
    return this.querySelector(str);
}
HTMLElement.prototype.els = function (str: string) {
    return toElArray(this.querySelectorAll(str));
}
function el(str: string): HTMLElement {
    return <any>document.querySelector(str);
}
function els(str: string): Array<HTMLElement> {
    return toElArray(document.querySelectorAll(str));
}
function toElArray(In: NodeList): Array<HTMLElement> {
    var arr = new Array();
    for (var i = 0; i < In.length; i++) {
        arr.push(In.item(i));
    }
    return arr;
}
interface String {
    json: any;
    removeJson(json: any): String;
}
String.prototype.json = function () {
    var str = this;
    var reg = new RegExp(".*<!--<json>(.*)</json>-->.*");
    if (reg.test(str)) {
        var str = str.match(new RegExp("<!--<json>.*</json>-->", "gi")).pop();
        str = str.replace("<!--<json>", "").replace("</json>-->", "");
        return JSON.parse(str);
    }
}
String.prototype.removeJson = function (json: any) {
    var str = this;
    var reg = new RegExp(".*<!--<json>(.*)</json>-->.*");
    if (reg.test(str)) {
        var out = out.match(new RegExp("<!--<json>.*</json>-->", "gi")).pop();
        var out1 = out.replace("<!--<json>", "").replace("</json>-->", "");
        json = JSON.parse(out1);
		 return str.replace(out, "");
    }
    return str;
}
var bugGLevel = 0;
function dbO(title): number {
    console.groupCollapsed(title);
    return bugGLevel++;
}
function dbE(level: number) {
    for (var i = level; i >= bugGLevel-1; i--) {
        console.groupEnd();
    }
    bugGLevel = i;
}