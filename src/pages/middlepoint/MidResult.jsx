import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import KakaoMap from '../../components/KakaoMap.jsx';
//import backbutton from '../../image/BackButton.png';
import axios from 'axios';
//import config from '../../../apikey';  // Kakao REST API 키가 들어있는 파일
import './MidResult.css';

const MidResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const midpointData = location.state?.midpointData;
    const arrayImages = ["/assets/mark1st.png","/assets/mark2nd.png","/assets/mark3rd.png",];
    const carImages = ["/assets/bluecar.png","/assets/orangecar.png","/assets/greencar.png",];
    const [routes, setRoutes] = useState([]);
    const [destination, setDestination] = useState(null);
    const [destinationAddress, setDestinationAddress] = useState('');
    const [durations, setDurations] = useState([]);
    const [averageDuration, setAverageDuration] = useState(0);
    const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

    useEffect(() => {
        if (!midpointData || !Array.isArray(midpointData)) return;

        const processedRoutes = midpointData.map(entry =>
            entry.path.map(p => ({
                lat: p.y,
                lng: p.x,
            }))
        );

        const { endX, endY } = midpointData[0];
        setRoutes(processedRoutes);
        setDestination({ lat: endY, lng: endX });

        const durationList = midpointData.map(entry => entry.duration);
        const total = durationList.reduce((sum, val) => sum + val, 0);
        const average = durationList.length > 0 ? total / durationList.length : 0;

        setDurations(durationList);
        setAverageDuration(Math.round(average));
    }, [midpointData]);

    useEffect(() => {
        if (!destination) return;

        const fetchAddress = async () => {
            try {
                const response = await axios.get(
                    `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${destination.lng}&y=${destination.lat}`,
                    {
                        headers: {
                            Authorization: `KakaoAK ${KAKAO_API_KEY}`,
                        },
                    }
                );

                const addressData = response.data.documents[0];
                const address = addressData?.road_address?.address_name ||
                                addressData?.address?.address_name ||
                                '주소 정보 없음';

                setDestinationAddress(address);
            } catch (error) {
                console.error('역지오코딩 실패:', error);
                setDestinationAddress('주소 변환 실패');
            }
        };

        fetchAddress();
    }, [destination]);

    if (!routes.length || !destination) return <div>지도를 불러오는 중...</div>;

    return (
        <>
            <KakaoMap
                center={{ lat: destination.lat - 0.002, lng: destination.lng }}
                routes={routes}
                destination={destination}
            />
            <div className="header">
                <button className='back-button' onClick={() => navigate(-1)}><img src="/assets/BackButton.png" alt="뒤로가기"/></button>
                <p className="p-con">중간장소 결과 보기</p>
            </div>
            <div className="midwayinfo">
                <div className="place">{destinationAddress}</div>
                <div className="duration"><span className="time-first">{averageDuration}분</span><span className="time-second">평균 이동시간</span></div>
                <div className="gridding">
                    {durations.map((dur, idx) => (
                        <div className="each-time" key={idx}>
                            <img src={arrayImages[idx]}
                                alt={`${idx + 1}번 사용자 넘버 아이콘`}
                                style={{ width: '24px', height: '24px', marginRight: '8px' }}
                            />
                            {dur}분
                            <img src={carImages[idx]}
                                alt={`${idx + 1}번 사용자 색깔 아이콘`}
                                style={{ width: '20px', height: '19px', marginLeft: '44px',}}
                            />
                        </div>
                        ))}
                </div>
                <button className="trip-button">★&nbsp;&nbsp;여행지 입력하고 중간지점에서 최단경로 찾기</button>
            </div>
        </>
    );
};

export default MidResult;