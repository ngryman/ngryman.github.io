Servers reboot while you are sleeping, it happens …

So you already are using the great *[forever]* tool. No? take a look [here]!.
But something is missing: **automatic startup of your application when the machine (re)boots**.

[forever]: https://github.com/nodejitsu/forever
[here]: http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever

## The use case

Multiple options are available to you, and quite a lot of resources on the subject too. But I really want to focus on a tricky use case (mine):

- You want to use *forever* to **daemonize**, **manage** and **monitor** your application.
- You want something simple to **start automatically** your application when the server (re)boots.
- Your application is located in the **home directory** of a **dedicated user**.
- It **does not** run on the port **80**.
- You **don’t want** to start it as **super user**.

## Upstart

Basically you need to set up your own Linux service. I will only focus on **upstart** which is a *"replacement for the venerable System-V init"*.

As a vast majority of Linux services, you can **start**, **stop** and **restart** your application. These features are already provided by *forever*.
We will only provide a way to **start automatically** your application. The newly crafted service will only have that purpose. To manage your application, use *forever* as usual.
We could probably wrap *forever* behaviour in the service, but this really not the aim of this article.

## The upstart script

Right of the bat, here is the script:

<script src="https://gist.github.com/ngryman/3823330.js"></script>

## See also

[Deploying Node.js With Upstart and Monit](http://howtonode.org/deploying-node-upstart-monit)
[Deploying node.js with Upstart](http://caolanmcmahon.com/posts/deploying_node_js_with_upstart)
[Running a Node.js Server as a Service Using Forever](http://www.exratione.com/2011/07/running-a-nodejs-server-as-a-service-using-forever)
[Manage Linux init or startup scripts](http://www.debianadmin.com/manage-linux-init-or-startup-scripts.html)

---
```json
{
  "title": "Upstart with forever for your node.js application",
  "created": "2012-10-07T16:13:26.149Z",
  "published": "true",
  "updated": "2013-08-11T15:23:11.348Z"
}
```
