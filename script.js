window.onload = function () {
    const path = window.location.pathname.split("/");
    console.log('bully')
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
            console.log("path",path);
            loadPage(path);
            if (path == "home") {
                window.history.pushState({ick:""}, "", "/");
                return;
            }
            console.log("pushing " + path);
            window.history.pushState({ick:path}, "", path);
        });
    });

    function loadPage($path) {
        if ($path == "") return;

        const container = document.getElementById("container");
        console.log("get " + $path);
        const request = new XMLHttpRequest();
        request.open("GET", "pages/" + $path + ".html");
        request.send();
        request.onload = function () {
            if (request.status == 200) {
                container.innerHTML = request.responseText;
                document.title = $path;
            }
        }
    }

    // Handle forward/back buttons
window.addEventListener("popstate", (event) => {
    // If a state has been provided, we have a "simulated" page
    // and we update the current page.
    if (event) {
        const state = event.state;
        if(state.ick) {
            loadPage(state.ick);
        }
      // Simulate the loading of the previous page
      console.log("event.state", event);
    }
  });

}


  history.replaceState({ick:"home"}, "");