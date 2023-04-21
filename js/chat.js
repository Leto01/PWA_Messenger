import { appendChild, createElement, makeInput } from "./helper";

var rerender = () => {console.warn("no rerender method set")};

export function loadChatPage(callback){
  rerender = callback;
  var c = getEmptyContent(".contentContainer");
  var messageBox = getChatMessageBox();
  var messageView = getMessageView();
  appendChild(c, [messageView, messageBox]);
}

function getChatMessageBox(){
  var form = createElement("form", "messageBox");
  var messageInput = makeInput()

  return from;
}

function getMessageView(){
  var messageViewDiv = createElement("div", "messageview");

  return messageViewDiv
}