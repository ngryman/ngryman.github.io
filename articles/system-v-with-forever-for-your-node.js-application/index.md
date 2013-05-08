The alternative to its Upstart [brother](http://ngryman.tumblr.com/post/32830060834/upstart-with-forever-for-your-nodejs-application)
on a **Debian** system with the same use case.

Here it is:

<script src="https://gist.github.com/ngryman/3834896.js"></script>

To enable your boot script:

- Remove the .sh extension from the gist.
- Move it into the /etc/init.d directory.
- Make it executable by running sudo chmod 755 /etc/init.d/service.
- Register the script for (re)boot by running update-rc.d service defaults.

## See also

- [Upstart with forever for your node.js application](http://ngryman.tumblr.com/post/32830060834/upstart-with-forever-for-your-nodejs-application)
- [Making scripts run at boot time with Debian](http://www.debian-administration.org/articles/28)
- [How to LSBize an Init Script](http://wiki.debian.org/LSBInitScripts)

---
```json
{
  "title": "System V with forever for your node.js application",
  "created": "2012-10-08T21:57:04.149Z",
  "published": "true",
  "updated": "2013-05-08T15:58:37.554Z"
}
```
