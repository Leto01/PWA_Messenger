import { login } from "./chat.service.js";
import { setNewCookie } from "./cookie.service.js";
import {
  appendChild,
  createElement,
  getEmptyContent,
  makeInput,
  createButton,
  ENUM_SET,
} from "./helper.js";

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
  if (successLogout){
    // var successMsg = createElement("div", "successLogout");
    // successMsg.innerHTML = successLogout;
    // c.appendChild(successMsg);
  }
  appendChild(c, [feeldSet]);
}

function validateLoginResponse(data) {
  const status = data.status;
  if (status != "error") {
    setNewCookie(ENUM_SET.COOKIE_SET.token, data.token, 1);
    setNewCookie(ENUM_SET.COOKIE_SET.hash, data.hash, 1);
    rerender(ENUM_SET.STATES.Chat, undefined, data.hash);
  } else {
    rerender(ENUM_SET.STATES.Login, data.message);
  }
}

function pageLoginSent(pw, id) {
  console.log("call Login:");
  login(id, pw)
    .then((r) => {
      console.log(r)
      r.json().then((data) => {
        console.log(data)
        validateLoginResponse(data);
      })
    }
    )
    .catch((err) => {
      console.error(err);
      rerender(ENUM_SET.STATES.Login, err);
    });
}

function onRegister(e) {
  e.preventDefault();
  rerender(ENUM_SET.STATES.Register, undefined);
}

function getFeeldSet() {
  var container = createElement("div", "loginContainer")
  var form = createElement("form", "content login");
  var div = createElement("div", "inputfield");
  var h1Title = createElement("h1", "title_h2");
  h1Title.innerText = "P-WAM";
  appendChild(form, [div]);
  appendChild(container, [h1Title, LoginAdd(), form])
  const inputName = makeInput("text", "userId", "User ID", 8);
  const brk = createElement("br");
  const inputPassword = makeInput(
    "password",
    "password",
    "Password",
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

  return container;
}

function LoginAdd() {
  let div = createElement("h4", "addBaner");
  div.innerText = "Apps & UX Messenger"
  return div;
}