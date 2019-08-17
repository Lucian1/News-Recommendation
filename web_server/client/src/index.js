import React from 'react';
import ReactDOM from 'react-dom';
import Base from './Base/Base';
import { BrowserRouter as Router  } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router><Base /></Router>, document.getElementById('root'));
registerServiceWorker();
