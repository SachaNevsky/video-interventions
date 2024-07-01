"use client"

import { useState, useEffect, useRef } from "react";

export default function Page() {
    const [timestamp, setTimestamp] = useState(0);
    const [duration, setDuration] = useState(0);
    const [reduceVisuals, setReduceVisuals] = useState(false);
    const [video, setVideo] = useState("bbc_space");

    const videoRef = useRef(null);
    const videoRef2 = useRef(null);

    const handlePlay = () => {
        window.socket.send(JSON.stringify({ type: 'playBoth' }));
    };

    const handlePause = () => {
        window.socket.send(JSON.stringify({ type: 'pauseBoth' }));
    };

    const handleSeek = (event) => {
        const time = parseFloat(event.target.value);
        videoRef.current.currentTime = time;
        setTimestamp(videoRef.current.currentTime);
        window.socket.send(JSON.stringify({ type: 'seekBoth', time: time }));
    };

    const handleReduceVisuals = () => {
        window.socket.send(JSON.stringify({ type: 'reduceVisuals', reduceVisuals: !reduceVisuals }));
        setReduceVisuals(!reduceVisuals)
    }

    useEffect(() => {
        console.log(reduceVisuals)
    }, [reduceVisuals])

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
                setReduceVisuals(false);
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp, video, reduceVisuals]);

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid grid-rows-3 auto-rows-max m-auto">
            <div className="pt-4">
                <a className="m-auto px-8 py-5 mx-3" href="/">Home 🏠</a>
                <a className="m-auto px-8 py-5 mx-3" href="/reduce_distracting_visuals/player">Player 📺</a>
            </div>
            <video id="original" ref={videoRef} controls muted src={`/${video}/${video}.mp4`} type="video/mp4" className="h-full mx-auto hidden" />
            <video id="blurred" ref={videoRef2} controls muted src={`/${video}/${video}.mp4`} type="video/mp4" className="h-full mx-auto hidden" />
            <div className="mx-auto w-3/5 py-4 text-center row-span-1 flex flex-col">
                <div className="pb-6 align-end grid grid-cols-1">
                    <button className="px-8 py-5" onClick={handleReduceVisuals}>Reduce visual distractions: {reduceVisuals ? "👍" : "👎"}</button>
                </div>
            </div>
            <div className="mx-auto w-3/5 py-4">
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