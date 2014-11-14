module z.jsCtrl {
	export class Ctrl {
		constructor(public elm: HTMLElement) {
			elm.jsObj = this;
		}
	}
}