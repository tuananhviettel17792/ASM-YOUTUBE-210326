import axios from 'axios';

const KEY = 'AIzaSyBcGbnvUArGpsMA_rIedl0w8hBlYV2Z2SU';

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    params: {
        part: 'snippet',
        maxResults: 12,
        key: KEY,
        type: 'video'
    }
});