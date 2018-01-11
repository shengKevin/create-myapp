#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const clc = require('cli-color');
const config = require('./receiveCommand');

const templatesDir = path.join(__dirname, 'templates');
const { name = '' } = config;
// const app = path.join(__dirname, name);
const app = path.join(process.cwd(), name);

function copyProject(src = '', isDir = false) {
    // const dest = src.replace('templates', name);
    const tempname = src.split('/templates')[1] || '';
    const dest = path.join(process.cwd(), name, tempname);
    if (isDir) {
        // dir
        fs.mkdir(dest);
    } else {
        fs.createReadStream(src).pipe(fs.createWriteStream(dest));
    }
}

const delFiles = [];
function deleteProject(pathname, isDir) {
    if (isDir) {
        delFiles.push(pathname);
    } else {
        fs.unlink(pathname, (err) => {
            if (err) throw err;
        })
    }
}

function travelFiles(dir = '', cb, type, finish) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        (function next(i) {
            if (i < files.length) {
                const pathname = path.join(dir, files[i]);
                fs.stat(pathname, (err, stats) => {
                    if (err) throw err;
                    cb && cb(pathname, stats.isDirectory(), type, () => {
                        if (stats && stats.isDirectory()) {
                            travelFiles(pathname, cb, type, () => {
                                next(i + 1);
                            })
                        } else {
                            next(i + 1);
                        }
                    })
                })
            } else {
                finish && finish();
            }
        })(0)
    })
}

function cb(pathname = '', isDir = false, type, finish) {
    switch (type) {
        case 'copy' :
            copyProject(pathname, isDir);
            break;
        case 'deleted' :
            deleteProject(pathname, isDir);
    }
    finish && finish();
}

function finish() {
    console.log(`${clc.blue('create app finish !')}`);
    console.log('启动项目：');
    console.log(`${clc.cyanBright('cd')} ${name}`);
    console.log(`${clc.cyanBright('npm install')}`);
    console.log(`${clc.cyanBright('npm start')}`);
    console.log('编辑打包：');
    console.log(`${clc.cyanBright('npm run build')}`);
}

const createApp = () =>  {
    fs.exists(app, exists => {
        if (!exists) {
            // 未生成
            fs.mkdir(app);
            travelFiles(templatesDir, cb, 'copy', finish);
        } else {
            config.getIsCrateNewApp((result) => {
                // console.log('result==',result.length, result.slice(0, -1) == 'y');
               if (result.slice(0, -1) == 'y') {
                   travelFiles(app, cb, 'deleted', function () {
                       delFiles.unshift(path.join(process.cwd(), name));
                       delFiles.reverse().forEach(dir => {
                           fs.rmdir(dir, function (err) {
                               if (err) throw err;
                           });
                       });
                       console.log(`\n${clc.red('deleted successfully!!!')}`)
                   });
               }
            })
        }
    })
};

module.exports = createApp;