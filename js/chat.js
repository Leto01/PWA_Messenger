import { fetchmessage, logout, sendmessage } from "./chat.service.js";
import { deleteCookie, getCookie } from "./cookie.service.js";
import {
  ENUM_SET,
  appendChild,
  createButton,
  createElement,
  createHeadder,
  getEmptyContent,
} from "./helper.js";

var rerender = () => {
  console.warn("no rerender method set");
};

const testMyHash = getCookie(ENUM_SET.COOKIE_SET.hash);
const messageSet = { messages: [] };
var myUserName = "";
var chatId = 0;
var errorSend = false;
const d = new Date();

export function loadChatPage(callback) {
  rerender = callback;
  var c = getEmptyContent(".contentContainer");
  var messageBox = getChatMessageBox();
  var messageView = getMessageView();

  var headercontent = initHeader();
  var header = createHeadder(headercontent);
  appendChild(c, [header, messageView, messageBox]);
}

function scrollDown() {
  const element = document.getElementsByClassName("messageview")[0];
  console.log(element.scrollTop);
  element.scrollTop = element.scrollHeight;
  console.log(element.scrollTop);
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
  const token = getCookie(ENUM_SET.COOKIE_SET.token);
  logout(token)
    .then(() => {
      deleteCookie(ENUM_SET.COOKIE_SET.hash);
      deleteCookie(ENUM_SET.COOKIE_SET.token)
      rerender(ENUM_SET.STATES.Login, undefined);
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
                time: formatTime(),
                chatid: chatId,
              };
              messageInput.value = "";
              messageSet.messages.push(msgObj);
              appendNewSendMessage(msgObj);
            })
            .catch(console.error)
        )
        .catch(console.error); // save request and resend later
    }
  });
  appendChild(form, [messageInput, sendBtn]);
  return form;
}

function formatTime(time) {
  if (time === undefined) {
    var h = d.getHours();
    var m = d.getMinutes();
    return "today: " + (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }

}

function appendNewSendMessage(msg) {
  const div = document.getElementsByClassName("messageview");
  appendChild(div[0], [displayMessage(msg)]);
  scrollDown();
}

function getMessageView() {
  var messageViewDiv = createElement("div", "messageview");

  fetchmessage(getCookie(ENUM_SET.COOKIE_SET.token))
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
        })
    )
    .catch(console.warn);

  return messageViewDiv;
}

function displayMessage(oMessage) {
  var isMe = oMessage.userhash === testMyHash;
  chatId = oMessage.chatId;
  if (isMe) {
    myUserName = oMessage.usernickname;
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
  msg.innerText = oMessage.text ? oMessage.text : "No messege here (ツ)_/¯ ";
  var timestmp = createElement("p");
  timestmp.innerText = oMessage.time;

  appendChild(messageContainer, [userName, msg, timestmp]);
  return messageContainer;
}
