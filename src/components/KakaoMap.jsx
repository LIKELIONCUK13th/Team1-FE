import { useEffect, useRef } from "react";
import config from "../../apikey";
import "./KakaoMap.css"; // 스타일 따로 정의

const KakaoMap = ({ center, routes = [], destination }) => {
  const mapRef = useRef(null);

  const KAKAO_JS_KEY = config.KAKAO_JS_KEY;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const mapOption = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: 4,
        };

        const map = new window.kakao.maps.Map(mapRef.current, mapOption);

        // 도착지 마커 하나 생성 (destination)
        if (destination) {
          new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(destination.lat, destination.lng),
            title: "도착지",
            // 원하는 아이콘 커스터마이징 가능
          });
        }

        // routes가 있을 때 선과 시작점 마커 그리기
        if (routes.length > 0) {
          routes.forEach((route, index) => {
            // 1) Polyline 그리기
            const linePath = route.map(point => new window.kakao.maps.LatLng(point.lat, point.lng));
            const polyline = new window.kakao.maps.Polyline({
              map,
              path: linePath,
              strokeWeight: 5,
              strokeColor: getColorByIndex(index), // 아래 함수 참고
              strokeOpacity: 0.7,
              strokeStyle: "solid",
            });

            // 2) 출발점 마커 (숫자 마커)
            if (route.length > 0) {
              const startPoint = route[0];
              const marker = new window.kakao.maps.Marker({
                map,
                position: new window.kakao.maps.LatLng(startPoint.lat, startPoint.lng),
                title: `출발지 ${index + 1}`,
                // 숫자가 들어간 마커 이미지 커스터마이징 함수 호출
                image: getNumberMarkerImage(index + 1),
              });
            }
          });
        }
      });
    };

    document.head.appendChild(script);

    // 스크립트 중복 추가 방지, 정리 코드도 추가 가능

  }, [center, routes, destination, KAKAO_JS_KEY]);

  return <div ref={mapRef} className="map-container" />;
};

export default KakaoMap;


function getColorByIndex(index) {
  const colors = ["#FF0000", "#00AAFF", "#00CC00", "#FF00FF", "#FFA500"];
  return colors[index % colors.length];
}

function getNumberMarkerImage(number) {
  const imageSrc = `https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue${number}.png`;
  const imageSize = new window.kakao.maps.Size(24, 35); // 일반적인 사이즈
  const imageOptions = {
    offset: new window.kakao.maps.Point(12, 35), // 중앙 하단 정렬
  };
  return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOptions);
}
