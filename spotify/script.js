console.log("Welcome to Spotify clone by Jatin Pathak");
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
async function main(){
    let songs = await getSongs();
    console.log(songs);
    let songList = document.querySelector(".songList").getElementsByTagName("ol")[0];
    for (const song of songs) {
        songList.innerHTML = songList.innerHTML + `<li> ${song.replaceAll("%20", " ")}</li>`;
    }
    //play the first song
    var audio = new Audio(songs[0]);
    //audio.play();
    audio.addEventListener("loadeddata", () =>{
        //let duration = audio.duration;
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    })
}
main();