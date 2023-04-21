import { getEmptyContent, appendChild, createElement, makeInput, createButton } from "./helper.js";



    var rerender = () => {console.warn("no rerender method set")};

  
    export function loadRegisterPage(callback){
        rerender = callback
        var c = getEmptyContent(".contentContainer");
        
        var feeldSet = getFeeldSet();
        appendChild(c, [feeldSet]);
    }

    function getFeeldSet(){
        var form = createElement("form", "content register");
        var div = createElement("div", "inputfield");
        var h3Title = createElement("h3", "title_h3");
        h3Title.innerText = "Register here";
        appendChild(form, [h3Title, div]);

        const inputName = makeInput("text", "userId" , "HS-ID (=8 Char)", 8); 
        const inputFullName = makeInput("text", "fullName", "Full Name", 1); 
        const inputNickName = makeInput("text", "nickname", "Nickname", 1); 
        const brk = createElement("br");
        const inputPassword = makeInput("password", "password", "Password (>5 Char)", 5);
        const inputPasswordRepeat = makeInput("password", "password", "Repeat Password", 5)
        appendChild(div, [inputName, inputFullName, inputNickName, inputPassword, inputPasswordRepeat]);
    
        var divButton = createElement("div", "submitbutton");
        var btn = createButton("btn", "register", "REGISTER");
        var returnToLogin = createButton("btn", "return", "RETURN TO LOGIN");
        returnToLogin.addEventListener("click", ()=>{rerender(1, undefined)}, false);

        btn.setAttribute("disabled", "");
        
        const btnEnabler = ()=>{
            btn.disabled = !inputName.reportValidity() || !inputPassword.reportValidity() || (inputPassword.value !== inputPasswordRepeat.value);
        };
    
        form.addEventListener("input", btnEnabler);
        
        btn.addEventListener("click", ()=>{
          pageRegisterSent(inputName.value, inputPassword.value);
        }); 

        appendChild(divButton, [btn, returnToLogin])
        appendChild(form, [divButton]);
        return form;
    }

    function pageRegisterSent(name, pw){
        rerender(1, "no registration possible nobhead");
    }
