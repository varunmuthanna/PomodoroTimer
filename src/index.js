import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PomodoroApp from './components/PomodoroApp/PomodoroApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<PomodoroApp />, document.getElementById('root'));
registerServiceWorker();
