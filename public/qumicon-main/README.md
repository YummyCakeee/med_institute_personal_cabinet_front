# qumicon
Video conference application based on Janus WebRTC that can be attached to any website

## Getting started

Next topic is about how to use attach qumicon to your website

### Requirements
- [`docker`](https://docs.docker.com/)
- [`supervisord`](http://supervisord.org/installing.html)
- cron (optional, recommended)

### Installation

#### Pull images
```bash
# Pull Janus image
docker pull maxonfjvipon/qumicon-janus:latest

# Pull SignalR hub image
docker pull maxonfjvipon/qumicon-hub:latest
```

#### Create containers
```bash
docker create -p 7088:7088/tcp \
   -p 8088:8088/tcp \
   -p 8188:8188/tcp \
   --name qumicon-janus maxonfjvipon/qumicon-janus
   
docker create -p 5264:80/tcp --name qumicon-hub maxonfjvipon/qumicon-hub
```

#### Start containers
```bash
docker start qumicon-janus
   
docker start qumicon-hub
```

Docker containers should start now. Run `docker ps` and make sure they are running. 

#### Setup cron (optional, recommended)
Do `crontab -e` and past next 2 lines to the cron configuration, save and close crontab

```cron
0 3 * * * sudo docker container restart qumicon-janus
0 3 * * * sudo docker container restart qumicon-hub
```

These 2 lines restart containers every day at 3 AM (just for prevention)

#### Attach to the website

Clone the repository and place somewhere near your website you want to attach to.

Add this peace of code to the `<head>` tag of your index.html:

```html
<link rel="stylesheet" href="path/to/qumicon/folder/on/your/server/build/assets/qumicon.css"/>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/8.2.0/adapter.min.js" ></script>
<script type="text/javascript">
    window.qumicon_config = {
        janus: "ws://domain.to.media-server:8188",
        hub: "http://domain.to.media-server:5264/qumicon-hub",
        hasAuth: true,
        login: {
            method: 'POST',
            url: 'path/to/login/route',
            fields: {
                login: "userName",
                password: "password"
            }
        },
        userInfo: {
            method: 'GET',
            url: 'path/to/userInfo/route'
        },
    }
</script>
<script type="module" src="path/to/qumicon/folder/on/your/server/build/assets/qumicon.js"></script>
```

Please note that:
- you need to replace "domain.to.media-server" with domain of the web-server where media server hosts.
- if you want only authorized users on your website may use `qumicon` - set `hasAuth` to `true`. If it will be false
next steps won't be matter
- you need to specify urls to your API methods: login and userInfo
- for the test purposes you may specify paths to static .json files instead of urls of real API (see examples of files [here](https://github.com/maxonfjvipon/qumicon/tree/main/build/static))
- you may specify method and names of the fields that will be sent with requests

### Test
Open your site and log in. Float button at the right bottom corner should appear. Click it and make sure there's no errors. Enjoy

## Todo
- Authorization token for an instance of Janus
- Pretty UI, grid modes
- Room management (kick, mute, etc.) for admin users
- Chat history (?)
