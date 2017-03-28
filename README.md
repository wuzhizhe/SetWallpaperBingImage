# SetWallpaperBingImage
设置必应今日壁纸为桌面壁纸的软件

使用需要的环境：
NodeJs, Npm, NWJS/Electron


新增electron版本，在electron-version目录里有electron版本的代码，与nwjs大同小异，但是初次使用electron这个工具感觉比nwjs好很多。

electron版本使用：
可以使用官方的打包安装工具，也可以使用electron-packager等工具，打包最终生成exe文件使用。

===========================================================

NWJS版本说明：
下载项目后，进入package.json所在的目录，npm install安装需要的依赖包，然后像发布正常的nwjs应用一样打包发布使用就可以。

nwjs安装使用见：[nwjs官方文档](http://docs.nwjs.io/en/latest)

2017-03-23更新

支持设置代理，不能直接上网的情况可以设置代理，只支持HTTP协议。

支持的平台：

windows系统在win7 64位、win10 64位上都使用成功。

linux桌面系统，理论上支持gnome kde xfce等linux常用桌面系统，在unbutu 16.04 gnome桌面测试成功。


