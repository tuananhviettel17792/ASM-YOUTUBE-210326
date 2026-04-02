import React from 'react';

const VideoCard = ({ video, onVideoSelect, onAddToFavorite, isFavoriteView, onRemove }) => {
    const { snippet } = video;
    // Lấy ID chuẩn của video (hỗ trợ cả từ API search và từ danh sách đã lưu)
    const videoId = video.id.videoId || video.id;

    return (
        <div
            onClick={() => onVideoSelect(video)}
            className="relative cursor-pointer group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={snippet.thumbnails.medium.url}
                    alt={snippet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* LOGIC HIỂN THỊ NÚT: NẾU LÀ TRANG YÊU THÍCH THÌ HIỆN NÚT XOÁ, NGƯỢC LẠI HIỆN NÚT THÊM */}
                {isFavoriteView ? (
                    /* NÚT XOÁ (Dành cho Phần 5) */
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn chặn mở VideoModal
                            onRemove(videoId); // Gọi hàm xóa từ App.jsx truyền xuống
                        }}
                        className="absolute top-2 right-2 p-2 bg-white/95 rounded-full shadow-md text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 z-10"
                        title="Xóa khỏi yêu thích"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                ) : (
                    /* NÚT THÊM VÀO YÊU THÍCH (Dành cho Phần 4) */
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToFavorite(video);
                        }}
                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all duration-200 z-10"
                        title="Thêm vào yêu thích"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {/* Video Info */}
            <div className="p-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
                    {snippet.title}
                </h3>
                <p className="text-sm text-gray-600">{snippet.channelTitle}</p>
                <p className="text-xs text-gray-400 mt-1">
                    {new Date(snippet.publishedAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default VideoCard;