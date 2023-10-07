import playList from './playList.js';
import greetingTranslation from './greetings.js';
import headings from './heading.js';

"use strict";

// ! Variables
// Clock
const time = document.querySelector(".time");
const date = document.querySelector(".date");
// Greetings
const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
// Background-image
const body = document.querySelector("body");
const prevBtn = document.querySelector(".slide-prev");
const nextBtn = document.querySelector(".slide-next");
// Weather
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const city = document.querySelector(".city");
const cityError = document.querySelector(".weather-error");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
// Quotes
const changeQuoteBtn = document.querySelector(".change-quote");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
// Player
const player = document.querySelector(".player");
const playPrev = document.querySelector(".play-prev");
const play = document.querySelector(".play");
const playNext = document.querySelector(".play-next");
const audioList = document.querySelector(".play-list");
const trackTitle = document.querySelector(".track-title");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector("#progress");
const timelineStart = document.querySelector(".timeline-start");
const timelineEnd = document.querySelector(".timeline-end");
const volumeBtn = document.querySelector("#volume");
const volumeRange = document.querySelector("#volume-level");
// Settings
const settingHeadings = document.querySelectorAll(".heading");
const cardsBlock = document.querySelector(".cards");
const cards = document.querySelectorAll(".card");
const langs = document.querySelectorAll(".lang");
const bgBtns = document.querySelectorAll(".img-src .btn");
// ToDoList
const todoBtn = document.querySelector(".todo-btn");
const todoBlock = document.querySelector(".todo-list__block");
const todos = document.querySelectorAll(".todo");

if(localStorage.getItem("lang") === null) {
  localStorage.setItem("lang", "en");
}
if(localStorage.getItem("src") === null) {
  localStorage.setItem("src", "git");
}

// ! Clock and Calendar

// Clock
function showTime() {
  const current = new Date();
  function getZero(num) {
    return num < 10 ? "0" + num : num;
  }
  return time.textContent = `${getZero(current.getHours())}:${getZero(current.getMinutes())}:${getZero(current.getSeconds())}`;
}
showTime();
setInterval(showTime, 1000);

// Calendar
function showDate() {
  let currentlang = localStorage.getItem("lang");
  const now = new Date();
  const options = {weekday: "long", month: "long", day: "numeric"};
  currentlang === "en" ? date.textContent = now.toLocaleDateString("en-US", options) : date.textContent = now.toLocaleDateString("ru-RU", options);
}
showDate();
setInterval(showDate, 1000);


// ! Welcome

// Time of the day
let dayTime;
let timeOfDay;
let greet;
const now = new Date();
const hours = now.getHours();
function showGreeting() {
  getTimeOfDay(hours);
  greeting.textContent = greet;
}
showGreeting();
function getTimeOfDay(hours) {
  let currentlang = localStorage.getItem("lang");
  currentlang === "en" ? name.placeholder = "[Enter name]" : name.placeholder = "[Введите имя]";
  if(hours >= 6 && hours < 12) {
    timeOfDay = greetingTranslation["bgImg"][0];
    greet = greetingTranslation[currentlang][0];
  }
  else if(hours >= 12 && hours < 18) {
    timeOfDay = greetingTranslation["bgImg"][1];
    greet = greetingTranslation[currentlang][1];
  }
  else if(hours >= 18 && hours <= 23) {
    timeOfDay = greetingTranslation["bgImg"][2];
    greet = greetingTranslation[currentlang][2];
  }
  else if(hours >= 0 && hours < 6) {
    timeOfDay = greetingTranslation["bgImg"][3];
    greet = greetingTranslation[currentlang][3];
  }
}
// Name
function setLocalStorage() {
  localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage);
function getLocalStorage() {
  if(localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }
}
window.addEventListener('load', getLocalStorage);

// ! Background image
function getRandomNum() {
  return Math.floor(Math.random() * (20 - 1) + 1);
}
let randomNum = getRandomNum();
function setBg() {
  const img = new Image();
  img.src = `./assets/img/images/${timeOfDay}/${randomNum}`;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}
setBg();
function getSlideNext() {
  randomNum++;
  if(randomNum > 20) { randomNum = 1; }
  else { randomNum; }
  setBg();
}
function getSlidePrev() {
  randomNum--;
  if(randomNum < 1) { randomNum = 20; }
  else { randomNum; }
  setBg();
}
nextBtn.addEventListener("click", getSlideNext);
prevBtn.addEventListener("click", getSlidePrev);

// ! Weather Widget
if(localStorage.getItem("lang") === "en") {
  localStorage.setItem('city', "Minsk");
}
else if(localStorage.getItem("lang") === "ru") {
  localStorage.setItem('city', "Минск");
}

async function getWeather() {
  let currentlang = localStorage.getItem("lang");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=66984a8628c1f67fca8a8c3b7bd40d03&units=metric`; 
  const res = await fetch(url);
  const data = await res.json();
  if(data.cod === "404") {
    if(currentlang === "en") {
      cityError.textContent = `${data.message}`;
    }
    else if(currentlang === "ru") {
      cityError.textContent = "город не найден";
    }
    weatherIcon.className = 'weather-icon owf';
    wind.textContent = null;
    humidity.textContent = null;
    temperature.textContent = null;
    weatherDescription.textContent = null;
  }
  else if(data.cod === 200) {
    cityError.textContent = null;
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C`;
    localStorage.setItem('city', city.value);
    if(currentlang === "en") {
      wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)}m/s`;
      humidity.textContent = `Humidity: ${Math.floor(data.main.humidity)}%`;
      weatherDescription.textContent = data.weather[0].main;
    }
    else if(currentlang === "ru") {
      wind.textContent = `Скорость ветра: ${Math.floor(data.wind.speed)}m/s`;
      humidity.textContent = `Влажность: ${Math.floor(data.main.humidity)}%`;
      weatherDescription.textContent = data.weather[0].description;
    }
  }  
}
if(localStorage.getItem('city')) {
  city.value = localStorage.getItem('city');
}
setInterval(1000, getWeather());
city.addEventListener("change", getWeather);

// ! Quotes
function getQuotes() {
  let quotes;
  let currentlang = localStorage.getItem("lang");
  if(currentlang === "en") { quotes = "quotes_en.json"; }
  else if(currentlang === "ru") { quotes = "quotes_ru.json"; }
  fetch(quotes)
    .then(res => res.json())
    .then(data => { 
      let i = getRandomIndex(data.length);
      quote.textContent = data[i].text;
      author.textContent = data[i].author;
    });
}
getQuotes();
changeQuoteBtn.addEventListener("click", getQuotes);
function getRandomIndex(dataLength) {
  return Math.floor(Math.random() * (dataLength - 0) + 0);
}

// ! Audio player
let audioNum = 1;
let isPlay = false;
progressBar.value = "0";
const audio = new Audio();

function pauseAudio() {
  play.classList.remove('pause');
  trackTitle.classList.add("track-pause");
  trackTitle.classList.remove("track-play");
  audio.pause();
  isPlay = false; 
}
function playAudio() {
  play.classList.add("pause");
  trackTitle.classList.remove("track-pause");
  trackTitle.classList.add("track-play");
  audio.play(); 
  isPlay = true; 
}
audio.src = playList[audioNum].src;
function startPlay() {
  if(isPlay) { 
    pauseAudio();
  }
  else if(!isPlay) { 
    playAudio();
  }
  getFullTime();
  selectTrack();
  setTitle();
}
play.addEventListener("click", startPlay);
audio.addEventListener("ended", playNextTrack);

function playNextTrack() {
  isPlay = false;
  audioNum++;
  if(audioNum > Object.keys(playList).length) {
    audioNum = 1;
    audio.src = playList[audioNum].src;
    startPlay();
  }
  else {
    audio.src = playList[audioNum].src;
    startPlay();
  }
}
function playPrevTrack() {
  isPlay = false;
  audioNum--;
  if(audioNum < 1) {
    audioNum = Object.keys(playList).length;
    audio.src = playList[audioNum].src;
    startPlay();
  }
  else { 
    audio.src = playList[audioNum].src;
    startPlay();
  }
}
playNext.addEventListener("click", playNextTrack);
playPrev.addEventListener("click", playPrevTrack);

function setTitle() {
  return trackTitle.textContent = `${playList[audioNum].title} ${playList[audioNum].duration}`;
}

// PlayList
Object.values(playList).forEach(item => {
  const li = document.createElement("li");
  li.classList.add("play-item");
  li.textContent = item.title;
  audioList.append(li);
});

function selectTrack() {
  const trackList = document.querySelectorAll(".play-item");
  trackList.forEach(track => {
    if(track.textContent === playList[audioNum].title) {
      return track.classList.add("item-active");
    } 
    else { return track.classList.remove("item-active"); }
  });
}
