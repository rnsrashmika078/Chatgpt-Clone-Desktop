import Sidebar from "../sidebar/Sidebar";
import {
    Fullscreen,
    Minimize2Icon,
    Pause,
    Play,
    Volume1Icon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    BiFastForward,
    BiFolderPlus,
    BiMoviePlay,
    BiPause,
    BiPlay,
    BiRepeat,
    BiShuffle,
    BiSkipNext,
    BiSkipPrevious,
} from "react-icons/bi";
import MusicImage from "@/assets/music/music.jpeg";
import { PiDotsThree } from "react-icons/pi";
import { FaSlash } from "react-icons/fa";
import { useActiveTab, useMusicPlayerStore } from "@/zustand/store";
import { metadata } from "@/types/type";
import Slider from "../slider/Slider";
import SearchArea from "../sidebar/SearchArea";
import Button from "@/components/Common/Button";
const Main = () => {
    const tab = useActiveTab((store) => store.tab);

    return (
        <div className="flex h-screen overflow-x-auto">
            <Sidebar />
            <div className="z-[9999] fixed bottom-0 bg-white w-full left-0 border">
                <PlayerController />
            </div>
            <div className="relative flex-[1] w-60 ml-14 sm:ml-64">
                <div className="mt-5">
                    <SearchArea />
                </div>

                {tab === "Music Library" && (
                    <div>
                        <MusicLibrary tab={tab} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Main;

const PlayerController = () => {
    const isRepeatOn = useMusicPlayerStore((store) => store.isRepeatOn);
    const isPause = useMusicPlayerStore((store) => store.isPause);
    const isShuffleOn = useMusicPlayerStore((store) => store.isShuffleOn);

    const setIsRepeatOn = useMusicPlayerStore((store) => store.setIsRepeatOn);
    const setIsPause = useMusicPlayerStore((store) => store.setIsPause);
    const setIsShuffleOn = useMusicPlayerStore((store) => store.setIsShuffleOn);
    const [isVolumeBarOpen, setIsVolumeBarOpen] = useState<boolean>(false);

    const iconSize = 26;
    const fallback = 22;
    const mainIcons = 50;
    const mainOption = [
        { name: "Shuffle", icon: <BiShuffle size={iconSize} /> },
        { name: "Previous", icon: <BiSkipPrevious size={iconSize} /> },
        { name: "SkipBack", icon: <BiFastForward size={iconSize} /> },
        { name: "Play/Pause", icon: <BiPlay size={mainIcons} /> },
        { name: "SkipForward", icon: <BiFastForward size={iconSize} /> },
        { name: "Next", icon: <BiSkipNext size={iconSize} /> },
        { name: "Repeat", icon: <BiRepeat size={iconSize} /> },
    ];
    const mobileFirstOption = [
        { name: "Previous", icon: <BiSkipPrevious size={iconSize} /> },
        { name: "Play/Pause", icon: <BiPlay size={mainIcons} /> },
        { name: "Next", icon: <BiSkipNext size={iconSize} /> },
        { name: "Volume", icon: <Volume1Icon size={fallback} /> },
        { name: "MiniPlayer", icon: <Minimize2Icon size={fallback} /> },
        { name: "Settings", icon: <PiDotsThree size={iconSize} /> },
    ];
    const secondaryOptions = [
        { name: "Volume", icon: <Volume1Icon size={fallback} /> },
        { name: "FullScreen", icon: <Fullscreen size={fallback} /> },
        { name: "MiniPlayer", icon: <Minimize2Icon size={fallback} /> },
        { name: "Settings", icon: <PiDotsThree size={iconSize} /> },
    ];

    const handleOnClick = (option: string) => {
        switch (option) {
            case "Play/Pause": {
                setIsPause();
                break;
            }
            case "Shuffle": {
                setIsShuffleOn();
                break;
            }
            case "Repeat": {
                setIsRepeatOn();
                break;
            }
            case "Volume": {
                setIsVolumeBarOpen((prev) => !prev);
                break;
            }
        }
    };
    const currentSong = useMusicPlayerStore((store) => store.currentSong);
    const setSongDuration = useMusicPlayerStore(
        (store) => store.setSongDuration
    );
    const songDuration = useMusicPlayerStore((store) => store.songDuration);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [songURL, setSongURL] = useState<string | null>(null);
    const [metadata, setMetaData] = useState<metadata>();
    const [currentTime, setCurrentTime] = useState<number>();

    async function showMetadata(filePath: string) {
        if (!filePath) return;

        try {
            // Use the exposed ipcRenderer.invoke
            const metadata: metadata = await window.ipcRenderer.invoke(
                "get-metadata",
                filePath
            );
            setMetaData(metadata);
        } catch (err) {
            console.error("Failed to get metadata:", err);
        }
    }

    useEffect(() => {
        if (currentSong) {
            showMetadata(currentSong.path);
        }
    }, [currentSong]);
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPause) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    }, [isPause, songURL]);

    useEffect(() => {
        if (currentSong) {
            const url = URL.createObjectURL(currentSong);
            setSongURL(url);

            // cleanup previous object URL
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [currentSong]);

    const [title, setTitle] = useState<string | undefined>(undefined);
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            const d = audioRef.current.duration;
            // const durInMin = Math.floor(d / 60);
            if (!isNaN(d)) {
                setSongDuration(d);
            }
        }
    };

    function formatTime(seconds: number): string {
        if (isNaN(seconds)) return "0:00";

        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    useEffect(() => {
        if (!metadata) return;
        const title = metadata?.title ? metadata?.title : currentSong?.name;

        setTitle(title);
    }, [title, metadata]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const [length, setLength] = useState<number>();
    useEffect(() => {
        if (!currentTime) return;
        if (!songDuration) return;

        const clamp = (currentTime / songDuration) * 100;
        setLength(clamp);
    }, [currentTime, songDuration]);

    return (
        <div className="flex justify-between px-5 relative  items-center gap-2  py-3">
            {/* start div */}
            {/* player */}
            <div
                className="absolute bg-red-500 border-2 -top-2 left-0"
                style={{
                    width: `${length}%`,
                }}
            ></div>
            {songURL && (
                <audio
                    ref={audioRef}
                    src={songURL}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                />
            )}
            <div className=" flex items-center gap-2  flex-shrink-0">
                {/* <div className="absolute -top-64 left-5 h-60 w-60 border rounded-md border-gray-200 shadow-md">
                    <img
                        src={metadata?.picture ? metadata.picture : MusicImage}
                        className="h-full w-fit flex-shrink-0 rounded-md"
                        alt="Logo"
                    />
                </div> */}
                <div className="left-5 h-16 w-16 border rounded-md border-gray-200 shadow-md">
                    <img
                        src={metadata?.picture ? metadata.picture : MusicImage}
                        className="h-full w-fit flex-shrink-0 rounded-md"
                        alt="Logo"
                    />
                </div>
                <div className="transition-all w-60 sm:w-72 md:w-36  lg:w-[18rem] xl:w-[28rem] truncate">
                    <h1 className="text-xl">{title}</h1>
                    <p className="">
                        {metadata?.artist ? metadata.artist : null}
                    </p>
                </div>
            </div>
            {/* center div  */}
            <div className=" md:absolute md:left-1/2 md:transform md:-translate-x-1/2 flex gap-5 md:gap-1 justify-end items-center ">
                {/* <div className="flex justify-center items-center gap-3"> */}
                {mainOption.map((option, index) => (
                    <div
                        key={index}
                        className={`relative items-center hidden md:block ${
                            option.name === "SkipBack"
                                ? "hidden md:block -scale-x-100"
                                : "scale-x-100"
                        }`}
                        onClick={() => handleOnClick(option.name)}
                    >
                        {option.name === "Play/Pause" ? (
                            isPause ? (
                                <span className="">{option.icon}</span>
                            ) : (
                                <>
                                    <span className="">
                                        <BiPause size={mainIcons} />
                                    </span>
                                </>
                            )
                        ) : option.name === "Shuffle" ? (
                            isShuffleOn ? (
                                <span className="">{option.icon}</span>
                            ) : (
                                <>
                                    <span className="">{option.icon}</span>
                                    <span className="absolute left-0 top-0 -rotate-12">
                                        <FaSlash size={25} />
                                    </span>
                                </>
                            )
                        ) : option.name === "Repeat" ? (
                            isRepeatOn ? (
                                <span className="">{option.icon}</span>
                            ) : (
                                <>
                                    <span className="">{option.icon}</span>
                                    <span className="absolute left-0 top-0 -rotate-12">
                                        <FaSlash size={25} />
                                    </span>
                                </>
                            )
                        ) : option.name === "" ? (
                            isRepeatOn ? (
                                <span className="">{option.icon}</span>
                            ) : (
                                <div className="">
                                    <span className="">{option.icon}</span>
                                    <span className="absolute left-0 top-0 -rotate-12">
                                        <FaSlash size={25} />
                                    </span>
                                </div>
                            )
                        ) : (
                            <span className="">{option.icon}</span>
                        )}
                    </div>
                ))}
                {/* Mobile first */}
                {mobileFirstOption.map((option, index) => (
                    <div
                        key={index}
                        className={`relative items-center block md:hidden `}
                        onClick={() => handleOnClick(option.name)}
                    >
                        {option.name === "Play/Pause" ? (
                            isPause ? (
                                <span className="">{option.icon}</span>
                            ) : (
                                <>
                                    <span className="">
                                        <BiPause size={mainIcons} />
                                    </span>
                                </>
                            )
                        ) : option.name === "Shuffle" ? (
                            isShuffleOn ? (
                                <span className="">{option.icon}</span>
                            ) : (
                                <>
                                    <span className="">{option.icon}</span>
                                    <span className="absolute left-0 top-0 -rotate-12">
                                        <FaSlash size={25} />
                                    </span>
                                </>
                            )
                        ) : option.name === "Repeat" ? (
                            isRepeatOn ? (
                                <span className="">{option.icon}</span>
                            ) : (
                                <>
                                    <span className="">{option.icon}</span>
                                    <span className="absolute left-0 top-0 -rotate-12">
                                        <FaSlash size={25} />
                                    </span>
                                </>
                            )
                        ) : option.name === "" ? (
                            isRepeatOn ? (
                                <span className="">{option.icon}</span>
                            ) : (
                                <div className="">
                                    <span className="">{option.icon}</span>
                                    <span className="absolute left-0 top-0 -rotate-12">
                                        <FaSlash size={25} />
                                    </span>
                                </div>
                            )
                        ) : (
                            <span className="">{option.icon}</span>
                        )}
                    </div>
                ))}
            </div>
            {/* end div  */}
            <div className=" flex justify-center items-center gap-5">
                {secondaryOptions.map((option, index) => (
                    <div
                        key={index}
                        className={` hidden md:block items-center`}
                        onClick={() => handleOnClick(option.name)}
                    >
                        {isVolumeBarOpen && option.name === "Volume" && (
                            <div className="absolute top-0 ">
                                <Slider />
                            </div>
                        )}
                        <span className="">{option.icon}</span>
                    </div>
                ))}
                {/* Mobile first  */}
            </div>
        </div>
    );
};
const MusicLibrary = ({ tab }: { tab: string }) => {
    const setCurrentPlayingSong = useMusicPlayerStore(
        (store) => store.setCurrentPlayingSong
    );
    const currentSong = useMusicPlayerStore((store) => store.currentSong);

    const [files, setFiles] = useState<File[]>([]);

    const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList) {
            const fileArray = Array.from(fileList);
            setFiles(fileArray);
        }
    };

    const inputRef = useRef<HTMLInputElement | null>(null);
    const openLibraryUpload = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    return (
        <div className="relative">
            <div
                className={`${
                    files.length > 0 ? "justify-between" : "justify-start "
                } flex items-center mx-5`}
            >
                <div>
                    {" "}
                    <h1 className="font-bold text-4xl mt-5">{tab}</h1>
                </div>
                {files.length > 0 && (
                    <div>
                        <Button
                            onClick={openLibraryUpload}
                            size="xs"
                            name="Add Folder"
                            radius="md"
                        >
                            <BiFolderPlus size={20} />
                        </Button>
                    </div>
                )}
            </div>{" "}
            <input
                type="file"
                ref={inputRef}
                // @ts-ignore
                webkitdirectory="true"
                onChange={handleFolderChange}
                className="hidden"
            />
            <div className="mt-3">
                {files
                    .filter((file) => file.type.startsWith("audio/"))
                    .map((file, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between bg-gray-200 p-2 rounded-md mx-2  gap-2 items-center mb-2 px-5 py-2"
                        >
                            <div className="flex gap-5">
                                <p className="rounded-full h-5 w-5 p-3 bg-white flex justify-center items-center">
                                    {idx + 1}
                                </p>
                                <p className="">{file.name}</p>
                            </div>
                            <div>
                                <Button
                                    variant="dark"
                                    size="xs"
                                    radius="md"
                                    onClick={() => setCurrentPlayingSong(file)}
                                >
                                    {currentSong?.name === file.name ? (
                                        <Pause size={20} />
                                    ) : (
                                        <Play size={20} />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
            </div>
            {files.length === 0 && (
                <div className="relative h-full">
                    <EmptyMusic openLibraryUpload={openLibraryUpload} />
                </div>
            )}
        </div>
    );
};
interface Music {
    openLibraryUpload: () => void;
}

const EmptyMusic = ({ openLibraryUpload }: Music) => {
    return (
        <div className="flex items-center justify-center h-full flex-col gap-2">
            <h1 className="font-bold text-2xl">No Music Found!</h1>
            <div>
                <Button
                    onClick={openLibraryUpload}
                    size="xs"
                    name="Add Folder"
                    radius="md"
                >
                    <BiFolderPlus size={20} />
                </Button>
            </div>
        </div>
    );
};
