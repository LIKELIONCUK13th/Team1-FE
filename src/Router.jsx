import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FindMidpoint from './pages/middlepoint/FindMidpoint';
import MidResult from './pages/middlepoint/MidResult';
import FindWay from './pages/destination/FindWay';
import DestinationResult from './pages/destination/DestinationResult'
import Chatbot from './pages/chatbot/chatbot';

const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FindMidpoint />} />
                <Route path="/midresult" element={<MidResult />} />
                <Route path="/findway" element={<FindWay />} />
                <Route path="/optimalway" element={<DestinationResult />} />
                <Route path="/chatbot" element={<Chatbot />} />
                
            </Routes>
        </BrowserRouter>
    );

};

export default Router;