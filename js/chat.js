import {
  fetchPhoto,
  fetchmessage,
  logout,
  sendmessage,
  sendPicture,
  deregister
} from "./chat.service.js";
import { deleteCookie, getCookie, setNewCookie } from "./cookie.service.js";
import {
  ENUM_SET,
  appendChild,
  createButton,
  createElement,
  createHeadder,
  getEmptyContent,
  getColorOfUserhash,
  switchTheme
} from "./helper.js";

var rerender = () => {
  console.warn("no rerender method set");
};

let testMyHash = getCookie(ENUM_SET.COOKIE_SET.hash);
const messageSet = { messages: [] };
var myUserName = "";
var chatId = 0;
var errorSend = false;
const d = new Date();
let globalContentcontainer;
let camStream;
let imgCanvas;
let imgUrl = "";
let msgInputForm;
let imgDetailView = false;

export function loadChatPage(callback, uhash) {
  testMyHash = uhash;
  rerender = callback;
  var c = getEmptyContent(".contentContainer");
  globalContentcontainer = c;
  var messageBox = getChatMessageBox();
  var messageView = getMessageView();

  var headercontent = initHeader();
  var header = createHeadder(headercontent);
  appendChild(c, [header, messageView, messageBox]);
  console.log("Load Chat Page")
}

function scrollDown() {
  const element = document.getElementsByClassName("messageview")[0];
  element.scrollTop = element.scrollHeight;
}

function initHeader() {
  var div = createElement("div", "chatHeaderDiv");
  var title = createElement("h1");
  title.innerText = "P-WAM";

  //Dropdown Menu on Settings
  const dropdown = createElement("div", "dropdown");

  //Settingsbutton with icon
  var settingsIco = createElement("img", "settings dropdownContext lightIcon");
  settingsIco.setAttribute("src", "../assets/settings.svg");
  settingsIco.setAttribute("alt", "Open settings");
  var clickSettings = createElement("div", "settingButton");
  appendChild(clickSettings, [settingsIco]);
  clickSettings.addEventListener("click", toggleDropdownVisability);
  var clickLogout = createElement("div", "logoutButton");
  clickLogout.addEventListener("click", onLogout);
  appendChild(dropdown, [clickSettings, createDropdownContent()]);
  // appendChild(clickLogout, [settingsIco]);
  appendChild(div, [title, dropdown]);
  return div;
}

function toggleDropdownVisability() {
  document.getElementById("DropdownMenu").classList.toggle("show");
}

function openDetailImgView(src){
  let popup = createElement("div", "imageDetailViewPopup");
  let img = createElement("img", "detailImageView");
  img.setAttribute("src", src);
  let closeIcon = createElement("img", "closeImgDetailView lightIcon");
  closeIcon.setAttribute("src", "../assets/close.svg");
  appendChild(popup, [closeIcon, img]);
  closeIcon.addEventListener("click", () => {
    imgDetailView=false;
    popup.remove();
  });
  appendChild(globalContentcontainer, [popup]);
}

window.onclick = function (event) {
  if(event.target.matches(".messageImage") && !imgDetailView){
    imgDetailView = true;
    openDetailImgView(event.target.src);
  }

  if (!event.target.matches(".dropdownContext")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

function createDropdownContent() {
  var container = createElement("div", "dropdown-content dropdownContext");
  container.setAttribute("id", "DropdownMenu");

  let toggleContainer = createElement(
    "div",
    "toggleSwitchContainer dropdownContext"
  );
  let toggleLabel = createElement("h3", "toggleLabel dropdownContext");
  toggleLabel.innerText = "Toggle Theme";
  let toggleTheme = createElement("label", "themetoggle dropdownContext");
  appendChild(toggleContainer, [toggleLabel, toggleTheme]);

  let checkBox = createElement("input", "dropdownContext");
  checkBox.setAttribute("type", "checkbox");

  checkBox.addEventListener("click", safeSwitchTheme);

  let slider = createElement("span", "slider dropdownContext");
  appendChild(toggleTheme, [checkBox, slider]);

  let logout = createElement("div", "logoutBtn dropdownContext");
  let logoutIco = createElement("img", "logoutIco lightIcon");
  logoutIco.setAttribute("src", "../assets/logout.svg");
  logoutIco.addEventListener("click", onLogout);
  let logoutTxt = createElement("h3", "logoutTitle dropdownContext");
  logoutTxt.innerText = "Logout";
  appendChild(logout, [logoutTxt, logoutIco]);

  let deregister = createElement("div", "deregisterBtn dropdownContext");
  let deregIco = createElement("img", "deregIcon");
  deregIco.setAttribute("src", "../assets/delete_forever.svg");
  let deregisterTitle = createElement("h3", "deregisterTitle dropdownContext");
  deregisterTitle.innerText = "Delete Account";
  deregIco.addEventListener("click", onDeregsiter);
  appendChild(deregister, [deregisterTitle, deregIco]);

  appendChild(container, [toggleContainer, logout, deregister]);
  return container;
}

function safeSwitchTheme(){
  const key = ENUM_SET.COOKIE_SET.theme;
  const dark = ENUM_SET.THEMES.dark;
  const light = ENUM_SET.THEMES.light;
  let targetTheme = light; 
  let currentTheme = getCookie(key);
  if(currentTheme == light || currentTheme == "")
  {
    targetTheme = dark;
  }
  setNewCookie(key, targetTheme, 30);
  switchTheme();
}

function onDeregsiter(){
  let input = window.prompt("Type in your userID to confirm the deletion of your account.");
  const uid = getCookie(ENUM_SET.COOKIE_SET.userId);
  if(input == uid){
    deregister(uid, getCookie(ENUM_SET.COOKIE_SET.token)).then(res => {
    cleanCache(undefined, "Account deleted.");
  }).catch(err => {
    console.log(err);
    window.alert("Failed to delete this account!");
  })}else{
    window.alert("Failed: Wrong userID!")
  }
}

function onLogout() {
  const token = getCookie(ENUM_SET.COOKIE_SET.token);
  logout(token)
    .then(() => {
      cleanCache(undefined);
    })
    .catch(console.error);
}

function cleanCache(errorMsg, successMsg) {
  deleteCookie(ENUM_SET.COOKIE_SET.hash);
  deleteCookie(ENUM_SET.COOKIE_SET.token);
  deleteCookie(ENUM_SET.COOKIE_SET.userId);
  rerender(ENUM_SET.STATES.Login, errorMsg, undefined, successMsg);
}

function getChatMessageBox() {
  var form = createElement("form", "messageBox");
  msgInputForm = form;
  var messageInput = createElement("textarea", "messageInput");
  var CameraBtn = createButton("btn cameraBtn", "sendbutton", "");
  const cameraIcon = createElement("img", "cameraIco lightIcon");
  var sendBtn = createButton("btn sendMessageBtn", "sendbutton", "");
  const sendIcon = createElement("img", "sendIco lightIcon");
  const sendMsg = (e) => {
    e.preventDefault();
    if (messageInput.value.trim() !== "" && imgUrl === "") {
      sendmessage(messageInput.value, getCookie(ENUM_SET.COOKIE_SET.token))
        .then((r) =>
          r
            .json()
            .then((data) => {
              errorSend = data.code !== 200;
              const msgObj = {
                id: messageSet.messages[messageSet.messages.length],
                userhash: getCookie(ENUM_SET.COOKIE_SET.hash),
                usernickname: myUserName,
                text: messageInput.value,
                time: "TODAY", //ADD TO ENUM SET FOR LESS MAGIC TEXT
                chatid: chatId,
              };
              messageInput.value = "";
              messageSet.messages.push(msgObj);
              appendNewSendMessage(msgObj);
              messageInput.style.height = "54px";
            })
            .catch(console.error)
        )
        .catch(console.error); // save request and resend later
    } else if (imgUrl !== "") {
      sendPicture(
        messageInput.value,
        imgUrl.slice(22),
        getCookie(ENUM_SET.COOKIE_SET.token)
      ).then((res) => {
        imgUrl = "";
        rerender(
          ENUM_SET.STATES.Chat,
          undefined,
          getCookie(ENUM_SET.COOKIE_SET.hash)
        );
      });
    }
  };

  messageInput.setAttribute("placeholder", "Message");
  messageInput.setAttribute("style", "height:54px; overflow-y:hidden;");
  messageInput.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Enter" && !e.ctrlKey) {
        sendMsg(e);
      }
      messageInput.style.height = "54px";
      messageInput.style.height = messageInput.scrollHeight + "px";
    },
    false
  );
  cameraIcon.setAttribute("src", "../assets/camera_icon.svg");
  cameraIcon.setAttribute("alt", "Open Camera Button");
  appendChild(CameraBtn, [cameraIcon]);
  CameraBtn.addEventListener("click", openCamDialog);
  sendIcon.setAttribute("src", "../assets/send_icon.svg");
  sendIcon.setAttribute("alt", "Send Message Button");
  appendChild(sendBtn, [sendIcon]);
  sendBtn.addEventListener("click", sendMsg);
  let appendex = [CameraBtn, messageInput, sendBtn];

  appendChild(form, appendex);
  return form;
}

function openCamDialog(e) {
  e.preventDefault();
  if (!"mediaDevices" in navigator) return;
  let camPopup = createElement("div", "camPopup");
  camPopup.setAttribute("id", "cameraPopup");
  let camWraper = createElement("div", "camWrapper");
  let camView = createElement("video", "cameraView");
  let closeIcon = createElement("img", "closeCameraView darkIcon");
  closeIcon.setAttribute("src", "../assets/close.svg");
  closeIcon.addEventListener("click", closeCameraView);
  camView.setAttribute("autoplay", "");
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: 640,
        height: 480,
        facingMode: "user",
      },
      audio: false,
    })
    .then((stream) => {
      camStream = camView;
      camView.srcObject = stream;
    })
    .catch(console.warn);

  let takeImgBtn = createButton("btn takeImgBtn", "Photobutton", "");

  takeImgBtn.addEventListener("click", (e) => {
    e.preventDefault();
    imgCanvas = createElement("canvas", "imgCanvas");
    imgCanvas.width = 640; //camStream.videoWidth;
    imgCanvas.height = 480; //camStream.videoHeight;

    let ctx = imgCanvas.getContext("2d");
    ctx.drawImage(camStream, 0, 0, imgCanvas.width, imgCanvas.height);
    imgUrl = ctx.canvas.toDataURL();
    imgUrl.slice(22);
    ctx = null;
    closeCameraView();
    addImagePreviewToMsgForm();
  });

  appendChild(camWraper, [closeIcon, camView, takeImgBtn]);
  appendChild(camPopup, [camWraper]);
  appendChild(globalContentcontainer, [camPopup]);
}

function addImagePreviewToMsgForm() {
  let prevDiv = createElement("div", "sendImgPreview");
  let closeIco = createElement("img", "closePreview darkIcon");
  closeIco.addEventListener("click", onCloseImgPreview)
  closeIco.setAttribute("src", "../assets/close.svg");
  let img = createElement("img", "prevImg");
  img.setAttribute("id", "previewImage");
  img.setAttribute("src", imgUrl);
  appendChild(prevDiv, [closeIco, img])
  appendChild(msgInputForm, [prevDiv]);
}

function onCloseImgPreview(){
  imgUrl = "";
  let div = msgInputForm.getElementsByClassName("sendImgPreview")[0];
  div.remove();
}

function closeCameraView(){
  imgCanvas = "";
  camStream = null;
  let div = document.getElementsByClassName("camPopup")[0];
  div.remove();
}

function appendNewSendMessage(msg) {
  const div = document.getElementsByClassName("messageview");
  appendChild(div[0], [displayMessage(msg)]);
  scrollDown();
}

function getMessageView() {
  var messageViewDiv = createElement("div", "messageview");
  messageViewDiv.addEventListener("resize", (e) => {
    console.log("resize detected");
  });
  fetchmessage(getCookie(ENUM_SET.COOKIE_SET.token))
    .then((r) => {
      if (r.status == ENUM_SET.STATES.falsyToken) {
        cleanCache("Token expired. New login requiered.");
      } else {
        r.json()
          .then((data) => {
            messageSet.messages = data.messages;
            messageSet.messages.forEach((m) => {
              if (m.photoid) {
                fetchPhoto(m.photoid, getCookie(ENUM_SET.COOKIE_SET.token))
                  .then((res) => {
                    return res.blob();
                  })
                  .then((res) => {
                    m.imgUrl = URL.createObjectURL(res);
                    addImageToMessage(m);
                  });
              }
            });
            messageSet.messages.forEach((m) => {
              appendChild(messageViewDiv, [displayMessage(m)]);
            });
            scrollDown();
          })
          .catch((err) => {
            console.warn(err);
          });
      }
    })
    .catch(console.warn);

  return messageViewDiv;
}

function addImageToMessage(mObj) {
  const id = mObj.id;
  let e = document.getElementById("c" + id);
  e.innerHTML = "";
  let img = createElement("img", "messageImage");
  var msg = createElement("p");
  msg.innerText = mObj.text ? mObj.text : "";
  img.setAttribute("src", mObj.imgUrl);
  img.setAttribute("alt", "photo");
  img.setAttribute("width", "100%");
  appendChild(e, [img, msg]);
  scrollDown();
}

function displayMessage(oMessage) {
  var isMe = oMessage.userhash === testMyHash;
  chatId = oMessage.chatId;

  if (isMe) {
    myUserName = oMessage.usernickname;
  }
  var messageContainer = createElement(
    "div",
    "message" + (isMe ? " mine" : " otherMsg") + " top"
  );
  messageContainer.setAttribute("id", oMessage.id);
  var userName = createElement(
    "h4",
    "username" + (errorSend ? " errorSend" : "")
  );
  userName.innerText = oMessage.usernickname;
  if (!isMe) {
    userName.setAttribute("style", getColorOfUserhash(oMessage.userhash));
  }
  var msgContainer = createElement("div");
  msgContainer.setAttribute("id", "c" + oMessage.id);
  var msg = createElement("p");
  msg.innerText = oMessage.text ? oMessage.text : "";
  var timestmp = createElement("p", "messageTimeStamp");
  timestmp.innerText = convertTime(oMessage.time);
  appendChild(msgContainer, [msg]);
  const itemList = isMe
    ? [msgContainer, timestmp]
    : [userName, msgContainer, timestmp];
  appendChild(messageContainer, itemList);
  return messageContainer;
}

function convertTime(str) {
  let dateStamp = new Date();
  let conf = {
    hour: "2-digit",
    minute: "2-digit",
  };
  if (str !== "TODAY") {
    let rawDate = str.split("_");
    rawDate[1] = rawDate[1].replaceAll("-", ":");
    const isoDate = rawDate.join("T") + "Z";
    dateStamp = new Date(isoDate);
    conf = { ...conf };
    //  dateStamp.setMonth(dateStamp.getMonth()-1);
    dateStamp.setHours(dateStamp.getHours() - 2);
  }
  const currDateStamp = new Date();

  const timeTodayInMs =
    currDateStamp.getHours() * 60 * 60 * 1000 +
    currDateStamp.getMinutes() * 60 * 1000 +
    currDateStamp.getSeconds() * 1000 +
    currDateStamp.getMilliseconds();
  if (currDateStamp.getTime() - dateStamp.getTime() >= timeTodayInMs) {
    conf = { ...conf, weekday: "short" };
    return dateStamp.toLocaleDateString([], conf);
  }
  return dateStamp.toLocaleTimeString([], conf);
}
