"use client"

import { useEffect, useRef, useState } from 'react';
import Speech from "speak-tts";

import bbc_space_simplified_captions from "/public/bbc_space/bbc_space_simplified.json";
import bbc_space_captions from "/public/bbc_space/bbc_space.json";
import university_challenge_simplified_captions from "/public/university_challenge/university_challenge_simplified.json"
import university_challenge_captions from "/public/university_challenge/university_challenge.json"
import the_chase_captions from "/public/the_chase/the_chase.json"
import the_chase_simplified_captions from "/public/the_chase/the_chase_simplified.json"
import industry_captions from "/public/industry/industry.json"
import industry_simplified_captions from "/public/industry/industry_simplified.json"
import devil_wears_prada_captions from "/public/devil_wears_prada/devil_wears_prada.json"
import devil_wears_prada_simplified_captions from "/public/devil_wears_prada/devil_wears_prada_simplified.json"

export default function Home() {
    const [timestamp, setTimestamp] = useState(0);
    const [textColor, setTextColor] = useState("text-white");
    const [duration, setDuration] = useState(0);
    const [currentCaption, setCurrentCaption] = useState("");
    const [simplified, setSimplified] = useState(false);
    const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
    const [video, setVideo] = useState("bbc_space");
    const [captions, setCaptions] = useState(bbc_space_captions.captions)

    const videoRef = useRef(null);

    const convertTime = (t) => {
        const text = t.split(":")
        return (parseInt(text[0], 10) * 60 * 60) + (parseInt(text[1], 10) * 60) + parseFloat(text[2])
    }

    const handlePlay = () => {
        window.socket.send(JSON.stringify({ type: 'play', time: videoRef.current.currentTime }));
    };

    const handlePause = () => {
        window.socket.send(JSON.stringify({ type: 'pause' }));
    };

    const handleSeek = (event) => {
        const time = parseFloat(event.target.value);
        setTimestamp(videoRef.current.currentTime);
        window.socket.send(JSON.stringify({ type: 'seek', time: time }));
    };

    const handleSimplifyCaptions = () => {
        setSimplified(!simplified)
    }

    const handleBack = () => {
        if (currentCaptionIndex > 0) {
            const newTime = convertTime(captions[currentCaptionIndex - 1].start)
            setCurrentCaptionIndex(currentCaptionIndex - 1);
            setTimestamp(newTime);
            videoRef.current.currentTime = newTime;
            videoRef.current.pause();
            window.socket.send(JSON.stringify({ type: 'seek', time: newTime }));
            window.socket.send(JSON.stringify({ type: 'pause' }));
        }
    }

    const handleReadOut = (playerSpeaker) => {
        if (currentCaption !== "") {
            if (playerSpeaker) {
                videoRef.current.pause();
                window.socket.send(JSON.stringify({ type: 'pause' }));
                window.socket.send(JSON.stringify({ type: 'readOut', readOut: true }));
            } else {
                videoRef.current.pause();
                window.socket.send(JSON.stringify({ type: 'pause' }));
                const speech = new Speech();

                speech.init({
                    volume: 1.0,
                    lang: "en-GB",
                    rate: 1,
                    pitch: 1
                }).then(data => {
                    console.log("Speech is ready", data);
                    speech.speak({
                        text: currentCaption,
                        queue: false
                    }).catch(e => {
                        console.error("Error:", e)
                    })
                }).catch(e => {
                    console.error("Error initialising speech:", e)
                })
            }
        }
    }

    useEffect(() => {
        if (video === "bbc_space") {
            if (simplified) {
                setCaptions(bbc_space_simplified_captions.captions)
            } else {
                setCaptions(bbc_space_captions.captions)
            }
        } else if (video === "university_challenge") {
            if (simplified) {
                setCaptions(university_challenge_simplified_captions.captions)
            } else {
                setCaptions(university_challenge_captions.captions)
            }
        } else if (video === "the_chase") {
            if (simplified) {
                setCaptions(the_chase_simplified_captions.captions)
            } else {
                setCaptions(the_chase_captions.captions)
            }
        } else if (video === "industry") {
            if (simplified) {
                setCaptions(industry_simplified_captions.captions)
            } else {
                setCaptions(industry_captions.captions)
            }
        } else if (video === "devil_wears_prada") {
            if (simplified) {
                setCaptions(devil_wears_prada_simplified_captions.captions)
            } else {
                setCaptions(devil_wears_prada_captions.captions)
            }
        }
    }, [video, simplified])

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
        for (const element of captions) {
            if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
                setCurrentCaptionIndex(captions.indexOf(element))
                setCurrentCaption(element.text);

                if (element.speaker === "presenter") {
                    setTextColor("text-white")
                } else if (element.speaker === "speaker") {
                    setTextColor("text-yellow-300")
                } else if (element.speaker === "interviewee") {
                    setTextColor("text-sky-500")
                } else {
                    setTextColor("text-white")
                }

                if (currentCaption !== videoRef.current.textContent.split("~~")[0]) {
                    window.socket.send(JSON.stringify({ type: 'caption', caption: element.text, simplified: simplified, textColor: textColor }));
                }
            }
        }
    }, [timestamp, simplified, textColor, video, currentCaption, captions])

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid grid-rows-3 auto-rows-max m-auto">
            <div className="pt-4">
                <a className="m-auto px-8 py-5 mx-3" href="/">Home 🏠</a>
                <a className="m-auto px-8 py-5 mx-3" href="/subtitle_simplification/player">Player 📺</a>
            </div>
            <video ref={videoRef} controls muted className="mx-auto w-3/5 hidden" playbackRate={0.6} src={`/${video}/${video}.mp4`} type="video/mp4">
                <track id="subtitles" label="English" kind="subtitles" srcLang="en" src={`/${video}/${video}.vtt`} />
            </video>
            <div className="mx-auto w-3/5 py-4 row-span-1">
                <div className="pb-6 grid">
                    <button className="px-8 py-5" onClick={handleSimplifyCaptions}>Simple Captions: {simplified ? "👍" : "👎"}</button>
                </div>
                <div className="pb-6 grid">
                    {simplified && <button className="px-8 py-5" onClick={() => handleReadOut(true)}>Read out 🔊</button>}
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