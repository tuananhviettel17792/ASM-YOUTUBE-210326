import React from 'react';
import VideoCard from './VideoCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VideoList = ({
                       videos = [], // Mặc định là mảng rỗng để tránh lỗi .map
                       onVideoSelect,
                       onPageChange,
                       hasNextPage,
                       hasPrevPage,
                       onAddToFavorite,
                       isFavoriteView = false, // Mặc định là false
                       onRemoveFavorite
                   }) => {
    return (
        <div className="container mx-auto px-4 mt-4">
            {/* Grid danh sách video */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                    <VideoCard
                        key={video.id.videoId || video.id}
                        video={video}
                        onVideoSelect={onVideoSelect}
                        onAddToFavorite={onAddToFavorite}
                        // TRUYỀN DỮ LIỆU XUỐNG VIDEOCARD
                        isFavoriteView={isFavoriteView}
                        onRemove={onRemoveFavorite}
                    />
                ))}
            </div>

            {/* Phân trang: Chỉ hiện ở Trang chủ (Home), ẩn ở trang Yêu thích (Favorites) */}
            {!isFavoriteView && videos.length > 0 && (
                <div className="flex justify-center items-center space-x-4 my-12">
                    <button
                        onClick={() => onPageChange('prev')}
                        disabled={!hasPrevPage}
                        className="flex items-center px-5 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-gray-700"
                    >
                        <ChevronLeft size={18} className="mr-1" /> Trước
                    </button>

                    <button
                        onClick={() => onPageChange('next')}
                        disabled={!hasNextPage}
                        className="flex items-center px-5 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-gray-700"
                    >
                        Sau <ChevronRight size={18} className="ml-1" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoList;