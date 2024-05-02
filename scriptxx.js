const player_config = {};

/**
 * We use a global config for the audio player. There is only a single
 * <audio> object, but it could be played from multiple play links. A page
 * may have optionally have a master play button, now-playing label, and progress bar.
 * 
 * This is to offer the convenience of displaying a simple play icon on any page,
 * with no controls other than play/pause and no other change in state or progress.
 * 
 * Sorry, only one master and progress bar per page is supported. 
 * 
 * 
 */
function initPlayer() {
    console.log('initPlayer');
    
    player_config.audio = document.getElementById("audio");
    player_config.audio.pause();
    player_config.audio.addEventListener("timeupdate", trackTimeChanged, false);
    player_config.audio.addEventListener("ended", function (e) {
        trackHasEnded();
    }, false);

    player_config.play_master = document.getElementById("play_master");
    player_config.play_label = document.getElementById("play_label");
    player_config.progress = document.getElementById("pp");
    player_config.buffer = document.getElementById("pp2");
    player_config.now_playing = null;
    player_config.progress_label = document.getElementById("pp_label");
    if( player_config.progress ) {
        player_config.progress.onclick = function (event) { player_seek(event); };
    }
}

function bufferProgress() {
    if (player_config.progress) {
        if (player_config.audio.buffered.end.length > 0) {
            var bufferedTime = (player_config.audio.buffered.end(0) * 100) / player_config.audio.duration;
            player_config.buffer.value = bufferedTime;
        } else {
            player_config.buffer.value = 100;
        }
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
    console.log(songURL);
    player_config.audio.setAttribute("src", songURL);
    player_config.audio.load();
    if( player_config.progress ) {
        player_config.progress.value = 0;
        player_config.buffer.value = 0;
    }
    player_config.audio.play();


}

function togglePlay(song) {

    if (!player_config.audio) {
        console.log('togglePlay init');
        initPlayer();
    }
    if (player_config.now_playing) {
        if (player_config.now_playing === song) {
            // if playing, pause it, otherwise start it
            if (player_config.audio.paused) {
                if( player_config.play_master) {
                    player_config.play_master.classList.add('gv_icon_pause');
                }
                song.classList.add('gv_icon_pause');
                player_config.audio.play();
            } else {
                if( player_config.play_master) {
                    player_config.play_master.classList.remove('gv_icon_pause');
                }
                song.classList.remove('gv_icon_pause');
                player_config.audio.pause();
            }
        } else {
            // different song

            // toggle current playing song icon to "play" from "pause"
            player_config.now_playing.classList.remove("gv_icon_pause");

            // establish new song as now playing and toggle its icon
            song.classList.add("gv_icon_pause");
            player_config.audio.setAttribute("src", song.getAttribute("data-song"));
            player_config.audio.load();
            if( player_config.progress ) {
                player_config.progress.value = 0;
                player_config.buffer.value = 0;
            }
            player_config.audio.play();
            if( player_config.play_master) {
                player_config.play_master.classList.add('gv_icon_pause');
            }
            console.log('grrr');
            const lbl = song.parentNode.parentNode.getElementsByClassName("demoTitle");
            if( player_config.play_label ) {
                player_config.play_label.innerHTML = lbl[0].textContent;
            }
            const to_move = document.getElementById("progress_top");
            console.log(to_move);

            // set background color
            song.parentNode.parentNode.classList.add("playlist_playing");
            player_config.now_playing.parentNode.parentNode.classList.remove("playlist_playing");
            player_config.now_playing = song;
            //const move_to = song.parentNode.parentNode.getElementsByClassName("demoTitle")[0].appendChild(to_move);

        }
    } else {
        // no song played yet - crank it up
        player_config.audio.setAttribute("src", song.getAttribute("data-song"));
        player_config.audio.load();
        player_config.audio.play();
        song.parentNode.parentNode.classList.add("playlist_playing");
        player_config.now_playing = song;
        song.classList.add("gv_icon_pause");
        if( player_config.progress ) {
            player_config.progress.value = 0;
            player_config.buffer.value = 0;
        }
        if( player_config.play_master ) {
            player_config.play_master.classList.add('gv_icon_pause');
        }
        console.log('brrr');
        console.log(song.parentNode.parentNode);
        const lbl = song.parentNode.parentNode.getElementsByClassName("demoTitle");
        if( lbl && player_config.play_label) {
            player_config.play_label.innerHTML = lbl[0].textContent;
        }
        const to_move = document.getElementById("progress_top");
        console.log(to_move);
        //const move_to = song.parentNode.parentNode.getElementsByClassName("demoTitle")[0].appendChild(to_move);
    }


}

function togglePlaying(control) {
    if (!player_config.audio) {
        console.log('togglePlay init');
        initPlayer();
    }
    let icon = player_config.play_master;
    if (!icon) {
        icon = control;
    }
    if (player_config.now_playing) {
        // if playing, pause it, otherwise start it
        if (player_config.audio.paused) {
            if( player_config.play_master) {
                player_config.play_master.classList.add('gv_icon_pause');
            }
            icon.classList.add('gv_icon_pause');
            player_config.now_playing.classList.add('gv_icon_pause');
            player_config.audio.play();
        } else {
            if( player_config.play_master) {
                player_config.play_master.classList.remove('gv_icon_pause');
            }
            icon.classList.remove('gv_icon_pause');
            player_config.now_playing.classList.remove('gv_icon_pause');
            player_config.audio.pause();
        }

    }

}


function trackTimeChanged() {
    if (player_config.progress) {
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
}
function trackHasEnded(e) {
    if (player_config.now_playing) {
        // if playing, pause it, otherwise start it
        if( player_config.play_master) {
            player_config.play_master.classList.remove('gv_icon_pause');
        }
        player_config.now_playing.classList.remove('gv_icon_pause');
    }
    if( player_config.progress ) {
        player_config.progress.value = 0;
    }
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

async function loadPage(xpath) {
    if (xpath == "") return;

    const container = document.getElementById("container");
    const aside = document.getElementById("aside");

    let x = await fetch("pages/" + xpath + ".html");
    let y = await x.text();
    let xx = await fetch("pages/" + xpath + "-side.html");
    let yy = await xx.text();

    container.innerHTML = y;
    aside.innerHTML = yy;

    initPlayer();
    // if (xpath == "listen") {
    //     initPlayer();
    // }
}


history.replaceState({ ick: "home" }, "");



