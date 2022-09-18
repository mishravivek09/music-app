let songsArray = [];
let songsPoster = [];
let songsName = [];
let songsData = () => {
  let url = "https://music-api-vivek.herokuapp.com/api/v1/master";
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      fetchData(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
songsData();

let songsList = [];

let fetchData = (data) => {
  data.forEach((elem) => {
    songsArray.push(elem.url);
    songsName.push(elem.name);
    songsPoster.push(elem.imgUrl);
    let data = { elem };
    songsList.push(data);
  });
};

let track = document.createElement("audio");
let flag = false;
let index = 0;
let Name = document.querySelector("#names");
let display = document.querySelector("#spin");
let Shuffle = false;

let shuff = document.querySelector("#shuffle");
let curr_time = document.querySelector("#time1");
let total_duration = document.querySelector("#time2");
let updateTimer;
let volume_slider = document.querySelector("#volume");
let seek_slider = document.querySelector("#slider");
let gif = document.querySelector("#gif");

document.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    playPause();
  }
});

let masterPlay = (index) => {
  clearInterval(updateTimer);
  track.src = songsArray[index];
  track.load();
  updateTimer = setInterval(seekUpdate, 1000);
  track.addEventListener("ended", function () {
    nextPlay();
  });
  Name.innerHTML = songsName[index];
  display.src = songsPoster[index];
};
setTimeout((t) => {
  masterPlay(index);
}, 1000);
let playPause = () => {
  if (!flag) {
    Play();
    spin.style.animation = "rotation 8s infinite linear";
    gif.style.opacity = 1;
  } else {
    Pause();
    spin.style.animation = false;
    gif.style.opacity = 0;
  }
};
let Play = () => {
  track.play();
  let icons = document.querySelector("#play");
  icons.innerHTML = null;
  icons.src = "circle-pause-solid.svg";
  flag = true;
};

let Pause = () => {
  track.pause();
  let icons = document.querySelector("#play");
  icons.innerHTML = null;
  icons.src = "circle-play-solid.svg";
  flag = false;
};
let prevPlay = () => {
  if (index > 0) {
    index--;
  } else {
    index = songsName.length - 1;
  }
  masterPlay(index);
  Play();
  spin.style.animation = "rotation 8s infinite linear";
  gif.style.opacity = 1;
};
let nextPlay = () => {
  if (index < songsName.length - 1) {
    index++;
  } else {
    index = 0;
  }
  masterPlay(index);
  Play();
  spin.style.animation = "rotation 8s infinite linear";
  gif.style.opacity = 1;
};
function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(track.duration)) {
    seekPosition = track.currentTime * (100 / track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(track.currentTime / 60);
    let currentSeconds = Math.floor(track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(track.duration / 60);
    let durationSeconds = Math.floor(track.duration - durationMinutes * 60);

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    curr_time.innerHTML = currentMinutes + ":" + currentSeconds;
    total_duration.innerHTML = durationMinutes + ":" + durationSeconds;
  }
}
function seekTo() {
  let seekto = track.duration * (seek_slider.value / 100);
  track.currentTime = seekto;
}

function setVolume() {
  track.volume = volume_slider.value / 100;
}

document.querySelector("#muted").addEventListener("click", function () {
  if (track.muted) {
    track.muted = false;
    document.querySelector("#muted").src = "volume.png";
  } else {
    track.muted = true;
    document.querySelector("#muted").src = "mute.png";
  }
});
let getList = () => {
  document.querySelector("#container").style.display = "none";
  let container = document.querySelector("#lists");
  container.innerHTML = "";
  container.style.display = "block";
  container.style.overflow = "scroll";
  container.style.borderRadius = 0;
  let cdiv = document.createElement("div");
  let h4 = document.createElement("h4");
  h4.innerText = "All Songs";
  cdiv.setAttribute("class", "back");
  let image = document.createElement("img");
  image.setAttribute("class", "backBtn");
  image.src = "back.png";
  image.addEventListener("click", function () {
    previous();
  });
  cdiv.append(image, h4);
  container.append(cdiv);
  songsList.forEach((elem) => {
    let div = document.createElement("div");
    div.setAttribute("id", "List");
    let cdiv = document.createElement("div");
    let image = document.createElement("img");
    let p = document.createElement("p");
    p.innerText = elem.elem.name;
    image.src = elem.elem.imgUrl;
    div.addEventListener("click", function () {
      userPlayed(elem);
    });
    cdiv.append(image, p);
    div.append(cdiv);
    container.append(div);
  });
};
let userPlayed = (elem) => {
  track.src = elem.elem.url;
  Play();
  Name.innerHTML = elem.elem.name;
  display.src = elem.elem.imgUrl;
  document.querySelector("#container").style.display = "grid";
  document.querySelector("#lists").style.display = "none";
  spin.style.animation = "rotation 8s infinite linear";
  gif.style.opacity = 1;
};

let previous = () => {
  document.querySelector("#container").style.display = "grid";
  document.querySelector("#lists").style.display = "none";
};
