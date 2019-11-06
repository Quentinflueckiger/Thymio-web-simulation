# Configuration, administration of the web server and accounts


## Windows Virtual Machine

### User information

On demand.

### Access the Virtual Machine

|   | Linux WM - ssh  | Windows VM - rdp  |
|---|---|---|
| Windows  | Putty  | Remote Desktop Connection  |
| Linux  | terminal  | Remmina  |
| MacOs  | terminal  | Microsoft Remote Desktop  |

See link bellow for more information and links. (It needs bfh network to access or bfh vpn)
https://intranet.bfh.ch/TI/fr/Studium/Bachelor/Informatik/Tools/VMsHowto/Pages/default.aspx?k=vm

### First Configuration

We followed the steps in this tutorial video in order to configure IIS.
https://www.youtube.com/watch?v=rPRLe7QeVHM

Then we had to open the port in order to access it from within the LAN.
1. Open the windows Firewall, click on Inbound Rules and New Rule. This will open the New Inbound Rule Wizard.
2. Select the desired type, Port, click next.
3. Choose TCP and specify the port used, here 80, click next.
4. Select Allow connection, click next.
5. Select all three profile options, click next.
6. Add a Name and a description to this rule, click finish.

With this specified the website is now accessible from within the LAN at the following address : http://147.87.116.44/Code/HTML/

### Additional setup

It was needed to create a web.config file and add a few file extension so that the .mtl and .obj would still be able to load. Otherwise we encountered an error of the type "Failed to load resource: the server responded with a status of 404 (Not Found)." The text that needed to be added to the web.config file is the following : "<?xml version="1.0" encoding="UTF-8"?>
      <configuration>
          <system.webServer>
               <staticContent>
                 <remove fileExtension=".mtl" />
                 <mimeMap fileExtension=".mtl" mimeType="text/plain" />
                 <mimeMap fileExtension=".obj" mimeType="application/octet-stream" />
               </staticContent>
          </system.webServer>
      </configuration>
"
