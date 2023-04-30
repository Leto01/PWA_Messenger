import { register } from "./chat.service.js";
import { setNewCookie } from "./cookie.service.js";
import {
  getEmptyContent,
  appendChild,
  createElement,
  makeInput,
  createButton,
  ENUM_SET
} from "./helper.js";

var rerender = () => {
  console.warn("no rerender method set");
};

export function loadRegisterPage(callback) {
  rerender = callback;
  var c = getEmptyContent(".contentContainer");

  var feeldSet = getFeeldSet();
  appendChild(c, [feeldSet]);
}

function getFeeldSet() {
  var form = createElement("form", "content register");
  var div = createElement("div", "inputfield");
  var h3Title = createElement("h3", "title_h3");
  h3Title.innerText = "Register here";
  appendChild(form, [h3Title, div]);

  const inputName = makeInput("text", "userId", "HS-ID (=8 Char)", 8);
  const inputFullName = makeInput("text", "fullName", "Full Name", 1);
  const inputNickName = makeInput("text", "nickname", "Nickname", 1);
  const brk = createElement("br");
  const inputPassword = makeInput(
    "password",
    "password",
    "Password (>5 Char)",
    5
  );
  const inputPasswordRepeat = makeInput(
    "password",
    "password",
    "Repeat Password",
    5
  );
  appendChild(div, [
    inputName,
    inputFullName,
    inputNickName,
    inputPassword,
    inputPasswordRepeat,
  ]);

  var divButton = createElement("div", "submitbutton");
  var btn = createButton("btn", "register", "REGISTER");
  var returnToLogin = createButton("btn", "return", "RETURN TO LOGIN");
  returnToLogin.addEventListener(
    "click",
    () => {
      rerender(ENUM_SET.STATES.Login, undefined);
    },
    false
  );

  btn.setAttribute("disabled", "");

  const btnEnabler = () => {
    btn.disabled =
      !inputName.reportValidity() ||
      !inputPassword.reportValidity() ||
      inputPassword.value !== inputPasswordRepeat.value;
  };

  form.addEventListener("input", btnEnabler);

  btn.addEventListener("click", () => {
    pageRegisterSent(
      inputName.value,
      inputFullName.value,
      inputNickName.value,
      inputPassword.value
    );
  });

  appendChild(divButton, [btn, returnToLogin]);
  appendChild(form, [divButton]);
  return form;
}

function pageRegisterSent(id, fullName, nickname, pw) {
  register(id, pw, nickname, fullName).then((res) =>
    res.json().then((data) => {
      if (data.code === 200) {
        setNewCookie(ENUM_SET.COOKIE_SET.token, data.token);
        setNewCookie(ENUM_SET.COOKIE_SET.username, nickname);
        setNewCookie(ENUM_SET.COOKIE_SET.hash, data.hash);
        rerender(ENUM_SET.STATES.Chat, undefined);
      } else {

      }
    })
  );
}
