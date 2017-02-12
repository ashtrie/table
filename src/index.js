import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import style from './stylesheets/main.scss';

import SampleTable from './components/SampleTable.js';

export default class App extends React.Component {

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Table"
                        iconElementLeft={<div></div>}
                        iconElementRight={<div></div>}
                    />
                    <SampleTable/>
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
