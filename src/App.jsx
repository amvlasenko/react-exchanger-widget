import React from 'react';
import './App.css';
import { Widget } from './Components/Widget';

function App() {
    return (
        <div className={'content'}>
            <h1>Crypto Exchange</h1>
            <p>Exchange fast and easy</p>
            <Widget />
        </div>
    );
}

export default App;