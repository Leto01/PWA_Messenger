import { login } from "./chat.service.js";
import { deleteCookie, setNewCookie, setSessionCookie } from "./cookie.service.js";
import {
  appendChild,
  createElement,
  getEmptyContent,
  makeInput,
  createButton,
  ENUM_SET,
} from "./helper.js";

let stayLoggedIn = false;

var rerender = () => {
  console.warn("no rerender method set");
};

export function loadLoginPage(callback, err, successLogout) {
  rerender = callback;
  var c = getEmptyContent(".contentContainer");
  var feeldSet = getFeeldSet();
  if (err) {
    var errorMsg = createElement("div", "errorMsg");
    errorMsg.innerHTML = "Username or password is wrong";
    c.appendChild(errorMsg);
  }
  if (successLogout) {
    var successMsg = createElement("div", "successLogout");
    successMsg.innerHTML = successLogout;
    c.appendChild(successMsg);
  }
  appendChild(c, [feeldSet]);
}

const DAYS_STAY_LOGGED_IN = 30;

function validateLoginResponse(data, uid) {
  const status = data.status;
  if (status != "error") {
    if (stayLoggedIn) {
      setNewCookie(ENUM_SET.COOKIE_SET.token, data.token, DAYS_STAY_LOGGED_IN);
      setNewCookie(ENUM_SET.COOKIE_SET.hash, data.hash, DAYS_STAY_LOGGED_IN);
      setNewCookie(ENUM_SET.COOKIE_SET.userId, uid, DAYS_STAY_LOGGED_IN);
    } else {
      setSessionCookie(ENUM_SET.COOKIE_SET.token, data.token);
      setSessionCookie(ENUM_SET.COOKIE_SET.hash, data.hash);
      setSessionCookie(ENUM_SET.COOKIE_SET.userId, uid);
    }
    rerender(ENUM_SET.STATES.Chat, undefined, data.hash);
  } else {
    deleteCookie(ENUM_SET.COOKIE_SET.userId);
    rerender(ENUM_SET.STATES.Login, data.message);
  }
}

function pageLoginSent(pw, id) {
  login(id.trim(), pw)
    .then((r) => {
      r.json().then((data) => {
        validateLoginResponse(data, id);
      });
    })
    .catch((err) => {
      rerender(ENUM_SET.STATES.Login, err);
    });
}

function onRegister(e) {
  e.preventDefault();
  rerender(ENUM_SET.STATES.Register, undefined);
}

function getFeeldSet() {
  var container = createElement("div", "loginContainer");
  var form = createElement("form", "content login");
  var div = createElement("div", "inputfield");
  var h1Title = createElement("h1", "title_h2");
  var stayLoggedInTickBox = createElement("input", "stayLoggedInTickBox");
  stayLoggedInTickBox.setAttribute("type", "checkbox");
  stayLoggedInTickBox.setAttribute("id", "tickbox1");

  var tickboxlabel = createElement("label", "tickLabel");
  tickboxlabel.setAttribute("for", "tickbox1");
  tickboxlabel.innerText = "Stay logged in";
  var remembermeDialog = createElement("div", "rememberMe");
  appendChild(remembermeDialog, [stayLoggedInTickBox, tickboxlabel]);
  h1Title.innerText = "P-WAM";
  appendChild(form, [div]);
  appendChild(container, [h1Title, LoginAdd(), form]);
  const inputName = makeInput("text", "userId", "User ID", 8);
  const brk = createElement("br");
  const inputPassword = makeInput("password", "password", "Password", 5);
  appendChild(div, [
    inputName,
    brk,
    inputPassword,
    createElement("br"),
    remembermeDialog,
  ]);

  var divButton = createElement("div", "submitbutton");
  var btn = createButton("btn", "login", "LOGIN");
  var regBtn = createButton("btn", "register", "REGISTER");
  btn.setAttribute("disabled", "");

  const btnEnabler = (e) => {
    e.preventDefault();
    btn.disabled =
      !inputName.reportValidity() || !inputPassword.reportValidity();
    stayLoggedIn = stayLoggedInTickBox.checked;
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

  return container;
}

function LoginAdd() {
  let div = createElement("h4", "addBaner");
  div.innerText = "Apps & UX Messenger";
  return div;
}
