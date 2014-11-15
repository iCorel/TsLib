/// <reference path="../main.ts" />
/// <reference path="../handler.ts" />
module z.ctrl {
	export class Ctrl {
		constructor(public elm: HTMLElement) {
			elm.jsObj = this;
		}
	}
} 