import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import { useLocation } from 'react-router-dom';
import 'swiper/css';
import './ReelsPage.css';
import { getReels, getReelById } from '../services/ReelsServices';
import ClipLoader from 'react-spinners/ClipLoader';

const ReelsPage = () => {
  const { reelId } = useParams(); // Get the current reel ID from the URL
  const navigate = useNavigate(); // For updating the URL
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const videoRefs = useRef([]); // To store references to video elements
  const [reels, setReels] = useState([]);
  const [isReelsLoading, setisReelsLoading] = useState(true);
  const location = useLocation();

  // Fetch reels data and manage the state
  useEffect(() => {
    const updateReels = async () => {
      setisReelsLoading(true); // Start loading state
      let initialIndex = 0;
      console.log('Location state:', location.state);

      try {
        // Use content from location state if available
        if (location.state?.reels) {
          setReels(location.state.reels);
          const reelIndex = location.state.reels.findIndex(
            (reel) => reel.id === reelId
          );
          initialIndex = reelIndex !== -1 ? reelIndex : 0;
          setCurrentReelIndex(initialIndex);
        } else if (reelId) {
          // Fetch reel by ID if `reelId` is provided
          const reel = await getReelById(reelId);
          if (reel) {
            const randomReels = await getReels();
            setReels([reel, ...randomReels.filter((r) => r.id !== reelId)]);
          } else {
            const randomReels = await getReels();
            setReels(randomReels);
          }
        } else {
          // Fetch random reels if no specific `reelId` is provided
          const randomReels = await getReels();
          setReels(randomReels);
        }
        setCurrentReelIndex(initialIndex);
      } catch (error) {
        console.error('Error fetching reels:', error);
      } finally {
        setisReelsLoading(false); // Ensure loading state is stopped
      }
    };

    updateReels();
  }, [reelId]); // Removed location.state to avoid unnecessary re-renders

  // Handle video playback when the slide changes
  const handleSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;

    if (newIndex !== currentReelIndex) {
      // Pause the previous video
      videoRefs.current[currentReelIndex]?.pause(); // Reset to start

      // Play the new video
      videoRefs.current[newIndex]?.play();

      setCurrentReelIndex(newIndex);
      const newReelID = reels[newIndex]?.id;
      if (newReelID) {
        navigate(`/reels/${newReelID}`, { replace: true, state: { reels } }); // Update the URL without adding to history
      }
    }
  };

  // Automatically play the video when the component is mounted or `currentReelIndex` changes
  useEffect(() => {
    if (!isReelsLoading && videoRefs.current[currentReelIndex]) {
      videoRefs.current[currentReelIndex].play();
    }
  }, [currentReelIndex, isReelsLoading]);

  // Pause video on window blur and resume on focus
  useEffect(() => {
    const handleWindowBlur = () => {
      videoRefs.current[currentReelIndex]?.pause();
    };

    const handleWindowFocus = () => {
      videoRefs.current[currentReelIndex]?.play();
    };

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [currentReelIndex]);

  // Toggle play/pause on video click
  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  return (
    <div className="reels-page">
      {isReelsLoading ? (
        <ClipLoader loading={isReelsLoading} color="white" />
      ) : (
        <Swiper
          direction={'vertical'}
          mousewheel={true}
          onSlideChange={handleSlideChange}
          modules={[Mousewheel]}
          className="mySwiper"
          initialSlide={currentReelIndex}
        >
          {reels.map((reel, index) => (
            <SwiperSlide key={reel.id} className="">
              <div className="reel-container">
                <video
                  className="reel-video"
                  src={reel.link}
                  poster={reel.url}
                  playsInline
                  ref={(el) => (videoRefs.current[index] = el)} // Store video ref
                  onClick={() => togglePlayPause(index)} // Toggle play/pause on click
                  autoPlay={index === currentReelIndex} // Auto-play the current video
                />
                <div className="reel-details">
                  <div className="profile-container">
                    <img
                      className="profile-image"
                      src={reel.url}
                      alt={reel.description}
                    />
                    <p className="profile-name">Reel Name</p>
                  </div>
                  <p className="reel-description">{reel.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ReelsPage;



// chatgpt generated
// import React, { useEffect, useState, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Mousewheel } from 'swiper/modules';
// import { useLocation } from 'react-router-dom';
// import 'swiper/css';
// import './ReelsPage.css';
// import { getReels, getReelById } from '../services/ReelsServices';
// import ClipLoader from 'react-spinners/ClipLoader';

// const ReelsPage = () => {
//   const { reelId } = useParams(); // Get the current reel ID from the URL
//   const navigate = useNavigate(); // For updating the URL
//   const [currentReelIndex, setCurrentReelIndex] = useState(0);
//   const videoRefs = useRef([]); // To store references to video elements
//   const [reels, setReels] = useState([]);
//   const [isReelsLoading, setisReelsLoading] = useState(true);
//   const location = useLocation();

//   // Fetch reels data and manage the state
//   useEffect(() => {
//     const updateReels = async () => {
//       setisReelsLoading(true); // Start loading state
//       let initialIndex = 0;
//       console.log('Location state:', location.state);

//       try {
//         // Use content from location state if available
//         if (location.state?.reels) {
//           setReels(location.state.reels);
//           const reelIndex = location.state.reels.findIndex(
//             (reel) => reel.id === reelId
//           );
//           initialIndex = reelIndex !== -1 ? reelIndex : 0;
//           setCurrentReelIndex(initialIndex);
//         } else if (reelId) {
//           // Fetch reel by ID if `reelId` is provided
//           const reel = await getReelById(reelId);
//           if (reel) {
//             const randomReels = await getReels();
//             setReels([reel, ...randomReels.filter((r) => r.id !== reelId)]);
//           } else {
//             const randomReels = await getReels();
//             setReels(randomReels);
//           }
//         } else {
//           // Fetch random reels if no specific `reelId` is provided
//           const randomReels = await getReels();
//           setReels(randomReels);
//         }
//         setCurrentReelIndex(initialIndex);
//       } catch (error) {
//         console.error('Error fetching reels:', error);
//       } finally {
//         setisReelsLoading(false); // Ensure loading state is stopped
//       }
//     };

//     updateReels();
//   }, [reelId]); // Removed location.state to avoid unnecessary re-renders

//   // Handle video playback when the slide changes
//   const handleSlideChange = (swiper) => {
//     const newIndex = swiper.activeIndex;

//     if (newIndex !== currentReelIndex) {
//       // Pause the previous video
//       videoRefs.current[currentReelIndex]?.pause(); // Reset to start

//       // Play the new video
//       videoRefs.current[newIndex]?.play();

//       setCurrentReelIndex(newIndex);
//       const newReelID = reels[newIndex]?.id;
//       if (newReelID) {
//         navigate(`/reels/${newReelID}`, { replace: true, state: { reels } }); // Update the URL without adding to history
//       }
//     }
//   };

//   // Automatically play the video when the component is mounted or `currentReelIndex` changes
//   useEffect(() => {
//     if (!isReelsLoading && videoRefs.current[currentReelIndex]) {
//       videoRefs.current[currentReelIndex].play();
//     }
//   }, [currentReelIndex, isReelsLoading]);

//   // Pause video on window blur and resume on focus
//   useEffect(() => {
//     const handleWindowBlur = () => {
//       videoRefs.current[currentReelIndex]?.pause();
//     };

//     const handleWindowFocus = () => {
//       videoRefs.current[currentReelIndex]?.play();
//     };

//     window.addEventListener('blur', handleWindowBlur);
//     window.addEventListener('focus', handleWindowFocus);

//     return () => {
//       window.removeEventListener('blur', handleWindowBlur);
//       window.removeEventListener('focus', handleWindowFocus);
//     };
//   }, [currentReelIndex]);

//   // Toggle play/pause on video click
//   const togglePlayPause = (index) => {
//     const video = videoRefs.current[index];
//     if (video) {
//       if (video.paused) {
//         video.play();
//       } else {
//         video.pause();
//       }
//     }
//   };

//   // Handle redirect to the store page when clicking on the image or the reel name
//   const redirectToStore = (storeId) => {
//     navigate(`/store/${storeId}`); // Replace `storeId` with actual store ID if available
//   };

//   return (
//     <div className="reels-page">
//       {isReelsLoading ? (
//         <ClipLoader loading={isReelsLoading} color="white" />
//       ) : (
//         <Swiper
//           direction={'vertical'}
//           mousewheel={true}
//           onSlideChange={handleSlideChange}
//           modules={[Mousewheel]}
//           className="mySwiper"
//           initialSlide={currentReelIndex}
//         >
//           {reels.map((reel, index) => (
//             <SwiperSlide key={reel.id} className="">
//               <div className="reel-container">
//                 <video
//                   className="reel-video"
//                   src={reel.link}
//                   poster={reel.url}
//                   playsInline
//                   ref={(el) => (videoRefs.current[index] = el)} // Store video ref
//                   onClick={() => togglePlayPause(index)} // Toggle play/pause on click
//                   autoPlay={index === currentReelIndex} // Auto-play the current video
//                 />
//                 <div className="reel-details">
//                   <div
//                     className="profile-container"
//                     onClick={() => redirectToStore(reel.storeId)} // Redirect on profile image click
//                   >
//                     <img
//                       className="profile-image"
//                       src={reel.url}
//                       alt={reel.description}
//                     />
//                     <p
//                       className="profile-name"
//                       onClick={() => redirectToStore(reel.storeId)} // Redirect on reel name click
//                     >
//                       {reel.storeName}
//                     </p>
//                   </div>
//                   <p className="reel-description">{reel.description}</p>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       )}
//     </div>
//   );
// };

// export default ReelsPage;
