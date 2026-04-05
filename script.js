let currentsong = new Audio();
let songs=[];


const playmusic = (track) => {
    currentsong.src = "/songs/" + track
    currentsong.play()
    play.src = "images/pause.svg"

}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/%5Csongs%5C")[1])
        }
        // 
    }
    return songs
}

getsongs()


async function main() {
    songs = await getsongs()
    let songUl = document.getElementById('songs').getElementsByTagName('ul')[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
        <img class="invert" src="images/song.svg" alt="">
        <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
        <div>Artist_Name Varun</div>
        </div>
        <img src="images/play.svg" alt=""></li>`;
    }

    Array.from(document.querySelector("#songs").getElementsByTagName("li")).forEach(e => {
        console.log(e)
        e.addEventListener("click", element => {
            play.src = "images/pause.svg"
            document.querySelector(".songinfo").innerHTML = e.querySelector(".info").firstElementChild.innerHTML.trim()
            document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    let play = document.querySelector("#playss")

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "images/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "images/play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().widht) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })
    previes.addEventListener("click", () => {
        let current = currentsong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(current);

        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let current = currentsong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(current);

        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume = parseInt(e.target.value)/100
    })


}


main();