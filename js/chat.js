import {
  fetchPhoto,
  fetchmessage,
  logout,
  sendmessage,
  sendPicture
} from "./chat.service.js";
import { deleteCookie, getCookie } from "./cookie.service.js";
import {
  ENUM_SET,
  appendChild,
  createButton,
  createElement,
  createHeadder,
  getEmptyContent,
  getColorOfUserhash,
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
let imgUrl;
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
}

function scrollDown() {
  const element = document.getElementsByClassName("messageview")[0];
  element.scrollTop = element.scrollHeight;
}

function initHeader() {
  var div = createElement("div", "chatHeaderDiv");
  var title = createElement("h1");
  title.innerText = "P-WAM";
  var clickLogout = createElement("div", "logoutButton");
  var logoutIco = createElement("img", "logout lightIcon");

  logoutIco.setAttribute("src", "../assets/logout.svg");
  logoutIco.setAttribute("alt", "Logout button");

  clickLogout.addEventListener("click", onLogout);

  appendChild(clickLogout, [logoutIco]);
  appendChild(div, [title, clickLogout]);

  return div;
}

function onLogout() {
  const token = getCookie(ENUM_SET.COOKIE_SET.token);
  logout(token)
    .then(() => {
      cleanCache(undefined, true);
    })
    .catch(console.error);
}

function cleanCache(errorMsg, success = false) {
  deleteCookie(ENUM_SET.COOKIE_SET.hash);
  deleteCookie(ENUM_SET.COOKIE_SET.token);
  rerender(ENUM_SET.STATES.Login, errorMsg, undefined, "Logout success");
}

function getChatMessageBox() {

  var form = createElement("form", "messageBox");
  var messageInput = createElement("textarea", "messageInput"); //Input
  var CameraBtn = createButton("btn cameraBtn", "sendbutton", "");
  const cameraIcon = createElement("img", "cameraIco darkIcon");
  var sendBtn = createButton("btn sendMessageBtn", "sendbutton", "");
  const sendIcon = createElement("img", "sendIco darkIcon");

  const sendMsg = (e) => {
    e.preventDefault();
    if (messageInput.value.trim() !== "") {
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
    }
  };

  messageInput.setAttribute("placeholder","Message")
  messageInput.setAttribute("style", "height:54px; overflow-y:hidden;");
  messageInput.addEventListener(
    "keydown",
    (e) => {
      if(e.key==="Enter" && !e.ctrlKey){
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

  appendChild(form, [CameraBtn, messageInput, sendBtn]);
  return form;
}

function openCamDialog(e) {
  e.preventDefault();
  if (!"mediaDevices" in navigator) return;
  let camPopup = createElement("div", "camPopup");
  camPopup.setAttribute("id", "cameraPopup");
  let camWraper = createElement("div", "camWrapper")
  let camView = createElement("video", "cameraView");

  camView.setAttribute("autoplay", "");
  navigator.mediaDevices.getUserMedia({video:{
    width:640,
    height:480,
    facingMode:"user"
  }, audio:false}).then( stream => {
    camStream = camView;
    camView.srcObject = stream;
  }).catch(console.warn);

  let takeImgBtn = createButton("btn takeImgBtn", "Photobutton", "");

  takeImgBtn.addEventListener('click', e=>{
    e.preventDefault();
    imgCanvas = createElement("canvas", "imgCanvas");
    imgCanvas.width = 640;//camStream.videoWidth;
    imgCanvas.height = 480;//camStream.videoHeight;
    
    let ctx = imgCanvas.getContext("2d");
    console.log(ctx)
    ctx.drawImage(camStream, 0, 0, imgCanvas.width, imgCanvas.height);
    imgUrl = ctx.canvas.toDataURL();
    imgUrl.slice(22);
    ctx = null;
    imgCanvas = null;
    const t = getCookie(ENUM_SET.COOKIE_SET.token);
    sendPicture("Test pic 3", imgUrl.slice(22), t).then(res=>{
      rerender(ENUM_SET.STATES.Chat, undefined, getCookie(ENUM_SET.COOKIE_SET.hash));
    })

  })

  appendChild(camWraper, [camView, takeImgBtn]);
  appendChild(camPopup, [camWraper]);
  appendChild(globalContentcontainer, [camPopup]);
}



function switchOn() {
  // Get camera media stream and set it to player
  navigator.mediaDevices
    .getUserMedia({
      video: { width: 640, height: 480 },
      audio: false,
      facingMode: "user", // or environment
    })
    .then((stream) => {
      console.log("Establish stream");
      this.videoNode.srcObject = this.stream = stream;
    });
}

function appendNewSendMessage(msg) {
  const div = document.getElementsByClassName("messageview");
  appendChild(div[0], [displayMessage(msg)]);
  scrollDown();
}

function getMessageView() {
  var messageViewDiv = createElement("div", "messageview");

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
                    return res.text();
                  })
                  .then((res) => {
                    const url =
                      "https://www2.hs-esslingen.de/~melcher/map/chat/api/?request=getphoto&token=" +
                      getCookie(ENUM_SET.COOKIE_SET.token) +
                      "&photoid=" +
                      m.photoid;
                    m.imgUrl = url;
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
}

function displayMessage(oMessage) {
  var isMe = oMessage.userhash === testMyHash;
  chatId = oMessage.chatId;

  if (isMe) {
    myUserName = oMessage.usernickname;
  }
  var messageContainer = createElement(
    "div",
    "message" + (isMe ? " mine" : "") + " top"
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
