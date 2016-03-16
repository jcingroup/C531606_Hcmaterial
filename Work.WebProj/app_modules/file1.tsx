//declare function require(name: string);
//var sampleModule = require('../modulename/file.jsx');

import JCIN = require('JCIN');

class Tips extends React.Component<any, any>{
    render() {

        var ABC = JCIN.ContextComponent;
        
        return <div><ABC id={1}/></div>;
    }
}