// import Login from "./Login.js";
import { loadRegisterPage } from "./Register.js";
import { loadLoginPage } from "./Login.js";
import { loadChatPage } from "./chat.js";
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
var state = stateList.Chat; //fetch from cache later on

window.onload = () => {
  initApp();
};

function initApp() {
  document.body.addEventListener("spaContentLoaded", console.log);
  renderPage()
}

function updateApp(newState, loginerror) {
  state = newState;
  loginErrorMessage = loginerror;
  renderPage();
}

function renderPage() {
  switch (state) {
    case stateList.Login:
      loadLoginPage(updateApp, loginErrorMessage);
      break;
    case stateList.Register:
      loadRegisterPage(updateApp);
      break;
    case stateList.Chat:
      loadChatPage(updateApp);
      break;
    default:
      break;
  }
}