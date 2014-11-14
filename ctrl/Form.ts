module z.ctrl {
	export class Form {
		public static onclick(elm: HTMLElement, evt: MouseEvent) {
			var base = Form.getBase(elm);
			var isSingle: boolean = elm.isEqualNode(base);
			isSingle = isSingle || base.tagName == "FORM";
			isSingle = isSingle || base.getAttribute("data-ctrl") == "form";
			var form = isSingle?base: Form.getForm(elm);
			var dat = Form.getFormData(form);
			if (elm.hasAttribute("data-act"))
				dat.append("act", elm.getAttribute("data-act"));
			dat.append("isAjax", "1");
			var ajax = new XMLHttpRequest();
			ajax.open("POST", base.getAttribute("data-url"));
			ajax.onload = x=> {
				var Ret = <String>ajax.response;
				var json;
				Ret = Ret.removeJson(json);
				form.outerHTML = <string>Ret;
				//if (json.isValid) {
				//}
				//document.onreadystatechange= x=> {
					z.Handler.invokeRunlater();
				//};
			};
			ajax.onprogress = x=> {
				if (form.hasAttribute("data-progress")) {
					var eli = el(form.getAttribute(""));
					var val = (x.loaded / x.total * 100) + "%";
					eli.style.width = val;
					eli.innerText = val;
				}
			};
			ajax.send(dat);
		}
		public static popup(elm: HTMLElement, evt: MouseEvent) {
			var base = Form.getBase(elm);
			var isSingle: boolean = elm.isEqualNode(base);
			isSingle = isSingle || base.tagName == "FORM";
			isSingle = isSingle || base.getAttribute("data-ctrl") == "form";
			var form = isSingle ? base : Form.getForm(elm);
			var dat = Form.getDat(form);
			var popup = el(base.getAttribute("data-popup"));
			//if (elm.hasAttribute("data-act"))
			//	dat.append("act", elm.getAttribute("data-act"));
			//dat.append("isAjax", "1");
			Form.setDat(popup, dat);
			if (!popup.classList.contains("show")) {
				popup.classList.add("show");
			}
			(<any>popup).dat = form;
		}
		public static popupOk(elm: HTMLElement) {
			var form = Form.getForm(elm);
			var target: HTMLElement = (<any>form).dat;
			Form.setDat(target, Form.getDat(form));
			ctrl.Popup.close(target);
		}
		public static popupAdd(elm: HTMLElement) {
			var form = Form.getForm(elm);
			var target: HTMLElement = (<any>form).dat;
			Form.setDat(target, Form.getDat(form));
			ctrl.Popup.close(target);
		}
		public static setDat(elm: HTMLElement, dat: any) {
			for (var key in dat) {
				var eli = elm.el('[name="' + key + '"]');
				if (eli == null) continue;
				switch (eli.tagName.toUpperCase()) {
					case "INPUT":
						var input:HTMLInputElement = <any>eli;
						switch (input.type) {
							case "checkbox":
								input.checked = dat[key];
								break;
							default:
								input.value = dat[key];
							}
						break;
					case "TEXTAREA": eli.innerText = dat[key];
						break;
				}
			}
		}
		public static getForm(elm: HTMLElement): HTMLElement {
			var eli = elm;
			while (eli.nodeName != "BODY") {
				if (eli.getAttribute("data-ctrl") == "form") {
					return eli;
				}
				eli = eli.parentElement;
			}
			console.error("Not Found [Form]"); return;
		}
		public static getBase(elm: HTMLElement) {
			var eli = elm;
			while (eli.nodeName != "BODY") {
				if (eli.hasAttribute("data-url")) {
					return eli;
				}
				eli = eli.parentElement;
			}
			console.error("Not Find [Url]"); return;
		}
		public static getDat(elm: HTMLElement): any {
			var Out = new Object;
			elm.els("textarea").forEach((x: HTMLInputElement) => {
				Out[x.name]=x.value;
			});
			elm.els("input").forEach((x: HTMLInputElement) => {
				switch (x.type) {
					case "checkbox": Out[x.name] = x.checked; break;
					default: Out[x.name] = x.value;
				}
			});
			elm.els("select").forEach((x: HTMLSelectElement) => {
				Out[x.name] = x.value;
			});
			//elm.els("[contenteditable='true']").forEach((x: HTMLElement) => {
			//	Out.append(x.getAttribute("data-name"), x.innerHTML);
			//});
			//elm.els('[data-ctrl="select"]').forEach((x: HTMLElement) => {
			//	Out.append(x.getAttribute("data-name"), x.getAttribute("data-value"));
			//});
			return Out;
		}
		public static getFormData(elm: HTMLElement): FormData {
			var Out = new FormData;
			elm.els("textarea").forEach((x: HTMLInputElement) => {
				Out.append(x.name, x.value);
			});
			elm.els("input").forEach((x: HTMLInputElement) => {
				switch (x.type) {
					case "checkbox": Out.append(x.name, x.checked); break;
					default: Out.append(x.name, x.value);
				}
			});
			elm.els("select").forEach((x: HTMLSelectElement) => {
				Out.append(x.name, x.value);
			});
			elm.els("[contenteditable='true']").forEach((x: HTMLElement) => {
				Out.append(x.getAttribute("data-name"), x.innerHTML);
			});
			elm.els('[data-ctrl="select"]').forEach((x: HTMLElement) => {
				Out.append(x.getAttribute("data-name"), x.getAttribute("data-value"));
			});
			return Out;
		}
	}
}
z.Handler.click["form"] = z.ctrl.Form.onclick;
z.Handler.click["form-popup"] = z.ctrl.Form.popup;
z.Handler.click["form-popupOk"] = z.ctrl.Form.popupOk;