---
id: ssh_android_to_pc
aliases: []
tags: []
description: step to ssh into termux
title: ssh_android_to_pc
---

1. Install Termux in android using F-droid
2. Upgrade softwares.
```
$ pkg update
$ pkg upgrade
```
3. install openssh
```
$ pkg install openssh
```
4. setup a password
```
$ passwd
```
5. Start an ssh server
```
$ sshd  // start an ssh server
$ ifconfig // know your phone inet ip
```
6. In your pc/laptop. 
```
$ ssh <ipaddress of your phone> -p 8022
```
7. Congrats. you have ssh'd into your phone.
8. When done with it
```
$ pkill sshd
```


### Troubleshooting
- Waiting too long - try to ping that ip, Recheck the ip address, reboot your phone.

