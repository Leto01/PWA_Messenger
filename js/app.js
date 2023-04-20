import { Login } from "./Login.js";
import { Register } from "./Register.js";
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

window.onload = () => {
  const loadupState = stateList.Register; // create a way to recreate last state via cache/cookies/localstorage
  const app = new myApp(loadupState);
};

class myApp {
  cLogin = new Login(this.updateApp);
  // cChat = new Chat(this.updateApp);
  cRegister = new Register(this.updateApp);

  loginErrorMessage = undefined;
  constructor(state) {
    this.state = state;
    this.initAllEventListener();
    this.renderPage();
  }

  initAllEventListener() {
    document.body.addEventListener("spaContentLoaded", this.updateApp);
  }
  updateApp(newState, loginerror) {
    this.state = newState;
    this.loginErrorMessage = loginerror;
    this.renderPage();
  }
  renderPage() {
    switch (this.state) {
      case stateList.Login:
        this.cLogin.loadPage(this.loginErrorMessage);
        break;
      case stateList.Register:
        this.cRegister.loadPage();
        break;
      case stateList.Chat:
        break;
      default:
        break;
    }
  }
}
