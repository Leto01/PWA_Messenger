// import Login from "./Login.js";
import { loadRegisterPage } from "./Register.js";
import { loadLoginPage } from "./Login.js";
import { loadChatPage } from "./chat.js";
import { getCookie, setNewCookie } from "./cookie.service.js";
import { ENUM_SET } from "./helper.js";
/**
 * every page needs to refer to this js-file
 */
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

const stateList = {
  Login: 1,
  Register: 2,
  Chat: 3,
};

var loginErrorMessage = undefined;
var state = getCookie(ENUM_SET.COOKIE_SET.state); //fetch from cache later on

window.onload = () => {
  initApp();
};

function initApp() {
  document.body.addEventListener("spaContentLoaded", console.log);
  renderPage()
}

function updateApp(newState, loginerror) {
  setNewCookie(ENUM_SET.COOKIE_SET.state, newState);
  state = newState;
  loginErrorMessage = loginerror;
  renderPage();
}

function renderPage() {
  switch (state) {
    case ENUM_SET.STATES.Login:
      loadLoginPage(updateApp, loginErrorMessage);
      break;
    case ENUM_SET.STATES.Register:
      loadRegisterPage(updateApp);
      break;
    case ENUM_SET.STATES.Chat:
      loadChatPage(updateApp);
      break;
    default:
      loadLoginPage(updateApp, loginErrorMessage);
      break;
  }
}