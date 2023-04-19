/**
 * every page needs to refer to this js-file 
 */
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
        .then((reg)=>{console.log("SW registered", reg)})
        .catch((error)=>{console.warn("SW not registered", error)});
}
const app = new myApp();

class myApp{

    constructor() {
        this.initAllEventListener();
        this.initBaseVariables();
        loginpage = pageLogin(this.getEmptyBody(), undefined);
        document.appendChild(loginpage[0], loginpage[1]);
    }

    initAllEventListener() {
        document.body.addEventListener('spaContentLoaded', this.updateApp);
        
    }

    initBaseVariables(){
        let body = document.body;
    }

    updateApp(){
        
    }

    getEmptyBody(){
        let content = document.querySelector(".contentContainer");
        let menu = document.querySelector(".menu");

        if(!this.loggedIn()){
            menu.remove();
        }

        content.innerHTML = null;
        return content;
    }
}