'use client';

import { useEffect, useRef, useState } from "react";
import Speech from "speak-tts";

export default function Page() {
    const videoRef = useRef(null);
    const [captions, setCaptions] = useState("");
    const [timestamp, setTimestamp] = useState(0);
    const [simplified, setSimplified] = useState(false);
    const [textColor, setTextColor] = useState("text-white");
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
            selectVideo(video);
            setCaptions("");
        }
    }, [video])

    useEffect(() => {
        const toBool = (text) => { return String(text).toLowerCase() === "true" };

        const handleReadOut = () => {
            if (videoRef.current.textContent.split("~~")[0] !== "") {
                // videoRef.current.pause();
                // window.socket.send(JSON.stringify({ type: 'pause' }));
                const speech = new Speech();

                speech.init({
                    volume: 1.0,
                    lang: "en-GB",
                    rate: 1,
                    pitch: 1
                }).then(data => {
                    speech.speak({
                        text: videoRef.current.textContent.split("~~")[0],
                        queue: false,
                        listeners: {
                            onend: () => {
                                videoRef.current.spellcheck = false;
                            }
                        }
                    }).catch(e => {
                        console.error("Error:", e)
                    })
                }).catch(e => {
                    console.error("Error initialising speech:", e)
                })
            }
        }

        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);
                setCaptions(videoRef.current.textContent.split("~~")[0]);
                setSimplified(toBool(videoRef.current.textContent.split("~~")[1]));
                // setTextColor(videoRef.current.textContent.split("~~")[2]);
                if (videoRef.current.spellcheck) {
                    handleReadOut();
                }
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp]);

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid m-auto grid-rows-11">
            <div className="pt-4">
                <a href="/" className="m-auto px-8 py-5 mx-3">Home 🏠</a>
                <a href="/subtitle_simplification/control" className="m-auto px-8 py-5 mx-3">Controls ⚙</a>
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
            <div className="mx-auto w-3/5 py-4 text-center row-span-7">
                <video ref={videoRef} controls muted={muted} src={`/${video}/${video}.mp4`} type="video/mp4" playbackRate={2} className="h-full mx-auto"></video>
            </div>
            <div className="mx-auto w-3/5 py-4 text-center grid-start-10 row-span-2">
                {videoRef.current && simplified ? (
                    <div className={textColor + " max-w-[60ch] m-auto text-3xl font-medium"}>
                        {captions}
                    </div>
                ) : (
                    <div className={"max-w-[51ch] m-auto text-3xl font-medium"}>
                        {captions}
                    </div>
                )
                }
            </div>
            <div className="mx-auto w-3/5 py-4 text-center grid-start-11">
                <button onClick={handleMuted}>Mute {muted ? "🔇" : "🔊"}</button>
                {videoRef.current && videoRef.current.timestamp ? (<p>{videoRef.current.timestamp}</p>) : (<p></p>)}
            </div>
        </div>
    );
}