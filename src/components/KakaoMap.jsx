import { useEffect, useRef } from "react";
import config from "../../apikey";
import "./KakaoMap.css"; // 스타일 따로 정의

const KakaoMap = ({ center }) => {
  const mapRef = useRef(null);

  const KAKAO_API_KEY = config.KAKAO_API_KEY;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapOption = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapRef.current, mapOption);

        // 중심 마커 (선택 사항)
        new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(center.lat, center.lng),
        });
      });
    };

    document.head.appendChild(script);
  }, [center]);

  return <div ref={mapRef} className="map-container" />;
};

export default KakaoMap;
