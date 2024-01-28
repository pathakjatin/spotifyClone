console.log("Welcome to Spotify clone by Jatin Pathak");
let currSong = new Audio();
let songs;
//CAUSING ERROR AS THE FETCHED DATA IS IN HTML FORMAT AND NOT JSON
        // const songsurl = "http://127.0.0.1:5500/spotify/songs/";
        // async function main(){
        //     let response = await fetch("http://127.0.0.1:5500/spotify/songs/");
        //     console.log("getting data...");
        //     let data = await response;
        //     console.log(data);
        //     console.log("Content-Type:", response.headers.get('Content-Type'));

        // }
        // main()
        function formatTime(seconds) {
            // Get the whole minutes and remaining seconds
            var minutes = Math.floor(seconds / 60);
            var remainingSeconds = Math.floor(seconds % 60);
        
            // Add leading zeros if necessary
            var formattedMinutes = (minutes < 10) ? "0" + minutes : minutes;
            var formattedSeconds = (remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds;
        
            // Concatenate minutes and seconds with ":"
            return formattedMinutes + ":" + formattedSeconds;
        }
        
        // Example usage:
        //console.log(formatTime(62));  Output: "01:02"
        //console.log(formatTime(127));  Output: "02:07"
        
async function getSongs() {
    try {
        let response = await fetch("http://127.0.0.1:5500/spotify/songs/");

        // Check if the response status is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Getting data...");

        // Log the raw response to inspect the data
        // console.log("Raw response:", response);

        // Assuming the response is HTML, you can use text() instead of json()
        let htmlData = await response.text();
        // console.log("HTML data:", htmlData);

        // Create a div and set its innerHTML to the HTML content
        let div = document.createElement("div");
        div.innerHTML = htmlData;

        // Now you can work with the HTML content as needed
        let as = div.getElementsByTagName('a');
        // console.log(as);
        let songs = [];
        for(let i=0; i<as.length; i++){
            const elem = as[i];
            if(elem.href.endsWith(".mp3")){
                songs.push(elem.href.split("/songs/")[1]);
            }
        }
        return songs;
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
const playMusic = (track, pause=false) =>{
    // var audio = new Audio("./songs/" + track);
    currSong.src = "./songs/" + track;
    if(!pause){
        currSong.play();
        play.src = "./images/pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track) ;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}
async function main(){

    songs = await getSongs();
    console.log(songs);
    playMusic(songs[0], true)
    let songList = document.querySelector(".songList").getElementsByTagName("ol")[0];
    for (const song of songs) {
        songList.innerHTML += `<li> 
                            <img class="pointer" src="./images/note.svg" alt="" srcset="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Jatin</div>
                            </div>
                            <img class="invert pointer" src="./images/play.svg" alt="" srcset="">
        </li>`;
    }
    //event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    //event listener for next and previous
    play.addEventListener("click", () => {
        if (currSong.paused) {
            currSong.play();
            play.src = "./images/pause.svg"; // Change the src to pause.svg when playing
        } else {
            currSong.pause();
            play.src = "./images/play.svg"; // Change the src to play.svg when paused
        }
    });
    currSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songTime").innerHTML = `${formatTime(currSong.currentTime)} / ${formatTime(currSong.duration)}`
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currSong.currentTime = ((currSong.duration) * percent)/100;
    })
    let hamburger = document.querySelector(".hamburger")
    hamburger.addEventListener("click", ()=>{
        document.querySelector(".left").style.left = 0;
        // hamburger.src = "./images/cross.svg"
        // hamburger.addEventListener("click",()=>{
        //     document.querySelector(".left").style.left = -100 +"%"
        //     hamburger.src = "./images/hamburger.svg"
        // })
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = -100 +"%"
    })
    document.querySelector("#previous").addEventListener("click",()=>{
        let idx = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        if((idx-1) >= 0){
            playMusic(songs[idx-1])
        }
    })
    document.querySelector("#next").addEventListener("click",()=>{
        currSong.pause()
        let idx = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        if((idx+1) < songs.length ){
            playMusic(songs[idx+1])
        }
    })
}
main();