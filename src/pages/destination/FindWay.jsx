import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from "./SidebarD.jsx";
import './FindWay.css';
import addbuttonimg from "../../image/Vector.png";
import axios from 'axios';

const FindWay = () => {
    const [addresses, setAddresses] = useState([
        { label: '', lat: null, lng: null },
        { label: '', lat: null, lng: null },
    ]);
    const location = useLocation();
    const midpoint = location.state?.midpoint;

    const [activeIndex, setActiveIndex] = useState(null);
    /*const [showAlert, setShowAlert] = useState(false); */
    
    const handleSelectAddress = (index, label, lat, lng) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { label, lat, lng };
    setAddresses(newAddresses);
    setActiveIndex(null);
  };

    const handleAddFriend = () => {
        const newList = [...addresses];
        newList.splice(2, 0, { label: '', lat: null, lng: null });
        setAddresses(newList);
    };

    const navigate = useNavigate();

    const handleFindWay = async () => {
        // 최소 첫 번째 목적지는 반드시 입력되어야 함
        const allFilled = addresses[0].label && addresses[0].lat !== null && addresses[0].lng !== null;

        if (!allFilled) {
            alert("목적지를 입력해주세요.");
            return;
        }

        const filledAddresses = addresses.filter(addr => addr.label && addr.lat !== null && addr.lng !== null);

        // ✅ POST 보낼 데이터
        const postData = {
            midpoint: {
                x: midpoint?.lng,
                y: midpoint?.lat
            },
            destinations: filledAddresses.map(addr => ({
                x: addr.lng,
                y: addr.lat
            }))
        };

        try {
            const response = await axios.post('https://your-backend.com/api/path', postData); // 여기에 실제 URI 입력
            console.log('경로 응답:', response.data);

            // ✅ 응답과 midpoint 함께 다음 페이지로 넘기기
            navigate('/optimalway', {
                state: {
                    destinationResult: response.data,
                    midpoint: postData.midpoint
                }
            });

        } catch (error) {
            console.error('경로 찾기 실패:', error);

            // ✅ mockData와 midpoint 함께 넘기기
            navigate('/optimalway', {
                state: {
                    destinationResult: "mockData",
                    midpoint: postData.midpoint
                }
            });
        }
    };


    /*const handleFindWay = async () => {
        const allFilled = addresses[0].label && addresses[0].lat !== null && addresses[0].lng !== null;

        if (!allFilled) {
            alert("목적지를 입력해주세요."); 
            return;
        }

        const filledAddresses = addresses.filter(addr => addr.label && addr.lat !== null && addr.lng !== null);

        const postData = {
            locations: filledAddresses.map(addr => ({
                x: addr.lng,
                y: addr.lat
            }))
        };

        try {
            const response = await axios.post('back uri', postData);
            console.log('경로 응답:', response.data);
            navigate('/destinationresult', { state: { destinationData: response.data } });

        } catch (error) {
            console.error('경로 찾기 실패:', error);
            navigate('/destinationresult', { state: { destinationData: "mockData"
                
                //이상 mockdata
            } });
        }
    }; */


    return(
        <>
            <div class="func-container">
                <p style={{ fontWeight: '700' }}>목적지를 입력하고 중간장소로부터<br/>최단경로를 찾아보세요!</p>
                {addresses.map((addr, i) => (
                    <button
                    key={i}
                    className="address-button"
                    onClick={() => setActiveIndex(i)}
                    >
                    {addr.label || '출발지를 입력해주세요'}
                    </button>
                ))}
                <button class="add-button" onClick={handleAddFriend} disabled={addresses.length >= 3}><img src={addbuttonimg} alt='addbutton' height='16px' width='15px' /> 목적지 추가하기</button>
                <button class="find-button" onClick={handleFindWay}>최단경로 찾기</button>

                

                {/*
                {showAlert && (
                    <div className="bottom-alert">출발 장소를 입력해주세요.</div>
                )}*/}
            </div>
            {activeIndex !== null && (
                    <Sidebar
                    onClose={() => setActiveIndex(null)}
                    onSelect={(label, lat, lng) =>
                        handleSelectAddress(activeIndex, label, lat, lng)
                    }
                    />
                ) }
        </>
    );
};

export default FindWay;