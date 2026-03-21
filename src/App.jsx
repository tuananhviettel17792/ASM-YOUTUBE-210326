import React, { useState, useEffect } from 'react';
import youtube from './api/youtube';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import VideoModal from './components/VideoModal';

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('ReactJS tutorial'); // Tìm mặc định

  // Lưu token phân trang
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);

  // Hàm gọi API
  const fetchVideos = async (query, pageToken = '') => {
    setLoading(true);
    try {
      const response = await youtube.get('/search', {
        params: {
          q: query,
          pageToken: pageToken
        }
      });
      setVideos(response.data.items);
      setNextPageToken(response.data.nextPageToken || null);
      setPrevPageToken(response.data.prevPageToken || null);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chạy lần đầu khi load trang
  useEffect(() => {
    fetchVideos(searchTerm);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchVideos(term);
  };

  const handlePageChange = (direction) => {
    const token = direction === 'next' ? nextPageToken : prevPageToken;
    if (token) {
      fetchVideos(searchTerm, token);
      window.scrollTo(0, 0); // Cuộn lên đầu trang khi qua trang mới
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 pb-10">
        <nav className="bg-white shadow-sm py-4 sticky top-0 z-40">
          <h1 className="text-center text-2xl font-bold text-red-600">MyTube Search</h1>
        </nav>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
            <div className="flex justify-center my-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        ) : (
            <VideoList
                videos={videos}
                onVideoSelect={(video) => setSelectedVideo(video)}
                onPageChange={handlePageChange}
                hasNextPage={!!nextPageToken}
                hasPrevPage={!!prevPageToken}
            />
        )}

        {/* Modal hiển thị khi có video được chọn */}
        <VideoModal
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
        />
      </div>
  );
}

export default App;