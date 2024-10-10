import {default as listAudio} from './tracklist.js';

const currentAudio = document.getElementById("audio");
let indexAudio = 0;
const timer = document.getElementsByClassName('timer')[0]
const barProgress = document.getElementById("bar");
let width = 0;

// создание треклиста
function createTrackItem(index, name, duration){
  // создаем и добавляем в дерево контейнеры каждого трека в треклисте
  const trackItem = document.createElement('div');
  trackItem.setAttribute("class", "tracklist__trackContainer");
  trackItem.setAttribute("id", "track-" + index);
  trackItem.setAttribute("data-index", index);
  document.querySelector(".player__tracklist").appendChild(trackItem);

  // кнопка плей на каждом треке в треклисте
  const btnPlay = document.createElement('img');
  btnPlay.setAttribute("src", "./images/track-play.svg");
  btnPlay.setAttribute("class", "tracklist-btn-play");
  btnPlay.setAttribute("id", "btn-play-" + index);
  document.querySelector("#track-" + index).appendChild(btnPlay);

  // информация о треке в треклисте
  const trackInfoItem = document.createElement('span');
  trackInfoItem.setAttribute("class", "tracklist-info-track");
  trackInfoItem.innerHTML = name.join(' - ');
  document.querySelector("#track-" + index).appendChild(trackInfoItem);

  // продолжительность песни в треклисте
  var trackDurationItem = document.createElement('div');
  trackDurationItem.setAttribute("class", "tracklist-duration");
  trackDurationItem.innerHTML = duration;
  document.querySelector("#track-" + index).appendChild(trackDurationItem);
}

for (let i = 0; i < listAudio.length; i++) {
  createTrackItem(i, listAudio[i].name, listAudio[i].duration);
}
// clickListener();

// выбор трека для проигрывания
function loadNewTrack(index){
  const player = document.querySelector('#source-audio')
  player.src = listAudio[index].file
  document.querySelector('.artist').innerHTML = listAudio[index].name[0];
  document.querySelector('.song').innerHTML = listAudio[index].name[1];
  const currentAudio = document.getElementById("audio");
  currentAudio.load();
  toggleAudio();
  updateStylePlaylist(indexAudio, index);
  indexAudio = index;
  runningLine()
}

// клик по треку в треклисте, запуск трека
// function clickListener() {
  const playListItems = document.querySelectorAll(".tracklist__trackContainer");
  for (let i = 0; i < playListItems.length; i++){
    playListItems[i].addEventListener("click", getClickedElement.bind(this));
  }
// }

function getClickedElement(event) {
  const playListItems = document.querySelectorAll(".tracklist__trackContainer");
  for (let i = 0; i < playListItems.length; i++){
    if(playListItems[i] == event.target){
      const clickedIndex = event.target.getAttribute("data-index");
      if (clickedIndex == indexAudio) {
        toggleAudio();
      } else{
        loadNewTrack(clickedIndex);
      }
    }
  }
}

document.querySelector('#source-audio').src = listAudio[indexAudio].file;
document.querySelector('.artist').innerHTML = listAudio[indexAudio].name[0];
document.querySelector('.song').innerHTML = listAudio[indexAudio].name[1];


currentAudio.load();

document.querySelector('.btn-play').addEventListener('click', toggleAudio);

// Переключение треков
function toggleAudio() {
  if (currentAudio.paused) {
    console.log()
    document.querySelector('.btn-play').style.background = 'rgba(255, 255, 255, .15) url("./images/pause.svg") no-repeat center center';
    document.getElementById('track-' + indexAudio).classList.add("active-track");
    playToPause(indexAudio);
    currentAudio.play();
  } else {
    document.querySelector('.btn-play').style.background = 'rgba(255, 255, 255, .15) url("./images/play.svg") no-repeat 60% center';
    pauseToPlay(indexAudio);
    const playPromise = currentAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        currentAudio.pause();
      })
      .catch(error => {
        console.log(error);
      });
    }
    //  currentAudio.pause();
  }
}

// запуск таймера песни и прогрессбара
document.getElementById('audio').addEventListener('timeupdate', onTimeUpdate);

function onTimeUpdate() {
  const t = currentAudio.currentTime;
  timer.innerHTML = getMinutes(t);
  setBarProgress();
  if (currentAudio.ended) {
    document.querySelector('.btn-play').style.background = 'rgba(255, 255, 255, .15) url("./images/play.svg") no-repeat 60% center';
    pauseToPlay(indexAudio);
    if (indexAudio < listAudio.length - 1) {
      let index = parseInt(indexAudio) + 1;
      loadNewTrack(index);
    }
  }
}

function setBarProgress(){
  let progress = (currentAudio.currentTime / currentAudio.duration) * 100;
  document.getElementById("bar").style.width = progress + "%";
}

function getMinutes(t){
  let min = parseInt(parseInt(t) / 60);
  let sec = parseInt(t % 60);
  if (sec < 10) {
    sec = "0" + sec;
  }
  if (min < 10) {
    min = "0" + min;
  }
  return min + ":" + sec;
}

const progressbar = document.querySelector('#progressBar');
progressbar.addEventListener("click", seek.bind(this));

function seek(event) {
  let percent = event.offsetX / progressbar.offsetWidth;
  currentAudio.currentTime = percent * currentAudio.duration;
  barProgress.style.width = percent * 100 + "%";
}

// переключение на следующую и предыдущую песни
document.querySelector('.btn-next').addEventListener('click', next);
document.querySelector('.btn-back').addEventListener('click', previous);
function next(){
  if (indexAudio < listAudio.length - 1) {
      var oldIndex = indexAudio;
      indexAudio++;
      updateStylePlaylist(oldIndex, indexAudio);
      loadNewTrack(indexAudio);
  }
}

function previous(){
  if (indexAudio > 0) {
      let oldIndex = indexAudio;
      indexAudio--;
      updateStylePlaylist(oldIndex, indexAudio);
      loadNewTrack(indexAudio);
  }
}

function updateStylePlaylist(oldIndex, newIndex){
  document.querySelector('#track-' + oldIndex).classList.remove("active-track");
  pauseToPlay(oldIndex);
  document.querySelector('#track-' + newIndex).classList.add("active-track");
  playToPause(newIndex);
}

// Остановка и запуск трека в треклисте
function playToPause(index){
  const ele = document.querySelector("#btn-play-" + index);
  ele.setAttribute("src", "./images/track-pause.svg");
}
function pauseToPlay(index){
  const ele = document.querySelector("#btn-play-" + index);
  ele.setAttribute("src", "./images/track-play.svg");
}


// Анимация
const containerAnimation = document.querySelector('.marquee');
const textAnimation = document.querySelectorAll('.marquee span');

function runningLine(){
  textAnimation.forEach(item => {
    if (item.offsetWidth >= containerAnimation.offsetWidth){
      item.classList.add('running-line');
    } else {
      item.classList.remove('running-line');
    }
  });
}


// Dropzone
const dropzone = document.querySelector('#dropzone');
dropzone.addEventListener('click', chooseFile);

function chooseFile() {
  const input = document.createElement('input');
  input.setAttribute('accept', 'audio/mp3');
  input.type = 'file';

  input.onchange = function (e) {
    const file = e.target.files[0];
    
    // название песни
    let nameSong = file.name.split('.').slice(0, -1).join().replace(/[_]+/g, ' ').split('-');
    
    // ссылка на песню
    let urlSong = URL.createObjectURL(file);

    const audiocont = document.createElement('audio');
    audiocont.setAttribute('src', `${urlSong}`)

    audiocont.addEventListener('loadedmetadata', function getDuration(){
      // длительность песни
      let seconds = audiocont.duration;
      let durationSong = `${Math.floor(seconds / 60) < 10 ? `0${Math.floor(seconds / 60)}` : Math.floor(seconds / 60)}:${Math.ceil(seconds % 60) < 10 ? `0${Math.ceil(seconds % 60)}` : Math.ceil(seconds % 60)}`;

      //создание экземпляра песни, добавление в массив, вывод в треклист и проигрыватель
      let newSong = new AddAudio({name: nameSong, file: urlSong, duration: durationSong})

      listAudio.push(newSong);
      createTrackItem(listAudio.length - 1, newSong.name, newSong.duration);

      const playListItems = document.querySelectorAll(".tracklist__trackContainer");
      playListItems[playListItems.length - 1].addEventListener("click", getClickedElement.bind(this));

      loadNewTrack(listAudio.length - 1);
    });
  };
  input.click();
}

class AddAudio {
  constructor(options){
    this.id = options.id,
    this.name = options.name,
    this.file = options.file,
    this.duration = options.duration
  }
}

window.onload = () => {
  if(typeof(window.FileReader) == undefined){
    dropzone.textContent = 'Не поддерживается браузером';
    dropzone.classList.add('error');
  } else {
    dropzone.innerHTML = `<button>Выберите</button>
    <p>песню для загрузки</p>`;
  }
}