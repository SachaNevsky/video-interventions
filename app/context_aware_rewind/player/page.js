'use client';

import { useState, useRef, useEffect } from "react";

export default function Page() {

    const videoRef = useRef(null);
    const [timestamp, setTimestamp] = useState(0);
    const [muted, setMuted] = useState(true);
    const [video, setVideo] = useState("bbc_space");

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
    }, [video]);

    useEffect(() => {
        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp]);

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid m-auto">
            <div className="pt-4">
                <a href="/" className="m-auto px-8 py-5 mx-3">Home 🏠</a>
                <a href="/slower_subtitles/control" className="m-auto px-8 py-5 mx-3">Controls ⚙</a>
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
                    TV Show
                </button>
                <button className="py-5 px-8" onClick={() => selectVideo("devil_wears_prada")}>
                    Film
                </button>
            </div>
            <div className="mx-auto w-3/5 py-4 text-center">
                <video ref={videoRef} controls muted={muted} src={`/${video}/${video}.mp4`} type="video/mp4" className="h-full mx-auto">
                    <track
                        id="subtitles"
                        label="Simplified"
                        kind="subtitles"
                        srcLang="en"
                        src={`/${video}/${video}_simplified.vtt`} />
                </video>
            </div>
            <div className="mx-auto w-3/5 text-center">
                <button className="py-5 px-8" onClick={handleMuted}>Mute {muted ? "🔇" : "🔊"}</button>
            </div>
        </div>
    );
}