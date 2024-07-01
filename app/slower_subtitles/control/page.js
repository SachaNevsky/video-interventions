"use client"

import { useEffect, useRef, useState } from 'react';

import bbc_space_captions from "/public/bbc_space/bbc_space.json";
import university_challenge_captions from "/public/university_challenge/university_challenge.json"
import the_chase_captions from "/public/the_chase/the_chase.json"
import industry_captions from "/public/industry/industry.json"
import devil_wears_prada_captions from "/public/devil_wears_prada/devil_wears_prada.json"

export default function Home() {
    const [timestamp, setTimestamp] = useState(0);
    const [duration, setDuration] = useState(0);
    const [caption, setCaption] = useState("");
    const [slowMode, setSlowMode] = useState(false);
    const [playback, setPlayback] = useState(1);
    const [magnitude, setMagnitude] = useState(0.03);
    const [captions, setCaptions] = useState(bbc_space_captions);
    const [video, setVideo] = useState("bbc_space");
    const [grade, setGrade] = useState(8);

    const videoRef = useRef(null);

    const handlePlay = () => {
        videoRef.current.play();
        window.socket.send(JSON.stringify({ type: 'play', time: videoRef.current.currentTime }));
    };

    const handlePause = () => {
        videoRef.current.pause();
        window.socket.send(JSON.stringify({ type: 'pause' }));
    };

    const handleSeek = (event) => {
        const time = parseFloat(event.target.value);
        videoRef.current.currentTime = time;
        setTimestamp(videoRef.current.currentTime);
        window.socket.send(JSON.stringify({ type: 'seek', time }));
    };

    const handleSlowMode = () => {
        setSlowMode(!slowMode)
    }

    const handleMagnitude = (event) => {
        setGrade(11 - Math.floor(event.target.value * 100))
        setMagnitude(event.target.value)
    }

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
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp, video]);

    useEffect(() => {
        const convertTime = (t) => {
            const text = t.split(":")
            return (parseInt(text[0], 10) * 60 * 60) + (parseInt(text[1], 10) * 60) + parseFloat(text[2])
        }

        if (video === "bbc_space") {
            setCaptions(bbc_space_captions)
        } else if (video === "university_challenge") {
            setCaptions(university_challenge_captions)
        } else if (video === "the_chase") {
            setCaptions(the_chase_captions)
        } else if (video === "industry") {
            setCaptions(industry_captions)
        } else if (video === "devil_wears_prada") {
            setCaptions(devil_wears_prada_captions)
        }

        for (const element of captions.captions) {
            if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
                setCaption(element.text)
                if (slowMode && parseInt(element.flesch_kincaid) >= grade) {
                    const reduce = Math.min((element.flesch_kincaid - (grade - 1)) * magnitude, 11 * magnitude);
                    setPlayback(1 - reduce);
                    console.log("Slowed:", element.flesch_kincaid, playback)
                    videoRef.current.playbackRate = playback;
                    window.socket.send(JSON.stringify({ type: "playback", playback }))
                } else {
                    setPlayback(1);
                    console.log("Standard:", element.flesch_kincaid, playback)
                    window.socket.send(JSON.stringify({ type: "playback", playback }))
                }
            }
        }
    }, [timestamp, slowMode, magnitude, playback, video, captions, grade])

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid grid-rows-3 auto-rows-max m-auto">
            <div className="pt-4">
                <a className="m-auto px-8 py-5 mx-3" href="/">Home 🏠</a>
                <a className="m-auto px-8 py-5 mx-3" href="/slower_subtitles/player">Player 📺</a>
            </div>
            <video ref={videoRef} controls muted className="mx-auto w-3/5 hidden" src={`/${video}/${video}.mp4`} type="video/mp4">
                <track id="subtitles" label="English" kind="subtitles" srcLang="en" src={`/${video}/${video}_simplified.vtt`} />
            </video>
            <div className="mx-auto w-3/5 py-4">
                <div className="pb-6 grid grid-cols-1">
                    <button className="px-8 py-5" onClick={handleSlowMode}>Slow Mode: {slowMode ? "👍" : "👎"}</button>
                </div>
                {slowMode &&
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <label className="px-4">Weak </label>
                        <input
                            name="magnitude"
                            className="w-full"
                            type="range"
                            min={0.01}
                            max={0.05}
                            step={0.005}
                            onChange={handleMagnitude}
                        />
                        <label className="px-4"> Strong</label>
                    </div>
                }
            </div>
            <div className="mx-auto w-3/5 py-4 ">
                <div className="pb-6 grid grid-cols-2">
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