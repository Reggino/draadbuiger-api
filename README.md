# Draadbuiger RPi API

## Setup RPi

- Install Raspbian Buster Lite
- Install NVM (as root user)  (https://github.com/nvm-sh/nvm)
- Install yarn (https://classic.yarnpkg.com/en/docs/install/#debian-stable)
- install git
- Install https://elinux.org/RPi-Cam-Web-Interface , configure:
  - autostart=on
  - port=81
- Run 
```
mkdir /data/
cd /data
git clone git@bitbucket.org:Reggino/draadbuiger-api.git
cd draadbuiger-api
npm install 12
npm use 12
yarn
```
Add the following to `/etc/rc.local`
```
cd /data/draadbuiger-api; HOME=/root PATH=$PATH:/root/.nvm/versions/node/v12.15.0/bin yarn run start &
```

## Setup development environment (linux)

- Assign a static IP to the RPi 
- Add the following to `/etc/hosts`: 
```
<THE RPI IP>   draadbuigpi
```
- Add your `/home/<YOUR USERNAME>/id_rsa.pub` to `root@draadbuigpi/~/.ssh/authorized_keys`
- Add your `/home/<YOUR USERNAME>/id_rsa.pub` to `pi@draadbuigpi/~/.ssh/authorized_keys`
- Run
```
sudo mkdir /mnt/rpi
sudo chmod 777 /mnt/rpi
```
- Add the following to ```/etc/fstab```.

```
pi@draadbuigpi:/ /mnt/rpi     fuse.sshfs      defaults,allow_other,IdentityFile=/home/<YOUR USERNAME>/.ssh/id_rsa  0   0
```
- run
```
sudo mount /mnt/rpi
```

- Open /mnt/rpi using your favourite IDE. Any changes should directly restart the API.  

Finshed! 

The RPi should start the API on boot. It can be opened using http://draadbuigpi/
