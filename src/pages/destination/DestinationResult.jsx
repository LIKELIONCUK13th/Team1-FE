import { useLocation, useNavigate } from 'react-router-dom';
import { useState,useEffect,useMemo } from 'react';
import KakaoMap from '../../components/KakaoMap.jsx';
import axios from 'axios';
import './DestinationResult.css';

const DestinationResult = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const {
        destinationResult,
        midpoint,
        stopover,
        destination
    } = location.state || {};

    const [placeName, setPlaceName] = useState('');
    const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

    useEffect(() => {
        if (!destination) return;

        const fetchAddress = async () => {
        try {
            const response = await axios.get(
            `https://dapi.kakao.com/v2/local/geo/coord2address.json`,
            {
                params: {
                x: destination.x, // 경도
                y: destination.y, // 위도
                },
                headers: {
                Authorization: `KakaoAK ${KAKAO_API_KEY}`,
                },
            }
            );

            const addressData = response.data.documents[0];
            const address =
            addressData?.road_address?.address_name ||
            addressData?.address?.address_name ||
            '주소 정보 없음';

            setPlaceName(address);
        } catch (error) {
            console.error('역지오코딩 실패:', error);
            setPlaceName('주소 변환 실패');
        }
        };

        fetchAddress();
    }, [destination]);
    
    useEffect(() => {
        console.log('총 소요 시간:', destinationResult?.totalDuration);
        console.log('총 거리:', destinationResult?.totalDistance);
        console.log('전체 경로 path:', destinationResult?.path);
        console.log('중간지점:', midpoint);
        console.log('경유지:', stopover);
        console.log('도착지:', destination);
    }, [destinationResult, midpoint, stopover, destination]);


    
    // 경로 좌표 처리
    const coordinates = useMemo(() => {
        if (!destinationResult?.path) return [];
        return destinationResult.path.map(coord => ({
            lat: coord.y,
            lng: coord.x
        }));
    }, [destinationResult]);

    // 경유지 좌표 처리
    console.log('stopover:', stopover);
    const viaPoints = useMemo(() => {
        if (!stopover || !Array.isArray(stopover)) return [];
        return stopover.map(point => ({
            lat: point.y,
            lng: point.x
        }));
    }, [stopover]);
    console.log('viavia:', viaPoints)

    const durationText = useMemo(() => {
        if (!destinationResult?.totalDuration) return "";
        const minutes = Math.floor(destinationResult.totalDuration / 60);
        return `${minutes}분`;
    }, [destinationResult]);

    const distanceText = useMemo(() => {
        if (!destinationResult?.totalDistance) return "";
        const kilometers = (destinationResult.totalDistance / 1000).toFixed(1);
        return `${kilometers}km`;
    }, [destinationResult]);

    const center = coordinates.length > 0 ? coordinates[Math.floor(coordinates.length / 2)] : { lat: 37.505, lng: 127.105 };
    const openChatbot = () => {
        console.log(placeName)
        if (!placeName) {
        alert('장소명을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
        }
        navigate('/chatbot', { state: { placeName } });
    };
    

    return (
        <>
            <KakaoMap
                mode="bestWay"
                center={center}
                coordinates={coordinates}
                viaPoints={viaPoints}
            />
            <div className='headerD'>
                <button className='back-button' onClick={() => navigate(-1)}><img src="/assets/BackButton.png" alt="뒤로가기"/></button>
                <p className='p-bestway'>최적의 경로 결과 보기</p>
            </div>
            <div className="boxofinfo">
                <div className='gapping'>
                    <div className='lettering'>최단거리</div>
                    <div className='straight'>
                        <div className='durating'>{durationText}</div>
                        <div className='distancing'>{distanceText}</div>
                    </div>
                </div >
                <div style={{marginLeft:'auto'}}><img src="/assets/bluecar.png" alt="차 이미지"/></div>
            </div>
            <button className='chatbot-load' onClick={openChatbot}><img src="/assets/AI.png"/> </button>
        </>
    );
};

export default DestinationResult;   