import { useState } from 'react';
import Sidebar from "./Sidebar.jsx";
import './FindMidpoint.css';
import addbuttonimg from "../../image/Vector.png";
import axios from 'axios';

const FindMidpoint = () => {
    const [addresses, setAddresses] = useState([
        { label: '', lat: null, lng: null },
        { label: '', lat: null, lng: null },
    ]);

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

    const handleFindMidpoint = async () => {
        const allFilled = addresses.every(addr => addr.label && addr.lat !== null && addr.lng !== null);

        if (!allFilled) {
            alert("출발 장소를 입력해주세요."); 
            return;
        }

        const postData = addresses.map(addr => ({
            latitude: addr.lat,
            longitude: addr.lng,
        }));

        try {
            const response = await axios.post('back uri', postData);
            console.log('중간지점 응답:', response.data);

        } catch (error) {
            console.error('중간지점 찾기 실패:', error);
        }
    };


    return(
        <>
            <div class="func-container">
                <p style={{ fontWeight: '700' }}>출발지를 입력하고 중간장소를<br/>찾아보세요!</p>
                {addresses.map((addr, i) => (
                    <button
                    key={i}
                    className="address-button"
                    onClick={() => setActiveIndex(i)}
                    >
                    {addr.label || '출발지를 입력해주세요'}
                    </button>
                ))}
                <button class="add-button" onClick={handleAddFriend} disabled={addresses.length >= 3}><img src={addbuttonimg} alt='addbutton' height='16px' width='15px' /> 친구 추가하기</button>
                <button class="find-button" onClick={handleFindMidpoint}>중간장소 찾기</button>

                

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

export default FindMidpoint;