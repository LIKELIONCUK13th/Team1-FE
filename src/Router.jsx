import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FindMidpoint from './pages/middlepoint/FindMidpoint';
import MidResult from './pages/middlepoint/MidResult';

const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FindMidpoint />} />
                <Route path="/midresult" element={<MidResult />} />
            </Routes>
        </BrowserRouter>
    );

};

export default Router;