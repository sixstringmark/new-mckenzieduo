const player_config = {};

function initPlayer() {
    console.log('initPlayer');
    player_config.audio = document.getElementById("audio");
    player_config.progress = document.getElementById("pp");
    player_config.buffer = document.getElementById("pp2");
    player_config.progress_label = document.getElementById("pp_label");
    player_config.progress.onclick = function (event) { player_seek(event); };
    player_config.audio.addEventListener("timeupdate", trackTimeChanged, false);
    player_config.audio.addEventListener("ended", function (e) {
        trackHasEnded();
    }, false);
}

function bufferProgress() {
    if (player_config.audio.buffered.end.length > 0) {
        var bufferedTime = (player_config.audio.buffered.end(0) * 100) / player_config.audio.duration;
        player_config.buffer.value = bufferedTime;
    } else {
        player_config.buffer.value = 100;
    }
};

function player_seek(event) {
    //console.log("bang"); 
    //console.log(event);
    let box = event.srcElement;
    let rect = event.srcElement.getBoundingClientRect();
    var pg = rect.x + rect.width - event.clientX;
    var pct = 100.0 - (100.0 * pg / rect.width);
    var duration = player_config.audio.duration;
    var target_time = duration * pct / 100.0;
    player_config.audio.currentTime = target_time;
    box.value = pct;
}

function playMe(songURL) {
    if (!player_config.audio) {
        console.log('playMe init');
        initPlayer();
    }
    player_config.audio.setAttribute("src", songURL);
    player_config.audio.load();
    player_config.progress.value = 0;
    player_config.buffer.value = 0;
    player_config.audio.play();

}
function trackTimeChanged() {
    var currentTime = audio.currentTime;
    var duration = audio.duration;
    var p_duration = secondsToHHMMSS(duration);
    var p_currentTime = secondsToHHMMSS(currentTime);
    player_config.progress_label.innerHTML = p_currentTime + " / " + p_duration;
    //console.log(player_config.progress_label.innerHTML);
    //document.getElementById("progress_label").innerHTML = "whatever";

    if (duration && duration > 0) {
        var pct = 100 * currentTime / duration;
        player_config.progress.value = pct;
    }
    bufferProgress();
}
function trackHasEnded(e) {
    console.log(e);
    player_config.progress.value = 0;
}
function setProgress(p) {
    console.log("progress");
    console.log(p);
}





window.onload = function () {
    const path = window.location.pathname.split("/");
    //console.log('bully')
    switch (path[1]) {
        case "": case "home":
            {
                loadPage("home");
                break;
            }
        case "about":
            {
                loadPage("about");
                break;
            }
        case "listen":
            {
                loadPage("listen");
                break;
            }
        case "contact":
            {
                loadPage("contact");
                break;
            }
        case "contactsent":
            {
                loadPage("contactsent");
                break;
            }
        case "endorsements":
            {
                loadPage("endorsements");
                break;
            }
        case "songlist":
            {
                loadPage("songlist");
                break;
            }
        case "contact":
            {
                loadPage("contact");
                break;
            }

        default:
            {
                loadPage("404");
                break;
            }
    }

    document.querySelectorAll(".menu__item").forEach((item) => {
        item.addEventListener("click", function () {
            const path = item.getAttribute("value");
            //console.log("path", path);
            loadPage(path);
            if (path == "home") {
                window.history.pushState({ ick: "" }, "", "/");
                return;
            }
            //console.log("pushing " + path);
            window.history.pushState({ ick: path }, "", path);
        });
    });

    async function loadPage(xpath) {
        if (xpath == "") return;

        const container = document.getElementById("container");

        let x = await fetch("pages/" + xpath + ".html");
        let y = await x.text();
        container.innerHTML = y;

        if (xpath == "listen") {
            initPlayer();
        }
    }

    // Handle forward/back buttons
    window.addEventListener("popstate", (event) => {
        // If a state has been provided, we have a "simulated" page
        // and we update the current page.
        if (event) {
            const state = event.state;
            if (state.ick) {
                loadPage(state.ick);
            }
            // Simulate the loading of the previous page
            //console.log("event.state", event);
        }
    });

}

function secondsToHHMMSS(psec) {
    let seconds = Math.floor(psec);
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    seconds = Math.floor(seconds);
    let timeString = "";
    if (hours == 0) {
        timeString =
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');
    } else {
        timeString = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');
    }
    return timeString;
}


history.replaceState({ ick: "home" }, "");



