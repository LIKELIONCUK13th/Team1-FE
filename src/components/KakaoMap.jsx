import { useEffect, useRef } from "react";
//import config from "../../apikey";
import midPointMarker from "../image/MidPoint.png";
import "./KakaoMap.css"; // 스타일 따로 정의

const KakaoMap = ({ center, routes = [], destination, mode = 'default', coordinates = [], viaPoints = [] }) => {
  const mapRef = useRef(null);

  const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;
  const markerImages = ["/assets/BlueMarker.png", "/assets/OrangeMarker.png", "/assets/GreenMarker.png"]

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const mapOption = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: 8,
        };

        const map = new window.kakao.maps.Map(mapRef.current, mapOption);

        if (mode === 'bestWay') {
          if (coordinates.length > 1) {
            // 1. 경로 그리기
            const path = coordinates.map(coord => new kakao.maps.LatLng(coord.lat, coord.lng));
            new kakao.maps.Polyline({
              map,
              path,
              strokeWeight: 5,
              strokeColor: "#2f8af5",
              strokeOpacity: 1,
              strokeStyle: "solid"
            });

            // 2. 출발 마커
            addImageMarker(map, coordinates[0], "/assets/BlueMarker.png");

            // 3. 도착 마커
            addImageMarker(map, coordinates[coordinates.length - 1], "/assets/RedMarker.png");
          }

          // 4. 경유지 마커
          console.log("viaPoints:", viaPoints);
          viaPoints.forEach((pt) => {
            addImageMarker(map, pt, "/assets/GreenMarker.png");
          });

                    // 출발지
          const startOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(coordinates[0].lat, coordinates[0].lng),
            content: `
              <div style="position: relative; display: flex; justify-content: center; align-items: center; width: 40px; height: 40px;">
                <span style="
                  position: absolute;
                  top: 40%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  color: white;
                  font-weight: 500;
                  font-size: 12px;
                  pointer-events: none;
                ">출발</span>
              </div>
            `,
            yAnchor: 1,
            zIndex: 5,
          });
          startOverlay.setMap(map);

          // 경유지들 (viaPoints 배열 사용)
          viaPoints.forEach((point, idx) => {
            const stopOverlay = new kakao.maps.CustomOverlay({
              position: new kakao.maps.LatLng(point.lat, point.lng),
              content: `
                <div style="position: relative; display: flex; justify-content: center; align-items: center; width: 40px; height: 40px;">
                  <span style="
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-weight: 500;
                    font-size: 12px;
                    pointer-events: none;
                  ">경유${idx + 1}</span>
                </div>
              `,
              yAnchor: 1,
              zIndex: 5,
            });
            stopOverlay.setMap(map);
          });

          // 도착지
          const endOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(coordinates[coordinates.length - 1].lat, coordinates[coordinates.length - 1].lng),
            content: `
              <div style="position: relative; display: flex; justify-content: center; align-items: center; width: 40px; height: 40px;">
                <span style="
                  position: absolute;
                  top: 40%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  color: white;
                  font-weight: 500;
                  font-size: 12px;
                  pointer-events: none;
                ">도착</span>
              </div>
            `,
            yAnchor: 1,
            zIndex: 5,
          });
          endOverlay.setMap(map);

        } else {
          // 도착지 마커 하나 생성 (destination)
          if (destination) {
            const imageSize = new window.kakao.maps.Size(55, 36);
            const imageOption = {
              offset: new window.kakao.maps.Point(21, 42), // 중심 하단
            };
            const markerImage = new window.kakao.maps.MarkerImage(
              midPointMarker,
              imageSize,
              imageOption
            );

            new window.kakao.maps.Marker({
              map,
              position: new window.kakao.maps.LatLng(destination.lat, destination.lng),
              title: "도착지",
              image: markerImage,
            });

            const destinationOverlay = new kakao.maps.CustomOverlay({
              position: new kakao.maps.LatLng(destination.lat, destination.lng),
              content: `
                <div style="position: relative; display: flex; justify-content: center; align-items: center; width: 40px; height: 40px;">
                  <span style="
                    position: absolute;
                    top: 30%;
                    left: 65%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-weight: 500;
                    font-size: 12px;
                    pointer-events: none;
                  ">중간지점</span>
                </div>
              `,
              yAnchor: 1,
              zIndex: 5,
            });

            destinationOverlay.setMap(map);
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
                strokeOpacity: 1,
                strokeStyle: "solid",
              });

              // 2) 출발점 마커 (숫자 마커)
              if (route.length > 0) {
                const startPoint = route[0];

                const content = `
                  <div style="
                    position: relative;
                    width: 40px;
                    height: 40px;
                  ">
                    <img src="${markerImages[index]}" style="width: 100%; height: 100%;" />
                    <div style="
                      position: absolute;
                      top: 40%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      font-weight: bold;
                      color: white;
                      font-size: 16px;
                    ">
                      ${index + 1}
                    </div>
                  </div>
                `;

                const customOverlay = new window.kakao.maps.CustomOverlay({
                  position: new window.kakao.maps.LatLng(startPoint.lat, startPoint.lng),
                  content: content,
                  yAnchor: 1,
                });

                customOverlay.setMap(map);
              }
            });
          }
        }
      });
    };

    document.head.appendChild(script);

    // 스크립트 중복 추가 방지, 정리 코드도 추가 가능

  }, [mode, center, routes, destination, coordinates, viaPoints, KAKAO_JS_KEY]);

  return <div ref={mapRef} className="map-container" />;
};

export default KakaoMap;


function getColorByIndex(index) {
  const colors = ["#6297FE", "#F5AA42", "#1EE391"];
  return colors[index % colors.length];
}

function addImageMarker(map, position, imageUrl) {
  const imageSize = new kakao.maps.Size(40, 40); // 마커 이미지 크기
  const imageOption = { offset: new kakao.maps.Point(20, 40) }; // 하단 중심 정렬

  const markerImage = new kakao.maps.MarkerImage(imageUrl, imageSize, imageOption);

  new kakao.maps.Marker({
    map,
    position: new kakao.maps.LatLng(position.lat, position.lng),
    image: markerImage
  });
}
