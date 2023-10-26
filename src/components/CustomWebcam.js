import { useCallback, useRef, useState, useEffect } from "react"; // import useCallback
import Webcam from "react-webcam";
import * as htmlToImage from 'html-to-image';
import '../styles/CustomWebcam.css'
import CollageCountdown from "./CollageCountdown";
import FilterButtons from "./FilterButtons";
import cameraAudio from '../styles/camera-audio.mp3'

const CustomWebcam = () => {
    const audioRef = useRef(null); // audio reference 
    const webcamRef = useRef(null); // create a webcam reference
    const [imgSrc, setImgSrc] = useState(null); // initialize image
    const [mirrored, setMirrored] = useState([]); //Initialize mirrored state
    const [countdown, setCountdown] = useState(0); // To store the countdown time
    const [countdownActive, setCountdownActive] = useState(false); // State to track if the countdown is active
    const [showCountdown, setShowCountdown] = useState(false);// State to show/hide countdown options
    const [showCollage, setShowCollage] = useState(false); // State to show/hide collage options
    const [capturedPhotos, setCapturedPhotos] = useState([]); // State to store captured photos
    const [capturedPhotosStyle, setCapturedPhotosStyle] = useState([]);
    const [selectedGrid, setSelectedGrid] = useState(4); // State to store the selected grid size
    const [selectedButton, setSelectedButton] = useState(null);  // State to store the selected button
    const [collageActive, setCollageActive] = useState(false); // State to track if collage is active
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [showFilterButtons, setShowFilterButtons] = useState(false);
    const [filter, setFilter] = useState("filter-none");

    // Capture a photo using the webcam
    const capture = useCallback(() => {
        audioRef.current.play();
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef]);

    // Initiate the collage function
    const collage = useCallback(() => {
        setCollageActive(true);
        setCameraEnabled(false); // Disable the camera

        // Capture a photo using the webcam after a delay
        if (webcamRef.current) {
            setTimeout(() => {
                const imageSrc = webcamRef.current.getScreenshot();
                setCapturedPhotosStyle((capturedPhotosStyle) => [...capturedPhotosStyle, filter]);
                setCapturedPhotos((prevPhotos) => [...prevPhotos, imageSrc]);
                audioRef.current.play();
                setCollageActive(false);
                setCameraEnabled(true);
            }, 3000); // Delay of 3 seconds
        }
    }, [webcamRef, filter]);

    // Initiate the photo retake process
    const retake = () => {
        setImgSrc(null);
        setCapturedPhotos([]);
    };

    // Select the grid size for the collage
    const selectGrid = (grid) => {
        if (selectedButton === grid) {
            setSelectedGrid(0); // Deselect the grid
            setSelectedButton(null); // Deselect the button
        } else {
            setSelectedGrid(grid);
            setSelectedButton(grid);
        }
    };

    // Toggle the mirrored state
    const toggleMirror = () => {
        setMirrored(!mirrored);
    };

    const applyFilter = (filter) => {
        setFilter(filter);
    };

    const removeFilter = () => {
        setFilter("filter-none"); // Reset to default filter when removing
    };
    // Initiate the download process for photos
    const downloadSingle = () => {
        if (imgSrc) {
            const downloadFileName = `family-day-gfis.jpg`;

            const img = new Image();
            img.src = imgSrc;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                // Apply the filter
                if (filter !== "filter-none") { // Check if filter is not default
                    ctx.filter = window.getComputedStyle(document.querySelector('.photo-preview img')).filter;
                }

                // Draw the image with the applied filter
                ctx.drawImage(img, 0, 0, img.width, img.height);

                // Convert the canvas content to a data URL
                const filteredImgSrc = canvas.toDataURL('image/jpeg', 0.8);

                const a = document.createElement('a');
                a.href = filteredImgSrc;
                a.download = downloadFileName;
                a.click();
            };
        }
    };

    const downloadCollage = () => {
        // Download the collage if photos are captured
        const photoGrid = document.querySelector(".photo-grid");
        htmlToImage.toJpeg(photoGrid)
            .then(function (dataUrl) {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = 'family_day.jpeg';
                a.click();
            });
    };

    // Apply filter to all images in the collage

    const startCountdown = (seconds) => {
        setCountdown(seconds);
        setCountdownActive(true);
        setShowCountdown(false);
    };

    const stopCountdown = () => {
        setCountdownActive(false);
    };

    // to show/hide countdown options
    const handleTimerClick = () => {
        setShowCountdown((prev) => !prev); // Toggle the countdown options display
    };

    // to show/hide collage options
    const handleColumnsClick = () => {
        setShowCollage((prev) => !prev); // Display/hide options
    };

    const toggleFilterButtons = () => {
        setShowFilterButtons((prev) => !prev);
    };



    // Effect for countdown
    useEffect(() => {
        let timer;
        if (countdownActive && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdownActive && countdown === 0) {
            audioRef.current.play();
            capture();
            stopCountdown();
        }
        return () => clearInterval(timer);
    }, [countdown, countdownActive, capture]);

    return (
        <div className="container-box">
            <audio ref={audioRef} src={cameraAudio} />
            <div className="container" >
                <div className={`navbar ${capturedPhotos.length > 0 ? "hidden" : ""}`}>
                    {!imgSrc && (
                        <>
                            <button
                                onClick={handleTimerClick}
                                className={showCountdown ? "active" : ""}
                                disabled={imgSrc !== null}
                            >
                                <i className="bi bi-stopwatch"></i>
                            </button>
                            {showCountdown && (
                                <>
                                    <button onClick={() => startCountdown(3)} ><i className="bi bi-3-circle-fill"></i></button>
                                    <button onClick={() => startCountdown(5)} ><i className="bi bi-5-circle-fill"></i></button>
                                </>
                            )}

                            <button onClick={handleColumnsClick}><i className="bi bi-columns"></i></button>

                            {showCollage && (
                                <>
                                    <button
                                        onClick={() => selectGrid(4)}
                                        className={selectedButton === 4 ? "selected" : ""}
                                    >
                                        <i className="bi bi-4-square-fill"></i>
                                    </button>
                                    <button
                                        onClick={() => selectGrid(6)}
                                        className={selectedButton === 6 ? "selected" : ""}
                                    >
                                        <i className="bi bi-6-square-fill"></i>
                                    </button>
                                </>
                            )}

                            <button onClick={toggleFilterButtons}><i className="bi bi-magic"></i></button>
                            <button onClick={toggleMirror}><i className="bi bi-symmetry-vertical"></i></button>
                        </>
                    )}
                </div>

                {showFilterButtons && (<FilterButtons applyFilter={applyFilter} removeFilter={removeFilter} />)}

                {imgSrc ? (
                    <div className="photo-preview">
                        <img src={imgSrc} alt="webcam" className={filter} />
                    </div>
                ) : (
                    <Webcam
                        height={400}
                        width={700}
                        ref={webcamRef}
                        mirrored={mirrored}
                        screenshotFormat="image/jpeg" //image format
                        screenshotQuality={1.0} //image quality
                        className={filter} />
                )}

                {countdownActive && countdown > 0 && (
                    <div className="countdown">{countdown}</div>
                )}

                {collageActive && (
                    <CollageCountdown seconds={3} photoTaken={true} />
                )}

                {selectedButton === 4 || selectedButton === 6 ? null : (
                    <div className="btn">
                        {countdownActive ? ( // Disable the button during countdown
                            <button disabled style={{
                                backgroundColor: 'grey', color: 'lightgrey',
                            }}>
                                <i className="bi bi-camera-fill"></i>
                            </button>
                        ) : (
                            imgSrc ? (
                                <>
                                    <button onClick={retake}><i className="bi bi-arrow-clockwise"></i></button>
                                    <button onClick={downloadSingle}><i className="bi bi-floppy2"></i></button>
                                </>
                            ) : (
                                <button onClick={capture}><i className="bi bi-camera-fill"></i></button>
                            )
                        )}
                    </div>
                )}

                <div className="btn">
                    {capturedPhotos.length < selectedGrid && (selectedButton === 4 || selectedButton === 6) &&
                        (
                            <button onClick={collage} disabled={!cameraEnabled}
                                style={{ backgroundColor: !cameraEnabled ? 'grey' : '', color: !cameraEnabled ? 'lightgrey' : '' }}>
                                <i className="bi bi-camera-fill"></i></button>

                        )}

                    {capturedPhotos.length === selectedGrid && (
                        <>
                            {(selectedButton === 4 || selectedButton === 6) && (
                                <>
                                    <button onClick={retake}><i className="bi bi-arrow-clockwise"></i></button>
                                    <button onClick={downloadCollage}><i className="bi bi-floppy2"></i> </button>

                                </>
                            )}
                        </>
                    )}
                </div>

                <div className="photo-grid">
                    {capturedPhotos.map((photo, index) => (
                        <div key={index} className="photo-cell">
                            <img className={capturedPhotosStyle[index]} src={photo} alt={`Captured ${index}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default CustomWebcam;