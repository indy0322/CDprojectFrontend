import logo from './logo.svg';
import './App.css';
import Test from './components/test';
//import Introduce from './components/introduce';
import Introduce2 from './components/introduce2';
import Wishlist from './components/wishlist'
//import Review from './components/review';
import Start from './components/start';
import Search from './components/search';
import Map from './components/map';
import Translate from './components/translate';
//import User from './components/user';
import Main from './components/main';
import NaverTestMap from './components/navermap/navertestmap';
import GoogleTestMap from './components/googlemap/googletestmap';
//import MapWithLanguageSetting from './components/maptestfolder/MapWithLanguageSetting';
//import Tts from './components/tts';
//import Besttestmap from './components/bestmapcode/testMap';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/*<Route path='/mapwith' element={<MapWithLanguageSetting/>}></Route>*/}
          <Route path='/' element={<Start/>}></Route>
          <Route path='/translate' element={<Translate/>}></Route>
          <Route path='/search' element={<Search/>}></Route>
          {/*<Route path="/user" element={<User/>}></Route>*/}
          <Route path="/main" element={<Main/>}></Route>
          <Route path='/map' element={<Map/>}></Route>
          {/*<Route path='/bestmap' element={<Besttestmap/>}></Route>*/}
          <Route path="/test" element={<Test/>}></Route>
          {/*<Route path="/tts" element={<Tts/>}></Route>*/}
          <Route path='/introduce/:tourId' element={<Introduce2/>}></Route>
          <Route path='/wishlist' element={<Wishlist/>}></Route>
          {/*<Route path='/tour/:tourName' element={<Introduce/>}></Route>*/}
          {/*<Route path='/review/:tourId' element={<Review/>}></Route>*/}
          <Route path='/navermap' element={<NaverTestMap/>}></Route>
          <Route path='/googlemap' element={<GoogleTestMap/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
