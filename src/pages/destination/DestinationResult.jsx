import KakaoMap from '../../components/KakaoMap.jsx';
import './DestinationResult.css';

const DestinationResult = () => {

    const center = { lat: 37.505, lng: 127.105 }; // 지도의 중심
    const coordinates = [
        { lat: 37.5, lng: 127.1 },     // 출발
        { lat: 37.505, lng: 127.105 }, // 경유1
        { lat: 37.507, lng: 127.107 }, // 경유2
        { lat: 37.52, lng: 127.12 },   // 도착
    ];
    const viaPoints = [
        { lat: 37.505, lng: 127.105 },
        { lat: 37.507, lng: 127.107 },
    ];
    

    return (
        <>
            <KakaoMap
                mode="bestWay"
                center={center}
                coordinates={coordinates}
                viaPoints={viaPoints}
            />

            <button className='chatbot-load'> 챗봇 열기 </button>
        </>
    );
};

export default DestinationResult;   