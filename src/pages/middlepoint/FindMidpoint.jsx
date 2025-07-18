import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();

    const handleFindMidpoint = async () => {
        const allFilled = addresses.every(addr => addr.label && addr.lat !== null && addr.lng !== null);

        if (!allFilled) {
            alert("출발 장소를 입력해주세요."); 
            return;
        }

        const postData = {
            locations: addresses.map(addr => ({
                x: addr.lng,
                y: addr.lat
            }))
        };

        try {
            const response = await axios.post('back uri', postData);
            console.log('중간지점 응답:', response.data);
            navigate('/midresult', { state: { midpointData: response.data } });

        } catch (error) {
            console.error('중간지점 찾기 실패:', error);
            navigate('/midresult', { state: { midpointData: 
                [
                    {
                        "endX": 127.002,
                        "endY": 37.567,
                        "duration": 94,
                        "distance": 444,
                        "path": [
                            {
                                "x": 127.00101180923978,
                                "y": 37.5668115241985
                            },
                            {
                                "x": 127.00050284384483,
                                "y": 37.56678018494132
                            },
                            {
                                "x": 127.00050284384483,
                                "y": 37.56678018494132
                            },
                            {
                                "x": 127.00050127886054,
                                "y": 37.56689730728191
                            },
                            {
                                "x": 127.00051175456258,
                                "y": 37.56696046898155
                            },
                            {
                                "x": 127.00069875095832,
                                "y": 37.567367521328244
                            },
                            {
                                "x": 127.00079821002187,
                                "y": 37.567548571764014
                            },
                            {
                                "x": 127.0011442705304,
                                "y": 37.56791191743558
                            },
                            {
                                "x": 127.00140110874365,
                                "y": 37.568175392693966
                            },
                            {
                                "x": 127.00140110874365,
                                "y": 37.568175392693966
                            },
                            {
                                "x": 127.00214957720111,
                                "y": 37.56807359632685
                            },
                            {
                                "x": 127.00214957720111,
                                "y": 37.56807359632685
                            },
                            {
                                "x": 127.002186777902,
                                "y": 37.567830629160675
                            },
                            {
                                "x": 127.00220614860005,
                                "y": 37.56722709405935
                            },
                            {
                                "x": 127.00222239430946,
                                "y": 37.56685780369725
                            },
                            {
                                "x": 127.00222239430946,
                                "y": 37.56685780369725
                            },
                            {
                                "x": 127.00200746530057,
                                "y": 37.56684697654299
                            }
                        ]
                    },
                    {
                        "endX": 127.002,
                        "endY": 37.567,
                        "duration": 29,
                        "distance": 167,
                        "path": [
                            {
                                "x": 127.0020135140266,
                                "y": 37.568090467037436
                            },
                            {
                                "x": 127.00214957720111,
                                "y": 37.56807359632685
                            },
                            {
                                "x": 127.00214957720111,
                                "y": 37.56807359632685
                            },
                            {
                                "x": 127.002186777902,
                                "y": 37.567830629160675
                            },
                            {
                                "x": 127.00220614860005,
                                "y": 37.56722709405935
                            },
                            {
                                "x": 127.00222239430946,
                                "y": 37.56685780369725
                            },
                            {
                                "x": 127.00222239430946,
                                "y": 37.56685780369725
                            },
                            {
                                "x": 127.00200746530057,
                                "y": 37.56684697654299
                            }
                        ]
                    },
                    {
                        "endX": 127.002,
                        "endY": 37.567,
                        "duration": 141,
                        "distance": 396,
                        "path": [
                            {
                                "x": 127.00304668374731,
                                "y": 37.56616195379197
                            },
                            {
                                "x": 127.00320561985836,
                                "y": 37.566127254123785
                            },
                            {
                                "x": 127.0036944655644,
                                "y": 37.56596919281404
                            },
                            {
                                "x": 127.0036944655644,
                                "y": 37.56596919281404
                            },
                            {
                                "x": 127.00320546657099,
                                "y": 37.56528928250235
                            },
                            {
                                "x": 127.00320546657099,
                                "y": 37.56528928250235
                            },
                            {
                                "x": 127.00261355960845,
                                "y": 37.56553657550909
                            },
                            {
                                "x": 127.00256816675395,
                                "y": 37.56554520243954
                            },
                            {
                                "x": 127.00235324144815,
                                "y": 37.565534375965825
                            },
                            {
                                "x": 127.00235324144815,
                                "y": 37.565534375965825
                            },
                            {
                                "x": 127.00228691728026,
                                "y": 37.566263660519695
                            },
                            {
                                "x": 127.00226103612563,
                                "y": 37.566506723453536
                            },
                            {
                                "x": 127.00222239430946,
                                "y": 37.56685780369725
                            },
                            {
                                "x": 127.00222239430946,
                                "y": 37.56685780369725
                            },
                            {
                                "x": 127.00200746530057,
                                "y": 37.56684697654299
                            }
                        ]
                    }
                ] 
                //이상 mockdata
            } });
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