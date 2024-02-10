console.log("Welcome to Spotify clone by Jatin Pathak");
let currSong = new Audio();
let songs;
let currFolder;
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
        
async function getSongs(folder) {
    try {
        currFolder = folder;
        //let response = await fetch(`http://127.0.0.1:5500/spotify/songs/${folder}/`);
        let response = await fetch(`http://127.0.0.1:5500/spotify/songs/${folder}/`);
        
        // Check if the response status is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
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
        songs = [];
        for(let i=0; i<as.length; i++){
            const elem = as[i];
            if(elem.href.endsWith(".mp3")){
                songs.push(elem.href.split(`/${folder}/`)[1]);
            }
        }
        
    } catch (error) {
        console.error("An error occurred:", error);
    }
    //play first song

    let songList = document.querySelector(".songList").getElementsByTagName("ol")[0];
    songList.innerHTML = ""
    for (const song of songs) {
        songList.innerHTML += `<li> 
                            <img class="pointer" src="/spotify/images/note.svg" alt="" srcset="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Jatin</div>
                            </div>
                            <img class="invert pointer" src="/spotify/images/play.svg" alt="" srcset="">
        </li>`;
    }
    //event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    return songs
}
const playMusic = (track, pause=false) =>{
    // var audio = new Audio("./songs/" + track);
    currSong.src = `/spotify/songs/${currFolder}/` + track;
    if(!pause){
        currSong.play();
        play.src = "/spotify/images/pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track) ;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}
async function displayAlbums(){
    // display all the albums on the page 
    try{
        let response = await fetch(`http://127.0.0.1:5500/spotify/songs/`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        } 
        let htmlData = await response.text();
        // console.log(htmlData)
        let div = document.createElement("div");
        div.innerHTML = htmlData; 
        // console.log(div) 
        let anchors = div.getElementsByTagName('a') 
        // console.log(anchors)
        let folders =[]
        let array = Array.from(anchors)
            // console.log(e.href)
            for(let idx=0; idx<array.length ; idx++){
                const e = array[idx]
            if (e.href.includes("/songs/")) {
                let folder = (e.href.split("/").slice(-1)[0]);
                //get metadata
                let cardContainer = document.querySelector(".cardContainer")
                async function fetchData() {
                    try {
                        let response = await fetch(`http://127.0.0.1:5500/spotify/songs/${folder}/info.json`);
                        let data = await response.json();
                        // console.log(data);
                        cardContainer.innerHTML = cardContainer.innerHTML + `
                        <div class="card border-radius pointer" data-folder="${folder}">
                        <div class="play-button">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#1FDF64" xmlns="http://www.w3.org/2000/svg" class="injected-svg" data-src="/icons/play-circle-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
            <circle cx="12" cy="12" r="10" stroke="#000000" stroke-width="1.5"></circle>
            <path d="M9.5 16V8L16 12L9.5 16Z" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"></path>
        </svg>
                        </div>
                        <img class="border-radius" src="/spotify/songs/${folder}/cover.jpg" alt="" srcset="">
                        <h2>${data.title}</h2>
                        <p>${data.description}</p>
                    </div>
                        `

                    } catch (error) {
                        console.error("An error occurred:", error);
                    }
                }

                fetchData(); // Call the asynchronous function to execute it
                
                document.querySelector(".cardContainer").addEventListener("click", async (event) => {
                    const card = event.target.closest(".card");
                    if (card) {
                        const folder = card.dataset.folder;
                        // Perform actions based on the clicked card
                        songs = await getSongs(folder);
                        playMusic(songs[0])
                    }
                });
            }

        }
    } catch(error){
        console.error("An error occurred:", error);
    }
    // Array.from(document.querySelector(".cardContainer")).forEach(e=>{
    //     e.addEventListener("click",async item=>{
    //         // console.log(item.target , item.currentTarget.dataset)
    //         songs = await getSongs(`${item.currentTarget.dataset.folder}`);
    //     })
    // })

    
}
async function main(){

    await getSongs("heramb");
    // console.log(songs)
    playMusic(songs[0], true)
    displayAlbums()
    //event listener for next and previous
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
    play.addEventListener("click", () => {
        if (currSong.paused) {
            currSong.play();
            play.src = "/spotify/images/pause.svg"; // Change the src to pause.svg when playing
        } else {
            currSong.pause();
            play.src = "/spotify/images/play.svg"; // Change the src to play.svg when paused
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

    document.querySelector("#volume").addEventListener("change", (e)=>{
        currSong.volume = parseInt(e.target.value)/100
    })
// mute
    // document.querySelector(".volume > img").addEventListener("click",(e)=>{
    //     // console.log(e.target)
    //     // console.log("muted")
    //     if(e.currentTarget.src == ("./images/volume.svg")){
    //         // e.target.src = e.target.src.replace("./images/volume.svg","./images/mute.svg")
    //         e.currentTarget.src = "./images/mute.svg";
    //         console.log("change to mute")
    //         currSong.volume = 0;
    //     } else{
    //         //e.target.src = e.target.src.replace("./images/mute.svg","./images/volume.svg")
    //         e.currentTarget.src = "./images/volume.svg";
    //         console.log("change to volume")
    //         currSong.volume = 0.1;
    //     }
    // })
    document.querySelector(".volume > img").addEventListener("click", (e) => {
        // Get the src attribute of the <img> element
        let src = e.currentTarget.getAttribute("src");
    
        if (src === "/spotify/images/volume.svg") {
            e.currentTarget.src = "/spotify/images/mute.svg";
            currSong.volume = 0;
            document.querySelector("#volume").value=0
        } else {
            e.currentTarget.src = "/spotify/images/volume.svg";
            currSong.volume = 0.10;
            document.querySelector("#volume").value=10
        }
    });
    
}
main();