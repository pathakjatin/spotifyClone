console.log("Welcome to Spotify clone by Jatin Pathak");
let currSong = new Audio();
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
const playMusic = (track) =>{
    // var audio = new Audio("./songs/" + track);
    currSong.src = "./songs/" + track;
    currSong.play();
}
async function main(){

    let songs = await getSongs();
    console.log(songs);
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
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    //event listener for next and previous
    play.addEventListener("click", ()=>{
        if(currSong.paused){
            currSong.play();
            play.src = "play.svg"
        }else{
            currSong.pause();
            play.src = "pause.svg";
        }
    })
}
main();