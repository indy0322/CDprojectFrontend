import logo from './logo.svg';
import './App.css';
import Test from './components/test';
import Introduce2 from './components/introduce2';
import Wishlist from './components/wishlist'
import Start from './components/start';
import Search from './components/search';
import User from './components/user';
import Map from './components/map';
import Map2 from './components/map2';
import Translate from './components/translate';
import Account from './components/account';
import Main from './components/main';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Start/>}></Route>
          <Route path='/translate' element={<Translate/>}></Route>
          <Route path='/search' element={<Search/>}></Route>
          <Route path="/main" element={<Main/>}></Route>
          <Route path="/user" element={<User/>}></Route>
          <Route path="/account" element={<Account/>}></Route>
          <Route path='/map' element={<Map/>}></Route>
          <Route path='/map2' element={<Map2/>}></Route>
          <Route path="/test" element={<Test/>}></Route>
          <Route path='/introduce/:tourId' element={<Introduce2/>}></Route>
          <Route path='/wishlist' element={<Wishlist/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
