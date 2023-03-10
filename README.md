# FileDrop

## Overview
### FileDrop is a simple private hosting file manager with sharing capabilities

## Features
* File Upload and Management
* Share via Links, QR Code or Email
* Apple web-app support, can be used in full screen mode on apple devices
* Hide Files
* Notes Manager
* Occupied Space Overview
* Security Notifications (via Email) and Security page

## Technologies Used
* PHP (API)
* Javascript (UI Manager)
* CSS
* MySQL (Database)

## Installation Process
* Clone this repository with ```git clone "https://github.com/seba-daves/FileDrop" ```
* Create a ``` uploads``` folder **OUTSIDE** of your hosting folder, so that it can't be accessed from the internet, verify that the user running the hosting has privileges to read and write to the folder
* Go to the ```/api/index.php ``` file and set the **FQDN** (IP Address or Domain Name used to access FileDrop), **Protocol** (http or https), **Uploads Path** (Relative or Absolute path to the uploads folder you previosly created), **Server Email (SRVEMAIL)** (The Email address you will be using to send out Security Notifications and Sharing links)
* Go to the ```/api/incls.php ``` file and set your MySQL server properties in the corresponding fields
* Go to the ```/api/configure-db.php ``` file and set your MySQL server properties in the corresponding fields
* Start your server
* Open a browser and type ```https://your_ip/api/configure-db.php``` You will be asked to insert the credentials for the first FileDrop user, compile the form and click Configure, the script will generate the ``` `filedrop` ``` database and its tables, after execution, the script will delete itself and redirect to the homepage
* Login using the "User Button" on the top right corner and start using FileDrop.

