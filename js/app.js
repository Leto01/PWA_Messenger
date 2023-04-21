// import Login from "./Login.js";
import { loadRegisterPage } from "./Register.js";
import {
  loadLoginPage
} from "./Login.js";
import { getEmptyContent } from "./helper.js";
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
var state = stateList.Login; //fetch from cache later on

window.onload = () => {
  initApp();
};

function initApp() {
  document.body.addEventListener("spaContentLoaded", updateApp);
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
      break;
    default:
      break;
  }
}




// class myApp {
//   cLogin = new Login(this.updateApp);
//   // cChat = new Chat(this.updateApp);
//   cRegister = new Register(this.updateApp);

//   loginErrorMessage = undefined;
//   constructor(state) {
//     this.state = state;
//     this.initAllEventListener();
//     this.renderPage();
//   }

//   initAllEventListener() {
//     document.body.addEventListener("spaContentLoaded", this.updateApp);
//   }
//   updateApp(newState, loginerror) {
//     this.state = newState;
//     this.loginErrorMessage = loginerror;
//     console.log(this.state);
//     this.renderPage();
//   }
//   renderPage() {
//     switch (this.state) {
//       case stateList.Login:
//         this.cLogin.loadPage(this.loginErrorMessage);
//         break;
//       case stateList.Register:
//         this.cRegister.loadPage();
//         break;
//       case stateList.Chat:
//         break;
//       default:
//         break;
//     }
//   }
// }
