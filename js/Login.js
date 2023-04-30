import { login } from "./chat.service.js";
import { setNewCookie } from "./cookie.service.js";
import {
  appendChild,
  createElement,
  getEmptyContent,
  makeInput,
  createButton,
} from "./helper.js";

var rerender = () => {
  console.warn("no rerender method set");
};

export function loadLoginPage(callback, err) {
  rerender = callback;
  var c = getEmptyContent(".contentContainer");
  var feeldSet = getFeeldSet();
  if (err) {
    var errorMsg = createElement("div");
    errorMsg.innerHTML = err;
    c.appendChild(errorMsg);
  }
  appendChild(c, [feeldSet]);
}

function pageLoginSent(pw, id) {
  console.log("call Login:");
  login(id, pw)
    .then((r) =>
      r.json().then((data) => {
        var myToken = data.token;
        setNewCookie("token", data.token);
        setNewCookie("hash", data.hash);
        console.log(data.token);
        console.log(data.hash);
        rerender(3, undefined);
      })
    )
    .catch((err) => {
      console.error(err);
      rerender(1, err);
    });
}

function onRegister(e) {
  e.preventDefault();
  rerender(2, undefined);
}

function getFeeldSet() {
  var form = createElement("form", "content login");
  var div = createElement("div", "inputfield");
  var h2Title = createElement("h2", "title_h2");
  h2Title.innerText = "P-WAM";
  appendChild(form, [h2Title, div]);

  const inputName = makeInput("text", "userId", "User ID (=8 Char)", 8);
  const brk = createElement("br");
  const inputPassword = makeInput(
    "password",
    "password",
    "Password (>5 Char)",
    5
  );
  appendChild(div, [inputName, brk, inputPassword]);

  var divButton = createElement("div", "submitbutton");
  var btn = createButton("btn", "login", "LOGIN");
  var regBtn = createButton("btn", "register", "REGISTER");
  btn.setAttribute("disabled", "");

  const btnEnabler = (e) => {
    e.preventDefault();
    btn.disabled =
      !inputName.reportValidity() || !inputPassword.reportValidity();
    //btn.removeAttribute("disabled");
  };

  form.addEventListener("input", btnEnabler);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    pageLoginSent(inputPassword.value, inputName.value);
  });

  regBtn.addEventListener("click", onRegister);

  appendChild(divButton, [btn, regBtn]);
  appendChild(form, [divButton]);

  return form;
}
