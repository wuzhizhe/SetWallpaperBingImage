var grunt = require("grunt");
grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
    'create-windows-installer': {
        x64: {
            appDirectory: './DownloadBingImage-win32-x64',
            authors: 'wuzhizhe',
            exe: 'DownloadBingImage.exe',
            description:"set bing image as desktop wallpaper",
            setupIcon: './images/Bing_50.ico',
            noMsi: true
        }
    }
})

grunt.loadNpmTasks('grunt-electron-installer');
grunt.registerTask('default', ['create-windows-installer']);