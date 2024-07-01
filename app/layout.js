"use client"

import { useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }) {

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const socket = new WebSocket('ws://192.168.1.87:8080');

			socket.onopen = () => {
				console.log('Connected to WebSocket server');
			};

			socket.addEventListener("message", (event) => {
				const data = JSON.parse(event.data);
				const video = document.querySelector('video');
				const speechAudioRef = document.querySelector("#speechAudio");
				const backgroundAudioRef = document.querySelector("#backgroundAudio");

				if (data.type === "play") {
					video.play();
				} else if (data.type === "pause") {
					video.pause();
				} else if (data.type === 'seek') {
					video.currentTime = data.time;
				} else if (data.type === 'playback') {
					video.playbackRate = data.playback;
				} else if (data.type === "caption") {
					video.textContent = `${data.caption}~~${data.simplified}~~${data.textColor}`;
				} else if (data.type === "readOut") {
					video.spellcheck = data.readOut;
				} else if (data.type === "toggleBackground") {
					video.spellcheck = data.toggleBackground;
					if (data.toggleBackground) {
						speechAudioRef.volume = 1
						backgroundAudioRef.volume = 1
					} else {
						speechAudioRef.volume = parseFloat(data.speechVolume) / 100;
						backgroundAudioRef.volume = parseFloat(data.backgroundVolume) / 100;
					}
				} else if (data.type === "handleSpeechVolume") {
					speechAudioRef.volume = parseFloat(data.speechVolume) / 100;
				} else if (data.type === "handleBackgroundVolume") {
					backgroundAudioRef.volume = parseFloat(data.backgroundVolume) / 100;
				} else if (data.type === "playAll") {
					video.play();
					speechAudioRef.play();
					backgroundAudioRef.play();
				} else if (data.type === "pauseAll") {
					video.pause();
					speechAudioRef.pause();
					backgroundAudioRef.pause();
				} else if (data.type === "seekAll") {
					video.currentTime = data.time
					speechAudioRef.currentTime = data.time
					backgroundAudioRef.currentTime = data.time
				} else if (data.type === "selectVideo") {
					video.src = `/${data.video}/${data.video}.mp4`;
					video.textContent = `~~${data.simplified}~~${data.textColor}`;
				} else if (data.type === "slowDown") {
					if (data.slowDown) {
						video.volume = 0;
						video.spellcheck = data.slowDown;
						video.textContent = `${data.caption}~~${data.duration}~~${data.ttsDuration}`;
					} else {
						video.volume = 1;
					}
				} else if (data.type === "back10") {
					video.currentTime = data.time
					if (speechAudioRef && backgroundAudioRef) {
						speechAudioRef.currentTime = data.time
						backgroundAudioRef.currentTime = data.time
					}
				} else if (data.type === "mute") {
					if (data.mute) {
						video.volume = 1;
					} else {
						video.volume = 0;
					}
				} else if (data.type === "reduceVisuals") {
					original = document.querySelector("#original")
					original.spellcheck = data.reduceVisuals;
				} else if (data.type === "playBoth") {
					original = document.querySelector("#original")
					blurred = document.querySelector("#blurred")
					original.play();
					blurred.play()
				} else if (data.type === "pauseBoth") {
					original = document.querySelector("#original")
					blurred = document.querySelector("#blurred")
					original.pause();
					blurred.pause()
				} else if (data.type === 'seekBoth') {
					original = document.querySelector("#original")
					blurred = document.querySelector("#blurred")
					original.currentTime = data.time;
					blurred.currentTime = data.time;
				}
			});

			window.socket = socket;
		}
	}, []);

	return (
		<html lang="en" suppressHydrationWarning>
			<body>{children}</body>
		</html>
	);
}
