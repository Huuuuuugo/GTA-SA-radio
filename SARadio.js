//Constants
const pathWrite = `${__dirname}/Radio.m3u8`;
const pathAd = `${__dirname}/audio/STREAMS/ADVERTS/`;
const interference = [
	`${__dirname}/audio/SFX/GENRL/Bank_053/sound_002.mp3`,
	`${__dirname}/audio/SFX/GENRL/Bank_053/sound_003.mp3`
]

CH = null;

const KRoseMusic  = [51,58,65,72,79,86,93,100,107,114,121,128,135,142,149];
const KRoseIntros = [ 3, 3, 3, 3, 3, 3, 3,  3,  3,  3,  3,  3,  3,  3,  3];
const pathKRose   = `${__dirname}/audio/STREAMS/CO/`;

const KDSTMusic  = [44,51,58,65,72,78,85,92,95,101,108,115,122,129,136,143,150];
const KDSTIntros = [ 3, 3, 3, 3, 3, 3, 3, 1, 3,  3,  3,  3,  3,  3,  3,  3,  3];
const pathKDST   = `${__dirname}/audio/STREAMS/CR/`;

const BounceFMMusic  = [61,68,75,82,89,96,103,110,117,124,131,138,145,152,159,166,173];
const BounceFMIntros = [ 3, 3, 3, 3, 3, 3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3];
const pathBounceFM = `${__dirname}/audio/STREAMS/DS/`;

const RadioLosSantosMusic  = [51,58,65,72,79,86,92,98,104,109,116,123,130,135,142,148];
const RadioLosSantosIntros = [ 3, 3, 3, 3, 3, 3, 3, 3,  2,  3,  3,  3,  2,  3,  2,  1];
const pathRadioLosSantos   = `${__dirname}/audio/STREAMS/MH/`;

const RadioXMusic  = [47,54,61,68,75,82,89,96,103,110,117,124,131,138,145];
const RadioXIntros = [ 3, 3, 3, 3, 3, 3, 3, 3,  3,  3,  3,  3,  3,  3,  1];
const pathRadioX   = `${__dirname}/audio/STREAMS/MR/`;

NJ = null;

RE = null;

RG = null;


CH = null;
const KRose = [156,41,50,KRoseMusic,KRoseIntros,pathKRose];
const KDST = [157,32,43,KDSTMusic,KDSTIntros,pathKDST];
const BounceFM = [180,52,60,BounceFMMusic,BounceFMIntros,pathBounceFM];
const RadioLosSantos = [153,39,50,RadioLosSantosMusic,RadioLosSantosIntros,pathRadioLosSantos];
const RadioX = [148,35,46,RadioXMusic,RadioXIntros,pathRadioX];
NJ = null;
RE = null;
RG = null;

const radiosList = [0,CH,KRose,KDST,BounceFM,RadioLosSantos,RadioX,NJ,RE,RG];

//Variables
var radio = 0;
var identsList = [];
var narratorList = [];
var adList = [];
var radioList = [];
var playlist = [];
var playlistString  = [];
var track = [];
var T1 = [];
var T2 = [];

muteNarratorOnMusics = 0;
muteNarratorBetweenMusic = 0;
muteRadioIdents = 0;
skipAds = 0;

//Functions
function makeList(path, list, t) 
{
	if (t < 10) {track = 'Track_00' + t + '.mp3'}
	if (t >= 10 && t < 100) {track = 'Track_0' + t + '.mp3'}
	if (t >= 100) {track = 'Track_' + t + '.mp3'}

	let listItem = path + track;
	list.push(listItem);
}

function music() 
{  
	var playingFrom = radioMusic[Math.floor(Math.random() * radioMusic.length)];
	var playingUntil = radioMusicRef[radioMusicRef.indexOf(playingFrom) + 1];
	var intros = radioIntros[radioMusicRef.indexOf(playingFrom)];

	var playingList = radioList.slice([playingFrom -1],[playingUntil -1]);

	var middle = playingList.shift(0);
	var begin  = [];
	for (let i = 0; i < intros; i++) {
		begin.push(playingList.shift());
	};
	var end = playingList;

	if (muteNarratorOnMusics == 0) {
		playlist.push(begin[Math.floor(Math.random()*begin.length)]);
		playlist.push(middle);
		playlist.push(end[Math.floor(Math.random()*end.length)]);
	}
	else {
		playlist.push(begin[0]);
		playlist.push(middle);
		playlist.push(end[0]);
	}
	radioMusic.splice(radioMusic.indexOf(playingFrom), 1);
}

function intermission() 
{
	var p1 = Math.floor(Math.random()*101);
	var p2 = Math.floor(Math.random()*101);

	if (p1 <= 60 && identsList.length !== 0) {
		T1 = identsList[Math.floor(Math.random()*identsList.length)];
		if (p2 <= 20) {
			T2 = adList[Math.floor(Math.random()*adList.length)];
		}
		if (p2 > 20 && p2 <= 50) {
			T2 = narratorList[Math.floor(Math.random()*narratorList.length)];
		}
		if (p2 > 50) {
			T2 = 0;
		}		
	}
	else {
		p1 = 100;
	};

	if (p1 > 60)
	{
		T1 = narratorList[Math.floor(Math.random()*narratorList.length)];
		if (p2  > 55) {
			T2 = adList[Math.floor(Math.random()*adList.length)];
		}
		if (p2 <= 55) {
			T2 = 0;
		}
	};

	playlist.push(T1);
	playlist.push(T2);

	narratorList.splice(narratorList.indexOf(T1),1);
	narratorList.splice(narratorList.indexOf(T2),1);
	identsList.splice(identsList.indexOf(T1),1);
	identsList.splice(identsList.indexOf(T2),1);
	adList.splice(adList.indexOf(T1),1);
	adList.splice(adList.indexOf(T2),1);
}

//Main
const prompt = require("prompt-sync")({ sigint: true });
const fs = require('fs');
const exec = require('child_process').exec;

while (radio == 0) {
	console.log('Choose a radio station or press 0 to change preferences: ' + 
	'\n01 - CH\t\t\t\t06 - RADIO X' + 
	'\n02 - KROSE\t\t\t07 - NJ' + 
	'\n03 - K-DST\t\t\t08 - RE' +
	'\n04 - BOUNCE FM\t\t\t09 - RG' + 
	'\n05 - RADIO LOS SANTOS\t\t00 - PREFERENCES\n');
	radio = radiosList[prompt("")]
	if (radio == 0) {
		console.log("======= PREFERENCES ======" +
		"\nPress 1 for ON or 0 for OFF")
		console.log("Mute narrator on musics: ")
		muteNarratorOnMusics = prompt("")
		console.log("Mute narrator between musics: ")
		muteNarratorBetweenMusic = prompt("")
		console.log("Mute radio idents: ")
		muteRadioIdents = prompt("")
		console.log("Skip ads: ")
		skipAds = prompt("")
		console.log("\n")
	};
};

var radioMusic  = radio[3];
var radioIntros = radio[4];
var radioPath = radio[5];
var radioMusicRef = radioMusic.concat(radio[0]);

for (let i = 1; i < radio[0]; i++) {
	makeList(radioPath, radioList, i)
};

if (skipAds == 0) {
	for (let i = 1; i <= 69; i++) {
		makeList(pathAd, adList, i)
	};
}
else {
	for (let i = 0; i < 69; i++) {
		adList[i] = 'ad skipped'
	};
};

if (muteNarratorBetweenMusic == 0) {
	narratorList = radioList.slice(0, radio[1]);
}
else {
	for (let i = 0; i < radio[1]; i++) {
		narratorList[i] = 'narrrator skipped'
	};
};

if (muteRadioIdents == 0) {
	identsList = radioList.slice(radio[1], radio[2]);
}
else {
	for (let i = 0; i < 20; i++) {
		identsList[i] = 'ident skipped';
	}
};

playlist.push(interference[Math.floor(Math.random()*2)])
for (let i = 1; i < radio[4].length; i++) {
	music(); intermission()
}
for (let i = 1; i < playlist.length; i++) {
	if (playlist.includes(0) === true) {
		playlist.splice(playlist.indexOf(0),1);
	}
};

for (let i = 0; i < playlist.length; i++) {
	if (playlist[i]) {playlistString = playlistString + playlist[i].toString() + '\n'};
};

fs.writeFile(pathWrite, playlistString, err => {});

var openPlayer ='start '+ pathWrite.slice(0,3) + '"' + pathWrite.slice(3) + '"';
exec(openPlayer);