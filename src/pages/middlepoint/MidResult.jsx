import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import KakaoMap from '../../components/KakaoMap.jsx';
import backbutton from '../../image/backbutton.png';
import './MidResult.css';

const MidResult = () => {
    const location = useLocation();
    const midpointData = location.state?.midpointData;

    const [routes, setRoutes] = useState([]);
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        if (!midpointData || !Array.isArray(midpointData)) return;

        // 각 route의 path만 가공
        const processedRoutes = midpointData.map(entry =>
        entry.path.map(p => ({
            lat: p.y,
            lng: p.x,
        }))
        );

        // 도착지: 첫 항목의 endX, endY를 사용 (모두 같다고 가정)
        const { endX, endY } = midpointData[0];

        setRoutes(processedRoutes);
        setDestination({ lat: endY, lng: endX });
    }, [midpointData]);

    if (!routes.length || !destination) return <div>지도를 불러오는 중...</div>;

    return (
        <>
            <KakaoMap
            //mode="direct"
            center={destination}
            routes={routes}
            destination={destination}
            />
            <div className="header">
                <button className='back-button'><img src={backbutton} alt="뒤로가기"/></button>
                <p>중간장소 결과 보기</p>
            </div>
        </>
        );
    }; 

export default MidResult;


/*import config from '../../../apikey';
import { useLocation } from 'react-router-dom';
import './MidResult.css';



const MidResult = () => {
    const lo

    return(
        //헤더
        
        //인포
        //최단경로찾기 nav
    );
};

export default MidResult;*/