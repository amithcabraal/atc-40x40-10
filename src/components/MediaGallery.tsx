import React, { useState, useRef, useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { Media } from '../types';

interface Props {
  media: Media[];
  theme?: 'light' | 'dark';
}

export const MediaGallery: React.FC<Props> = ({ media, theme = 'light' }) => {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});

  useEffect(() => {
    // Generate thumbnails for videos that don't have explicit thumbnails
    media.forEach((item) => {
      if (item.type === 'video' && !item.thumbnail) {
        const video = document.createElement('video');
        video.src = item.url;
        video.crossOrigin = "anonymous"; // Add this line
        video.addEventListener('loadeddata', () => {
          video.currentTime = 0; // Seek to the first frame
        });
        video.addEventListener('seeked', () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0);
            setThumbnails(prev => ({
              ...prev,
              [item.url]: canvas.toDataURL()
            }));
          } catch (error) {
            console.error('Error generating thumbnail:', error);
          }
        });
        video.addEventListener('error', (e) => {
          console.error('Error loading video:', e);
        });
      }
    });
  }, [media]);

  const handleClose = () => {
    setSelectedMedia(null);
    // Pause all videos when closing the modal
    Object.values(videoRefs.current).forEach(video => video.pause());
  };

  if (!media?.length) return null;

  return (
    <>
      <div className="flex gap-2 overflow-x-auto py-2 px-1">
        {media.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedMedia(item)}
            className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {item.type === 'video' ? (
              <>
                <video
                  ref={el => {
                    if (el) videoRefs.current[item.url] = el;
                  }}
                  src={item.url}
                  className="w-full h-full object-cover"
                  poster={item.thumbnail || thumbnails[item.url]}
                  preload="metadata"
                  onError={(e) => console.error('Error loading video thumbnail:', e)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </>
            ) : (
              <img
                src={item.thumbnail || item.url}
                alt={item.title || `Media ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => console.error('Error loading image:', e)}
              />
            )}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={handleClose}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            {selectedMedia.type === 'video' ? (
              <video
                ref={el => {
                  if (el) videoRefs.current[selectedMedia.url] = el;
                }}
                controls
                autoPlay
                className="w-full rounded-lg"
                src={selectedMedia.url}
                poster={selectedMedia.thumbnail || thumbnails[selectedMedia.url]}
                onError={(e) => console.error('Error playing video:', e)}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title || 'Exercise demonstration'}
                className="w-full rounded-lg"
                onError={(e) => console.error('Error loading image:', e)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};