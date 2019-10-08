# Logbook

## 08.10.2019

### Morning

Imported 3D model of Thymio robot and added it to the scene (scaled and rotated), lots of problems with modules and such.

### Afternoon

Corrected spelling errors in the documentation.
Creation of the logbook and the configuration markdown files.
Set up the Windows Virtual Machine with a webserver. Created a gmail and a github account for the webserver side. Set up the local web server with Internet Infomation Service (IIS) Manager, which is an inbuilt software of windows 10 and allows the user to easily host webserver. The step by step instruction of https://mywindowshub.com/how-to-install-and-setup-a-website-in-iis-on-windows-10/ was lacking a crucial information, that is the configuration of the hosts file used by TCP/IP at the location C:\Windows\System32\drivers\etc. Afterwards the website was booting and showing the wanted scene with one issue. The model was not loaded properly.
> Failed to load resource: the server responded with a status of 404 (Not Found) :85/Models/Thymio_3d_Model/obj.mtl:1
