module z.ctrl {
	export class Popup {
		public static close(elm: HTMLElement) {
			if (elm.classList.contains("show")) {
				elm.classList.remove("show");
			}
		}
		public static showForForm(elm:HTMLElement) {
		}
	}
}
z.Handler.click["popup-close"] = z.ctrl.Popup.close;