
'use strict';

const clc = require('cli-color');
const messge = {};
function specifyProject() {
    console.log('Please specify the project directory:');
    console.log(`       ${clc.blue('create-react-app <project-directory>')}`);
    console.log('For example:');
    console.log(`       ${clc.blue('create-myapp my-react-app')}`);
}

messge.specifyProject = specifyProject;

module.exports = messge;