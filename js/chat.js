import { fetchmessage, logout, sendmessage } from "./chat.service.js";
import { getCookie } from "./cookie.service.js";
import {
  appendChild,
  createButton,
  createElement,
  createHeadder,
  getEmptyContent,
} from "./helper.js";

var rerender = () => {
  console.warn("no rerender method set");
};

const testMyHash = getCookie("hash");
const messageSet = { messages: [] };
var myUserName = "";
var chatId = 0;
var errorSend = false;
export function loadChatPage(callback) {
  rerender = callback;
  var c = getEmptyContent(".contentContainer");
  var messageBox = getChatMessageBox();
  var messageView = getMessageView();
  
  var headercontent = initHeader();
  var header = createHeadder(headercontent);
  appendChild(c, [header, messageView, messageBox]);
}

function scrollDown(){
  const element = document.getElementsByClassName("messageview")[0];
  console.log(element.scrollTop)
  element.scrollTop = element.scrollHeight;
  console.log(element.scrollTop)
}

function initHeader() {
  var div = createElement("div", "chatHeaderDiv");
  var title = createElement("h1");
  title.innerText = "P-WAM";
  var clickLogout = createElement("div", "logoutButton");
  var logoutIco = createElement("img", "logout");

  logoutIco.setAttribute("src", "../assets/logout.svg");
  logoutIco.setAttribute("alt", "Logout button");

  clickLogout.addEventListener("click", onLogout);

  appendChild(clickLogout, [logoutIco]);
  appendChild(div, [title, clickLogout]);

  return div;
}

function onLogout() {
  const token = getCookie("token");
  logout(token)
    .then(() => {
      rerender(1, undefined);
    })
    .catch(console.error);
}

function getChatMessageBox() {
  var form = createElement("form", "messageBox");
  var messageInput = createElement("input");

  var sendBtn = createButton("btn sendMessageBtn", "sendbutton", "SEND");
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (messageInput.value.trim() !== "") {
      sendmessage(messageInput.value, getCookie("token"))
        .then((r) =>
          r
            .json()
            .then((data) => {
              errorSend = data.code !== 200;
              const msgObj = {
                id: 12,
                userhash: getCookie("hash"),
                usernickname: myUserName,
                message: messageInput.value,
                time: Date.now().toString(),
                chatid: chatId,
              };
              messageSet.messages.push(msgObj);
              appendNewSendMessage(msgObj);
              messageInput.value;
            })
            .catch(console.error)
        )
        .catch(console.error); // save request and resend later
        messageInput.value = "";
    }
  });
  appendChild(form, [messageInput, sendBtn]);
  return form;
}

function appendNewSendMessage(msg) {
  const div = document.getElementsByClassName("messageview");
  appendChild(div[0], [displayMessage(msg)])
  scrollDown();
}

function getMessageView() {
  var messageViewDiv = createElement("div", "messageview");

  fetchmessage(getCookie("token"))
    .then((r) =>
      r
        .json()
        .then((data) => {
          messageSet.messages = data.messages;
          messageSet.messages.forEach((m) => {
            appendChild(messageViewDiv, [displayMessage(m)]);
          });
          scrollDown();
        })
        .catch((err) => {
          console.warn(err);
          console.warn("Error decoding fetchMessages");
        })
    )
    .catch(console.warn);

  return messageViewDiv;
}

function displayMessage(oMessage) {
  var isMe = oMessage.userhash === testMyHash;
  chatId = oMessage.chatId;
  if (isMe) {
    myUserName = oMessage.userName;
  }

  var messageContainer = createElement(
    "div",
    "message" + (isMe ? " mine" : "")
  );
  var userName = createElement(
    "h4",
    "username" + (errorSend ? " errorSend" : "")
  );
  userName.innerText = oMessage.usernickname;
  var msg = createElement("p");
  msg.innerText = oMessage.text?oMessage.text:"No messege here (ツ)_/¯ ";
  var timestmp = createElement("p");
  timestmp.innerText = oMessage.time;

  appendChild(messageContainer, [userName, msg, timestmp]);
  return messageContainer;
}