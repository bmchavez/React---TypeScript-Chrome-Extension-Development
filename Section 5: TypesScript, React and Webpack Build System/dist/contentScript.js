console.log("Content Script is running!"),chrome.runtime.sendMessage("Hello from the Content Script!",(e=>{console.log(e)}));