import { appendChild, createButton, createElement, createHeadder, getEmptyContent } from "./helper.js";

var rerender = () => {console.warn("no rerender method set")};

const testMyHash = "m";

export function loadChatPage(callback){
  rerender = callback;
  var c = getEmptyContent(".contentContainer");
  var messageBox = getChatMessageBox();
  var messageView = getMessageView();
  var headercontent = initHeader();
  var header = createHeadder(headercontent)
  appendChild(c, [header, messageView, messageBox]);
}

function initHeader(){
  var div = createElement("div", "chatHeaderDiv");
  var title = createElement("h1");
  title.innerText = "P-WAM";
  var clickLogout = createElement("div", "logoutButton")
  var logoutIco = createElement("img", "logout");

  logoutIco.setAttribute("src", "../assets/logout.svg");
  logoutIco.setAttribute("alt", "Logout button");

  clickLogout.addEventListener("click", logout);

  appendChild(clickLogout, [logoutIco]);
  appendChild(div, [title, clickLogout])

  return div;
}

function logout(){
  rerender(1, undefined);
}

function getChatMessageBox(){
  var form = createElement("form", "messageBox");
  var messageInput = createElement("input");
  var sendBtn = createButton("btn", "sendbutton", "SEND")
  appendChild(form, [messageInput, sendBtn]);
  return form;
}

function getMessageView(){
  var messageViewDiv = createElement("div", "messageview");
  
  var messageStack = testMessages.messages;
  messageStack.forEach( m => {
    appendChild(messageViewDiv, [displayMessage(m)])    
  });

  return messageViewDiv
}

function displayMessage (oMessage){
  var isMe = oMessage.userhash === testMyHash;

  var messageContainer = createElement("div", `message ${isMe ? "mine":undefined}` );
  var userName = createElement("h4", "username")
  userName.innerText = oMessage.usernickname;
  var msg = createElement("p");
  msg.innerText = oMessage.message;
  var timestmp = createElement("p");
  timestmp.innerText= oMessage.time
  
  appendChild(messageContainer, [userName, msg, timestmp])
  return messageContainer;

}

const testMessages = {
  "messages": [
    {
      "id": 12,
      "userhash":"o",
      "usernickname": "Other",
      "message": " i am a beautyful message! :D",
      "time" : "15 Apr. 2023 09.23",
      "chatid": 69
    },
    {
      "id": 12,
      "userhash":"o",
      "usernickname": "Other",
      "message": " i am a beautyful message! :D",
      "time" : "15 Apr. 2023 09.23",
      "chatid": 69
    },
    {
      "id": 12,
      "userhash":"o",
      "usernickname": "Other",
      "message": " i am a beautyful message! :D",
      "time" : "15 Apr. 2023 09.23",
      "chatid": 69
    },
    {
      "id": 12,
      "userhash":"m",
      "usernickname": "leziit00",
      "message": " i am a beautyful message! :D",
      "time" : "15 Apr. 2023 09.23",
      "chatid": 69
    },
    {
      "id": 12,
      "userhash":"o",
      "usernickname": "Other",
      "message": " i am a beautyful message! :D",
      "time" : "15 Apr. 2023 09.23",
      "chatid": 69
    },
    {
      "id": 12,
      "userhash":"o",
      "usernickname": "Other",
      "message": " i am a beautyful message! :D",
      "time" : "15 Apr. 2023 09.23",
      "chatid": 69
    }
  ]
}