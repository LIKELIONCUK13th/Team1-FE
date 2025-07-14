import './FindMidpoint.css';
import addbuttonimg from "../../image/Vector.png";

const FindMidpoint = () => {


    return(
        <div class="func-container">
            <p style={{ fontWeight: '700' }}>출발지를 입력하고 중간장소를<br/>찾아보세요!</p>
            <button class="address-button">1.출발지를 입력해주세요</button>
            <button class="address-button">2.출발지를 입력해주세요</button>
            <button class="add-button"><img src={addbuttonimg} alt='addbutton' height='16px' width='15px' /> 친구 추가하기</button>
            <button class="find-button">중간장소 찾기</button>
        </div>
    );
};

export default FindMidpoint;