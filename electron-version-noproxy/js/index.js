'use strict';
const Promise = require('es6-promise').Promise;
const pify = require('pify'),
    os = require('os'),
    electron = require('electron'),
    BrowserWindow = electron.remote.BrowserWindow,
    childProcess = require('child_process'),
    path = require('path'),
    execFile = childProcess.execFile,
    // execFile = pify(childProcess.execFile),
    proxy = window.localStorage.getItem('proxy') || '',
    request = require('request'),
    ratio = '_1920x1080',
    imagePrefix = 'http://global.bing.com/az/hprichbg/rb/',
    imageSuffix = '.jpg',
    localPosition = '.\\',
    apiUrl = 'http://global.bing.com/HPImageArchive.aspx?idx=0&n=1&mkt=zh-cn',
    fs = require('fs'),
    reg = new RegExp('<url>/az/hprichbg/rb/(.*)_1366x768.jpg</url>');

    // gui.App.setProxyConfig(proxy);

    //此处是给request设置代理
let r = request.defaults(),
    __dirname = path.resolve(),
    img = null,
    url = null,
    imagePath = null,

    imageUrl = null;


function setImageUrl() {
    //先从微软的api获取图片URL，用正则表达式截取
    requestBingApi(apiUrl).then(function (data) {
        return makeImageUrl(data);
    }, function (error) {
        console.log(error);
    }).then(function (Url) {
        imageUrl = Url;
    });
}

function showImgOnPage() {
    let win = new BrowserWindow({
        width: 800,
        height: 600
    });
    win.loadURL(imageUrl);
}

function setImageAsWallpaper() {
    imagePath = __dirname + '\\' + img + ratio + imageSuffix;
    if (fs.existsSync(imagePath)) {
        excuteSetWallPaper(imagePath);
    } else {
        requestBingImage(imageUrl).then(function () {
            excuteSetWallPaper(imagePath);
        }, function (err) {
            console.log(err);
        });
    }
}

function excuteSetWallPaper(imagePath) {
    let platform = os.platform();
    switch (platform) {
        case 'win32':
            // let bin = path.join(__dirname, '\\app-1.0.0\\resources\\tools\\win\\WallpaperChanger.exe');
            let bin = path.join(__dirname, '\\resources\\app.asar\\tools\\win\\WallpaperChanger.exe');
            // let bin = path.join(__dirname, '\\tools\\win\\WallpaperChanger.exe');
            console.log(imagePath)
            execFile(bin, [imagePath], function() {});
            break;
        case 'linux':
            let desktop = childProcess.execSync('echo "$XDG_DATA_DIRS" | grep -Eo "gnome|unity|cinnamon|mate|kde|xfce|lxde"')
            let command = 'gsettings set  org.'+ desktop +'.desktop.background picture-uri "file://'+ imagePath +'"';
            command = command.replace(/[\r\n]/g, "");
            childProcess.exec(command);
            break;
        default:
            break;
    }
}

function makeImageUrl(data) {
    reg.test(data);
    img = RegExp.$1;
    url = imagePrefix + img + ratio + imageSuffix;
    return url;
}

function requestBingApi(apiUrl) {
    return new Promise(function (resolve, reject) {
        r.get(apiUrl, function (error, res, body) {
            if (error) {
                return reject(error);
            } else if (200 !== res.statusCode) {
                err = new Error('Unexpected status code: ' + res.statusCode);
                err.res = res;
                return reject(err);
            } else {
                return resolve(body);
            }
        });
    });
}

function requestBingImage(imageUrl) {
    return new Promise(function (resolve, reject) {
        let writeImage = fs.createWriteStream(imagePath)
        r.get(url, function (error, res, body) {
            if (error) {
                return reject(error);
            } else if (200 !== res.statusCode) {
                let err = new Error('Unexpected status code: ' + res.statusCode);
                err.res = res;
                return reject(err);
            }
        }).pipe(writeImage);
        writeImage.on('finish', function () {
            resolve();
        });
    });
}

window.onload = function() {
    setImageUrl();
    document.querySelector('#setBkgBtn').onclick = function(e) {
        showImgOnPage();
    };
    document.querySelector('#downToLocalBtn').onclick = function(e) {
        setImageAsWallpaper();
    };
}