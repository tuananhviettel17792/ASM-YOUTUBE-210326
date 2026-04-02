import React, { useState, useEffect } from 'react';
import youtube from './api/youtube';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import VideoModal from './components/VideoModal';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('Manchester United');
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [view, setView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [favoriteVideos, setFavoriteVideos] = useState([]);

  // 1. Khởi tạo dữ liệu
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    fetchVideos(searchTerm);
  }, []);

  // 2. Hàm gọi API YouTube
  const fetchVideos = async (query, pageToken = '') => {
    setLoading(true);
    try {
      const response = await youtube.get('/search', {
        params: { q: query, pageToken: pageToken }
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

  // 3. Hàm xử lý tìm kiếm (Đảm bảo không bị ReferenceError)
  const handleSearch = (term) => {
    setSearchTerm(term);
    setView('home'); // Luôn quay về trang chủ khi tìm kiếm
    fetchVideos(term);
  };

  // 4. Phân trang
  const handlePageChange = (direction) => {
    const token = direction === 'next' ? nextPageToken : prevPageToken;
    if (token) {
      fetchVideos(searchTerm, token);
      window.scrollTo(0, 0);
    }
  };

  // 5. Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setView('home');
    alert("Đã đăng xuất thành công!");
  };

  // 6. Hiển thị danh sách yêu thích
  const handleShowFavorites = () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để xem danh sách yêu thích!");
      setView('login');
      return;
    }
    const favoriteKey = `favorites_${currentUser.email}`;
    const savedFavorites = JSON.parse(localStorage.getItem(favoriteKey)) || [];
    setFavoriteVideos(savedFavorites);
    setView('favorites');
  };

  // 7. Thêm vào yêu thích
  const handleAddToFavorite = (video) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để lưu video yêu thích!");
      setView('login');
      return;
    }
    const favoriteKey = `favorites_${currentUser.email}`;
    let favorites = JSON.parse(localStorage.getItem(favoriteKey)) || [];
    const isExisted = favorites.some(fav =>
        (fav.id.videoId || fav.id) === (video.id.videoId || video.id)
    );

    if (isExisted) {
      alert("Video này đã có trong danh sách yêu thích rồi ❤️");
    } else {
      favorites.push(video);
      localStorage.setItem(favoriteKey, JSON.stringify(favorites));
      alert("Đã thêm vào danh sách yêu thích thành công!");
    }
  };

  // 8. Xóa khỏi yêu thích (Phần 5)
  const handleRemoveFavorite = (videoId) => {
    const favoriteKey = `favorites_${currentUser.email}`;
    const favorites = JSON.parse(localStorage.getItem(favoriteKey)) || [];
    const updatedFavorites = favorites.filter(fav =>
        (fav.id.videoId || fav.id) !== videoId
    );
    localStorage.setItem(favoriteKey, JSON.stringify(updatedFavorites));
    setFavoriteVideos(updatedFavorites);
    alert("Đã xóa khỏi danh sách yêu thích!");
  };

  return (
      <div className="min-h-screen bg-gray-50 pb-10 font-sans text-gray-900">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm py-4 sticky top-0 z-40 flex justify-between px-10 items-center">
          <h1 className="text-2xl font-bold text-red-600 cursor-pointer" onClick={() => setView('home')}>
            MyTube Search
          </h1>

          <div className="flex items-center space-x-6">
            <button
                onClick={() => setView('home')}
                className={`font-semibold transition ${view === 'home' ? 'text-red-600 underline' : 'text-gray-600 hover:text-red-400'}`}
            >
              Trang chủ
            </button>

            {currentUser && (
                <button
                    onClick={handleShowFavorites}
                    className={`font-semibold flex items-center transition ${view === 'favorites' ? 'text-red-600 underline' : 'text-gray-600 hover:text-red-400'}`}
                >
                  <span className="mr-1">❤️</span> Yêu thích
                </button>
            )}

            {currentUser ? (
                <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
                  <span className="text-sm font-medium text-gray-500 italic">Chào, {currentUser.email}</span>
                  <button
                      onClick={handleLogout}
                      className="px-4 py-1.5 bg-gray-800 text-white rounded-md text-sm font-bold hover:bg-black transition"
                  >
                    Đăng xuất
                  </button>
                </div>
            ) : (
                <div className="space-x-2 pl-6 border-l border-gray-200">
                  <button
                      onClick={() => setView('login')}
                      className={`px-4 py-2 rounded font-semibold ${view === 'login' ? 'text-red-600' : 'text-gray-600'}`}
                  >
                    Đăng nhập
                  </button>
                  <button
                      onClick={() => setView('register')}
                      className="px-5 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition shadow-md"
                  >
                    Đăng ký
                  </button>
                </div>
            )}
          </div>
        </nav>

        <main className="container mx-auto mt-6">
          {view === 'register' && <Register onRegisterSuccess={() => setView('login')} />}
          {view === 'login' && <Login onLoginSuccess={(user) => { setCurrentUser(user); setView('home'); }} />}

          {view === 'home' && (
              <>
                <SearchBar onSearch={handleSearch} />
                {loading ? (
                    <div className="flex justify-center my-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <VideoList
                        videos={videos}
                        onVideoSelect={setSelectedVideo}
                        onPageChange={handlePageChange}
                        hasNextPage={!!nextPageToken}
                        hasPrevPage={!!prevPageToken}
                        onAddToFavorite={handleAddToFavorite}
                    />
                )}
              </>
          )}

          {/* VIEW FAVORITES: Khu vực hiển thị video yêu thích */}
          {view === 'favorites' && (
              <div className="container mx-auto px-4 mt-8 animate-fadeIn">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 border-l-8 border-red-600 pl-4">
                    Danh sách yêu thích của tôi
                  </h2>
                  <button
                      onClick={() => setView('home')}
                      className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Tiếp tục khám phá
                  </button>
                </div>

                {favoriteVideos.length > 0 ? (
                    <VideoList
                        videos={favoriteVideos}
                        onVideoSelect={setSelectedVideo}
                        onAddToFavorite={handleAddToFavorite}
                        isFavoriteView={true} // BẬT CHẾ ĐỘ NÀY ĐỂ HIỆN NÚT XOÁ
                        onRemoveFavorite={handleRemoveFavorite}
                        hasNextPage={false}
                        hasPrevPage={false}
                    />
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200">
                      <div className="text-5xl mb-4">📺</div>
                      <p className="text-gray-400 text-lg mb-6 italic">Bạn chưa lưu video nào vào danh sách yêu thích.</p>
                      <button
                          onClick={() => setView('home')}
                          className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg active:transform active:scale-95"
                      >
                        Tìm video hay ngay!
                      </button>
                    </div>
                )}
              </div>
          )}
        </main>

        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      </div>
  );
}

export default App;