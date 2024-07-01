"use client"

import { useEffect, useRef, useState } from 'react';
import bbc_space_captions from "/public/bbc_space/bbc_space.json";
import university_challenge_captions from "/public/university_challenge/university_challenge.json"
import the_chase_captions from "/public/the_chase/the_chase.json"
import industry_captions from "/public/industry/industry.json"
import devil_wears_prada_captions from "/public/devil_wears_prada/devil_wears_prada.json"

export default function Page() {
    const [timestamp, setTimestamp] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentCaption, setCurrentCaption] = useState("");
    const [slowDown, setSlowDown] = useState(false);
    const [video, setVideo] = useState("bbc_space");

    const videoRef = useRef(null);

    const convertTime = (t) => {
        const text = t.split(":")
        return (parseInt(text[0], 10) * 60 * 60) + (parseInt(text[1], 10) * 60) + parseFloat(text[2])
    }

    const handlePlay = () => {
        window.socket.send(JSON.stringify({ type: 'play' }));
    };

    const handlePause = () => {
        window.socket.send(JSON.stringify({ type: 'pause' }));
    };

    const handleBack = () => {
        const time = videoRef.current.currentTime - 10;
        window.socket.send(JSON.stringify({ type: 'back10', time: time }));
    }

    const handleSeek = (event) => {
        const time = parseFloat(event.target.value);
        videoRef.current.currentTime = time;
        setTimestamp(videoRef.current.currentTime);
        window.socket.send(JSON.stringify({ type: 'seek', time: time }));
    };

    const handleSlowDown = () => {
        setSlowDown(!slowDown)
        window.socket.send(JSON.stringify({ type: 'mute', mute: slowDown }));
        if (!slowDown) {
            window.socket.send(JSON.stringify({ type: 'playback', playback: 1 }));
        }
    }

    useEffect(() => {
        if (currentCaption !== "") {
            window.socket.send(JSON.stringify({ type: 'readOut', readOut: true }));
        }
    })

    useEffect(() => {
        if (videoRef.current.duration) {
            setDuration(videoRef.current.duration);
        }

        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);
            }

            if (`http://localhost:3000/${video}/${video}.mp4` !== videoRef.current.src) {
                if (videoRef.current.duration) {
                    setDuration(videoRef.current.duration);
                }
                setVideo(videoRef.current.src.split("/").at(-1).replace(".mp4", ""));
                setCurrentCaption("");
                setSlowDown(false);
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp, video]);

    useEffect(() => {
        if (video === "bbc_space") {
            for (const element of bbc_space_captions.captions) {
                if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
                    setCurrentCaption(element.text);

                    if (currentCaption !== videoRef.current.textContent.split("~~")[0]) {
                        console.log(element.end, element.start)
                        window.socket.send(JSON.stringify({ type: 'slowDown', caption: element.text, slowDown: slowDown, duration: parseFloat(convertTime(element.end)) - parseFloat(convertTime(element.start)), ttsDuration: element.tts_duration }));
                    }
                }
            }
        } else if (video === "university_challenge") {
            for (const element of university_challenge_captions.captions) {
                if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
                    setCurrentCaption(element.text);

                    if (currentCaption !== videoRef.current.textContent.split("~~")[0]) {
                        window.socket.send(JSON.stringify({ type: 'slowDown', caption: element.text, slowDown: slowDown, duration: parseFloat(convertTime(element.end)) - parseFloat(convertTime(element.start)), ttsDuration: element.tts_duration }));
                    }
                }
            }
        } else if (video === "the_chase") {
            for (const element of the_chase_captions.captions) {
                if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
                    setCurrentCaption(element.text);

                    if (currentCaption !== videoRef.current.textContent.split("~~")[0]) {
                        window.socket.send(JSON.stringify({ type: 'slowDown', caption: element.text, slowDown: slowDown, duration: parseFloat(convertTime(element.end)) - parseFloat(convertTime(element.start)), ttsDuration: element.ttsDuration }));
                    }
                }
            }
        } else if (video === "industry") {
            for (const element of industry_captions.captions) {
                if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
                    setCurrentCaption(element.text);

                    if (currentCaption !== videoRef.current.textContent.split("~~")[0]) {
                        window.socket.send(JSON.stringify({ type: 'slowDown', caption: element.text, slowDown: slowDown, duration: element.duration, ttsDuration: element.ttsDuration }));
                    }
                }
            }
        } else if (video === "devil_wears_prada") {
            for (const element of devil_wears_prada_captions.captions) {
                if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
                    setCurrentCaption(element.text);

                    if (currentCaption !== videoRef.current.textContent.split("~~")[0]) {
                        window.socket.send(JSON.stringify({ type: 'slowDown', caption: element.text, slowDown: slowDown, duration: element.duration, ttsDuration: element.ttsDuration }));
                    }
                }
            }
        }
    }, [timestamp, slowDown, video, currentCaption])

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid grid-rows-3 auto-rows-max m-auto">
            <div className="pt-4">
                <a className="m-auto px-8 py-5 mx-3" href="/">Home 🏠</a>
                <a className="m-auto px-8 py-5 mx-3" href="/slower_speech/player">Player 📺</a>
            </div>
            <video ref={videoRef} controls muted={true} className="mx-auto w-3/5 hidden" src={`/${video}/${video}.mp4`} type="video/mp4">
                <track id="subtitles" label="English" kind="subtitles" srcLang="en" src={`/${video}/${video}.vtt`} />
            </video>
            <div className="mx-auto w-3/5 py-4 text-center row-span-1 flex flex-col">
                <div className="pb-6 align-end grid grid-cols-1">
                    <button className="px-8 py-5" onClick={handleSlowDown}>Slow down: {slowDown ? "👍" : "👎"}</button>
                </div>
            </div>
            <div className="mx-auto w-3/5 py-4">
                <div className="pb-6 grid grid-cols-3">
                    <button className="px-8 py-5" onClick={handleBack}>⬅ Go back</button>
                    <button className="px-8 py-5" onClick={handlePlay}>Play ▶</button>
                    <button className="px-8 py-5" onClick={handlePause}>Pause ⏸</button>
                </div>
                <div>
                    <input
                        className="mx-auto w-full"
                        type="range"
                        min={0}
                        max={duration}
                        step={0.1}
                        value={timestamp}
                        onChange={handleSeek}
                    />
                    <div>
                        {Math.floor(timestamp / 60)}:{('0' + parseInt(timestamp - Math.floor(timestamp / 60) * 60)).slice(-2)} / {Math.floor(duration / 60)}:{('0' + parseInt(duration - Math.floor(duration / 60) * 60)).slice(-2)}
                    </div>
                </div>
            </div>
        </div>
    );
}