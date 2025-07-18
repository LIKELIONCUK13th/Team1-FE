import { useState, useEffect } from 'react';
import axios from 'axios';
import './Sidebar.css';
import backbutton from '../../../image/BackButton.png';
import gps from '../../image/GPS.png';
//import config from '../../../apikey';

function Sidebar({ onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
        const [addressRes, placeRes] = await Promise.all([
        axios.get(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
            { headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` } }
        ),
        axios.get(
            `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`,
            { headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` } }
        ),
        ]);

        const addressResults = addressRes.data.documents.map(doc => ({
        name: doc.road_address?.building_name || '', // 건물명 없을 수도 있음
        address: doc.road_address?.address_name || doc.address.address_name,
        x: doc.x,
        y: doc.y
        }));

        const placeResults = placeRes.data.documents.map(doc => ({
        name: doc.place_name,
        address: doc.road_address_name || doc.address_name,
        x: doc.x,
        y: doc.y
        }));

        const merged = [...addressResults, ...placeResults];
        setResults(merged);
    } catch (error) {
        console.error('주소 또는 장소 검색 실패', error);
    }
  };


  const handleCurrentLocation = async () => {
  if (!navigator.geolocation) {
    alert('현재 위치를 지원하지 않는 브라우저입니다.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await axios.get(
          `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
          {
            headers: {
              Authorization: `KakaoAK ${KAKAO_API_KEY}`,
            },
          }
        );

        const address = response.data.documents[0]?.road_address?.address_name ||
                        response.data.documents[0]?.address?.address_name ||
                        "현위치";

        onSelect(address, latitude, longitude);
      } catch (error) {
        console.error('역지오코딩 실패', error);
        alert('주소 변환에 실패했습니다.');
        onSelect('현위치', latitude, longitude); // fallback
      }
    },
      error => {
        console.error('위치 가져오기 실패', error);
        alert('현재 위치를 가져올 수 없습니다.');
      }
    );
  };


  return (
    <div className={`address-sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className='back-button' onClick={onClose}><img src={backbutton} alt="뒤로가기"/></button>
        <input className='type-location'
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="출발 위치를 입력해주세요"
        />
        <button className="search-button"onClick={handleSearch}>검색</button>
      </div>
        <button className="now-button"onClick={handleCurrentLocation}><img src={gps} alt="GPS mark" />내 위치 불러오기</button>

      <div className="sidebar-results">
        {results.slice(0, 5).map((place, index) => (
            <div
                key={index}
                className="result-item"
                onClick={() => onSelect(place.address, parseFloat(place.y), parseFloat(place.x))}
            >
                <div className="place-name">{place.name || ' '}</div>
                <div className="place-address">{place.address}</div>
                <hr className='costum-hr'/>
            </div>
            ))}
      </div>
    </div>
  );
}

export default Sidebar;
