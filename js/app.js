// import Login from "./Login.js";
import { loadRegisterPage } from "./Register.js";
import { loadLoginPage } from "./Login.js";
import { loadChatPage } from "./chat.js";
import { getCookie, setNewCookie } from "./cookie.service.js";
import { ENUM_SET } from "./helper.js";
/**
 * every page needs to refer to this js-file
 */

var loginErrorMessage = undefined;
var state = getCookie("state")||ENUM_SET.STATES.Login;
var logoutSuccess = false;
if(getCookie(ENUM_SET.COOKIE_SET.token) !== "") state = getCookie(ENUM_SET.COOKIE_SET.state);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => {
      console.log("SW registered", reg);
    })
    .catch((error) => {
      console.warn("SW not registered", error);
    });
}

window.onload = () => {
  initApp();
};

function initApp() {
  document.body.addEventListener("spaContentLoaded", console.log);
  const s = getCookie(ENUM_SET.COOKIE_SET.state);
  const h = getCookie(ENUM_SET.COOKIE_SET.hash);
  renderPage()
}

function updateApp(newState, loginerror, userhash, successMsg) {
  setNewCookie(ENUM_SET.COOKIE_SET.state, newState, 10);
  state = newState;
  loginErrorMessage = loginerror;
  logoutSuccess = successMsg;
  renderPage(userhash);
}

function renderPage(userhash) {
  switch (state) {
    case ENUM_SET.STATES.Login:
      loadLoginPage(updateApp, loginErrorMessage, logoutSuccess);
      break;
    case ENUM_SET.STATES.Register:
      loadRegisterPage(updateApp);
      break;
    case ENUM_SET.STATES.Chat:
      loadChatPage(updateApp, userhash);
      break;
    default:
      loadLoginPage(updateApp, loginErrorMessage);
      break;
  }
}