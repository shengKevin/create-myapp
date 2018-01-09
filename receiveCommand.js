#!/usr/bin/env node

'use strict';

const clc = require('cli-color');
const messge = require('./cliBody/messge');
const config = {};

const paramsArr = process.argv.slice(2);
if (paramsArr.length >= 1 && paramsArr[0]) {
    let projectName = '';
    paramsArr.forEach((com, index) => {
        // if (index !== 0){
            projectName += com;
        // }
    });
    config.name = projectName;
} else {
    messge.specifyProject();
}

process.stdin.on('end', () => {
   process.stdin.write('end');
});

function getIsCrateNewApp(cb) {
    process.stdin.setEncoding('utf8');
    process.stdin.resume();
    console.log(`${config.name} already exists, do you want to cover the project ${clc.blue('(y/n)')}`);
    process.stdin.on('data', chunk => {
        process.stdin.pause();
        cb && cb(chunk);
        process.stdin.emit('end')
    })
}
config.getIsCrateNewApp = getIsCrateNewApp;

module.exports = config;