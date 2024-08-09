'use client';

import { useEffect, useRef, useState } from "react";
import Speech from "speak-tts";

export default function Page() {

    const videoRef = useRef(null);

    const [captions, setCaptions] = useState("");
    const [timestamp, setTimestamp] = useState(0);
    const [muted, setMuted] = useState(true);
    const [video, setVideo] = useState("bbc_space");

    const speech = new Speech();

    const handleMuted = () => {
        setMuted(!muted);
        if(muted) {
            speech.setVolume(0.001);
        } else {
            speech.setVolume(1);
        }
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
    }, [video]);

    useEffect(() => {
        const handleReadOut = () => {
            if (videoRef.current.textContent !== "") {
                console.log(videoRef.current.currentTime)
                
                const toRead = videoRef.current.textContent.split("~~")[0]
                const duration = parseFloat(videoRef.current.textContent.split("~~")[1])
                const ttsDuration = parseFloat(videoRef.current.textContent.split("~~")[2])

                if(isNaN(duration) || isNaN(ttsDuration)) {
                    console.log("isNaN")
                } else {
                    window.socket.send(JSON.stringify({ type: 'playback', playback: duration / ttsDuration }));
                    console.log(duration, ttsDuration)
                    speech.init({
                        volume: muted ? 0.001 : 1.0,
                        lang: "en-GB",
                        rate: 1.1,
                        pitch: 1,
                        splitSentences: false,
                    }).then(data => {
                        speech.speak({
                            text: toRead,
                            queue: true, // don't interupt if not finished
                            listeners: {
                                onstart: (event) => {
                                    console.log(speech)
                                },
                                onend: (event) => {
                                    videoRef.current.spellcheck = false;
                                    window.socket.send(JSON.stringify({ type: 'playback', playback: 1 }));
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
        }

        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);

                if (captions !== videoRef.current.textContent) {
                    setCaptions(videoRef.current.textContent);
                    if (videoRef.current.spellcheck) {
                        handleReadOut();
                    }
                }
            }

            if (videoRef.current.paused) {
                speech.pause()
            } else {
                speech.resume()
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp, captions]);


    return (
        <div className="bg-black py-4 h-screen text-white text-center grid m-auto">
            <div className="pt-4">
                <a href="/" className="m-auto px-8 py-5 mx-3">Home 🏠</a>
                <a href="/slower_speech/control" className="m-auto px-8 py-5 mx-3">Controls ⚙</a>
            </div>
            <div className="mx-auto w-3/5 py-4">
                <button className="py-5 px-8" onClick={() => selectVideo("bbc_space")}>
                    BBC News
                </button>
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
            <div className="mx-auto w-3/5 py-4">
                <video id={video} ref={videoRef} muted={muted} className="h-full mx-auto" src={`/${video}/${video}.mp4`} type="video/mp4">
                    <track id="subtitles" label="English" kind="subtitles" srcLang="en" src={`/${video}/${video}.vtt`} />
                </video>
            </div>
            <div className="mx-auto w-3/5 text-center">
                <button className="py-5 px-8" onClick={handleMuted}>Mute {muted ? "🔇" : "🔊"}</button>
            </div>
        </div>
    );
}