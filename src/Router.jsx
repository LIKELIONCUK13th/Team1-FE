import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FindMidpoint from './pages/middlepoint/FindMidpoint'

const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FindMidpoint />} />
            </Routes>
        </BrowserRouter>
    );

};

export default Router;