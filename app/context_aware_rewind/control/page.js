'use client';

import { useEffect, useRef, useState } from "react";

import bbc_space_captions from "/public/bbc_space/bbc_space.json";
import university_challenge_captions from "/public/university_challenge/university_challenge.json"
import the_chase_captions from "/public/the_chase/the_chase.json"
import industry_captions from "/public/industry/industry.json"
import devil_wears_prada_captions from "/public/devil_wears_prada/devil_wears_prada.json"


export default function Page() {
    const [timestamp, setTimestamp] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
    const [video, setVideo] = useState("bbc_space");
    const [complexIndex, setComplexIndex] = useState([]);
    const [captions, setCaptions] = useState(bbc_space_captions.captions);

    const videoRef = useRef(null);

    const convertTime = (t) => {
        const text = t.split(":")
        return (parseInt(text[0], 10) * 60 * 60) + (parseInt(text[1], 10) * 60) + parseFloat(text[2])
    }

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

    const handleBack10 = () => {
        const time = videoRef.current.currentTime - 10;
        window.socket.send(JSON.stringify({ type: 'back10', time: time }));
    }

    const handleSmartBack = () => {
        console.log(captions)
        if (currentCaptionIndex > 0) {
            let newTime = 0;
            let newIndex = 0;

            for (const index of complexIndex) {
                if (complexIndex.length === 0) {
                    newIndex = 0;
                } else if (complexIndex.length === 1) {
                    if (currentCaptionIndex < complexIndex[0]) {
                        newIndex = 0
                    } else {
                        newIndex = complexIndex[0];
                    }
                } else if (index > currentCaptionIndex) {
                    newIndex = complexIndex[complexIndex.indexOf(index) - 1];
                    console.log(index, newIndex)
                    break;
                } else {
                    newIndex = complexIndex.at(-1);
                }
            }

            console.log(currentCaptionIndex, newIndex, complexIndex)

            if (video === "bbc_space" && newIndex) {
                newTime = convertTime(captions[newIndex].start);
            } else if (video === "university_challenge" && newIndex) {
                newTime = convertTime(captions[newIndex].start);
            }

            setCurrentCaptionIndex(newIndex);
            setTimestamp(newTime);
            window.socket.send(JSON.stringify({ type: 'seek', time: newTime }));
            window.socket.send(JSON.stringify({ type: 'pause' }));
        }

    }

    useEffect(() => {
        if (videoRef.current.duration) {
            setDuration(videoRef.current.duration);
        }

        const checkTime = () => {
            if (videoRef.current.currentTime !== timestamp) {
                setTimestamp(videoRef.current.currentTime);
            }

            if ((new Set(complexIndex)).size !== complexIndex.length) {
                const noDuplicates = new Set(complexIndex)
                setComplexIndex(Array.from(noDuplicates))
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
    }, [timestamp, video, duration, complexIndex]);

    useEffect(() => {
        setComplexIndex([]);
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
    }, [video])

    useEffect(() => {
        // if (video === "bbc_space") {
        //     for (const element of bbc_space_captions.captions) {
        //         const currentIndex = bbc_space_captions.captions.indexOf(element);

        //         if (parseInt(element.flesch_kincaid) > 8 && complexIndex.includes(currentIndex) === false) {
        //             setComplexIndex(complexIndex => [...complexIndex, currentIndex])
        //         }

        //         if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
        //             setCurrentCaptionIndex(currentIndex);
        //         }
        //     }
        // } else if (video === "university_challenge") {
        //     for (const element of university_challenge_captions.captions) {
        //         const currentIndex = university_challenge_captions.captions.indexOf(element);

        //         if (parseInt(element.flesch_kincaid) > 8 && complexIndex.includes(currentIndex) === false) {
        //             setComplexIndex(complexIndex => [...complexIndex, currentIndex])
        //         }

        //         if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
        //             setCurrentCaptionIndex(currentIndex);
        //         }
        //     }
        // }
        for (const element of captions) {
            const currentIndex = captions.indexOf(element);

            if (parseInt(element.flesch_kincaid) > 8 && complexIndex.includes(currentIndex) === false) {
                setComplexIndex(complexIndex => [...complexIndex, currentIndex])
            }

            if (parseFloat(convertTime(element.start)) < timestamp && parseFloat(convertTime(element.end)) >= timestamp) {
                setCurrentCaptionIndex(currentIndex);
            }
        }
    }, [captions, complexIndex, timestamp, video])

    useEffect(() => {
        let captions = ""
        if (video === "bbc_space") {
            captions = bbc_space_captions.captions
        } else if (video === "university_challenge") {
            captions = university_challenge_captions.captions
        }
    }, [timestamp, video])

    return (
        <div className="bg-black py-4 h-screen text-white text-center grid grid-rows-3 auto-rows-max m-auto">
            <div className="pt-4">
                <a className="m-auto px-8 py-5 mx-3" href="/">Home 🏠</a>
                <a className="m-auto px-8 py-5 mx-3" href="/slower_subtitles/player">Player 📺</a>
            </div>
            <video ref={videoRef} controls muted className="mx-auto w-3/5 hidden" src={`/${video}/${video}.mp4`} type="video/mp4">
                <track id="subtitles" label="English" kind="subtitles" srcLang="en" src={`/${video}/${video}_simplified.vtt`} />
            </video>
            <div className="mx-auto w-3/5 py-4 text-center row-span-1 flex flex-col">
                <div className="pb-6 grid grid-cols">
                    <button className="px-8 py-5" onClick={handleSmartBack}>⏪ Smart Back</button>
                </div>
            </div>
            <div className="mx-auto w-3/5 py-4">
                <div className="pb-6 grid grid-cols-3">
                    <button className="px-8 py-5" onClick={handleBack10}>⬅ Back 10s</button>
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