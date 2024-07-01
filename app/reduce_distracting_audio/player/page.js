"use client"

import { useEffect, useRef, useState } from "react";

export default function Home() {

    const videoRef = useRef(null);
    const speechRef = useRef(null);
    const backgroundRef = useRef(null);

    const [timestamp, setTimestamp] = useState(0);
    const [speechVolume, setSpeechVolume] = useState(1);
    const [backgroundVolume, setBackgroundVolume] = useState(1);
    const [muted, setMuted] = useState(true);
    const [video, setVideo] = useState("bbc_space")

    const handleMuted = () => {
        setMuted(!muted);
    }

    const selectVideo = (newVideo) => {
        if (window.socket !== undefined && window.socket.readyState === socket.OPEN) {
            setVideo(newVideo);
            window.socket.send(JSON.stringify({ type: 'selectVideo', video: newVideo }));
        }
    }

    useEffect(() => {
        if (`/${video}/${video}.mp4` !== videoRef.current.src) {
            selectVideo(video)
        }
    }, [video])

    useEffect(() => {
        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);
            }

            if (speechRef.current.volume !== speechVolume) {
                setSpeechVolume(speechRef.current.volume);
            }

            if (backgroundRef.current.volume !== backgroundVolume) {
                setBackgroundVolume(backgroundRef.current.volume);
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp, speechVolume, backgroundVolume]);

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid m-auto">
            <div className="pt-4">
                <a href="/" className="m-auto px-8 py-5 mx-3">Home 🏠</a>
                <a href="/reduce_distracting_audio/control" className="m-auto px-8 py-5 mx-3">Controls ⚙</a>
            </div>
            <div className="mx-auto w-3/5 py-4">
                <button className="py-5 px-8" onClick={() => selectVideo("bbc_space")}>
                    BBC News
                </button>
                {/* <button className="py-5 px-8" onClick={() => selectVideo("university_challenge")}>
                    University Challenge
                </button> */}
                <button className="py-5 px-8" onClick={() => selectVideo("the_chase")}>
                    The Chase
                </button>
                <button className="py-5 px-8" onClick={() => selectVideo("industry")}>
                    Drama TV Show
                </button>
                <button className="py-5 px-8" onClick={() => selectVideo("devil_wears_prada")}>
                    Drama Film
                </button>
            </div>
            <div className="mx-auto w-3/5 py-4 text-center">
                <video id="videoPlayer" ref={videoRef} controls muted className="h-full mx-auto" src={`/${video}/${video}.mp4`} type="video/mp4" />
            </div>
            <audio id="speechAudio" src={`/${video}/${video}_speech.mp3`} type="audio/mpeg" ref={speechRef} muted={muted}></audio>
            <audio id="backgroundAudio" src={`/${video}/${video}_background.mp3`} type="audio/mpeg" ref={backgroundRef} muted={muted}></audio>
            <div className="mx-auto w-3/5 py-4 text-center">
                <button className="py-5 px-8" onClick={handleMuted}>Mute {muted ? "🔇" : "🔊"}</button>
            </div>
        </div>
    );
}