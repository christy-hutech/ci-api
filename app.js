const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

data =  [
  {
    ID:"2",
    post_author:"1",
    post_date:"2009-10-08 08:20:10",
    post_date_gmt:"2009-10-08 13:20:10",
    post_content:`<p>CI is an entirely volunteer-driven, non-profit, non-sponsored portal that aims to facilitate nature conservation by providing reliable information as well as the practical knowledge needed to act effectively.</p>

    <div >
    <p><strong>Register with CI</strong></p>
    <p>While you can view almost anything on CI as a guest user, registering allows you the following privileges:</p>
    
    <ul>
         <li>Comment on all posts and images</li>
         <li>Upload images directly to the site</li>
         <li>Receive intimations on workshops, film screenings &amp; other offline events</li>
    </ul>
    <p><a class="login_link"  href="/register">Register</a></p>
    
    </div>
    <p>We define conservation as knowledge-driven actions that lead to the effective management and recovery of wildlife. That means giving priority to meeting the ecological needs of wildlife populations in decline and to the recovery and expansion of their habitats.</p>
    <p>CI is committed to promoting conservation strategies that are rooted in evidence.</p>
    <p>With wildlife and wildlands now reeling under unsustainable demands from all sectors - urban and rural, industrial and agricultural - there is little time left. Therefore, CI aspires to be a springboard for rational and practical conservation action, rather than a platform for theoretical debate.</p>
    <p>Come join us, act now.</p>
    
    
    <hr />
    <p><strong>Note to Users</strong></p>
    <p>Thank you for visiting CI.</p>
    <p>This portal will always remain a work in progress, and we would be grateful if readers could point out any errors or inaccuracies (please site the page URL).  Our goal is to make CI as comprehensive as possible. So if there's anything else you would like to see on the site, please let us know and we'll do our best to include it. Feel free to contact us at: info&lt;at&gt;conservationindia&lt;dot&gt;org.</p>
    <p>Thanks!</p>
    <p>CI Team</p>`,
    post_title:"Conservation India",
    post_excerpt:"",
    post_status:"publish",
    comment_status:"open",
    ping_status:"open",
    post_password:"",
    post_name:"about-ci",
    to_ping:"",
    pinged:"",
    post_modified:"2020-12-28 14:31:53",
    post_modified_gmt:"2020-12-28 09:01:53",
    post_content_filtered:"",
    post_parent:"0",
    guid:"http:\\conservationindia.org\?page_id=2",
    menu_order:"0",
    post_type:"page",
    post_mime_type:"",
    comment_count:"1"
  },
  {
    ID:"2",
    post_author:"1",
    post_date:"2009-10-08 08:20:10",
    post_date_gmt:"2009-10-08 13:20:10",
    post_content:`<p>CI is an entirely volunteer-driven, non-profit, non-sponsored portal that aims to facilitate nature conservation by providing reliable information as well as the practical knowledge needed to act effectively.</p>

    <div >
    <p><strong>Register with CI</strong></p>
    <p>While you can view almost anything on CI as a guest user, registering allows you the following privileges:</p>
    
    <ul>
         <li>Comment on all posts and images</li>
         <li>Upload images directly to the site</li>
         <li>Receive intimations on workshops, film screenings &amp; other offline events</li>
    </ul>
    <p><a class="login_link"  href="/register">Register</a></p>
    
    </div>
    <p>We define conservation as knowledge-driven actions that lead to the effective management and recovery of wildlife. That means giving priority to meeting the ecological needs of wildlife populations in decline and to the recovery and expansion of their habitats.</p>
    <p>CI is committed to promoting conservation strategies that are rooted in evidence.</p>
    <p>With wildlife and wildlands now reeling under unsustainable demands from all sectors - urban and rural, industrial and agricultural - there is little time left. Therefore, CI aspires to be a springboard for rational and practical conservation action, rather than a platform for theoretical debate.</p>
    <p>Come join us, act now.</p>
    
    
    <hr />
    <p><strong>Note to Users</strong></p>
    <p>Thank you for visiting CI.</p>
    <p>This portal will always remain a work in progress, and we would be grateful if readers could point out any errors or inaccuracies (please site the page URL).  Our goal is to make CI as comprehensive as possible. So if there's anything else you would like to see on the site, please let us know and we'll do our best to include it. Feel free to contact us at: info&lt;at&gt;conservationindia&lt;dot&gt;org.</p>
    <p>Thanks!</p>
    <p>CI Team</p>`,
    post_title:"Conservation India",
    post_excerpt:"",
    post_status:"publish",
    comment_status:"open",
    ping_status:"open",
    post_password:"",
    post_name:"about-ci",
    to_ping:"",
    pinged:"",
    post_modified:"2020-12-28 14:31:53",
    post_modified_gmt:"2020-12-28 09:01:53",
    post_content_filtered:"",
    post_parent:"0",
    guid:"http:\\conservationindia.org\?page_id=2",
    menu_order:"0",
    post_type:"page",
    post_mime_type:"",
    comment_count:"1"
  }
]
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to mock server");
});
app.post("/upload", async (req, res) => {
  if (req.body.file) {
    res.status(200).json({ result: "file found" });
  } else res.status(200).json({ result: "file not found" });
});

app.get("/api/get-ci", async (req, res) => {
  res.status(200).json({success:true, statusCode:200,data:data });
 });


const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT"] },
});

let allOnlineUsers = [];

io.on("connection", (socket) => {
  //on disconnect
  socket.on("disconnect", function () {
    let userdiscn = allOnlineUsers?.filter((u) => u.socketid == socket.id);
    allOnlineUsers = allOnlineUsers?.filter((u) => u.socketid != socket.id);
    socket.broadcast.emit("resetonlineusers", allOnlineUsers, userdiscn);
  });

  socket.on("useroffline", function (userid) {
    let userdiscn = allOnlineUsers?.filter((u) => u.userid == userid);
    allOnlineUsers = allOnlineUsers?.filter((u) => u.userid != userid);
    socket.broadcast.emit("resetonlineusers", allOnlineUsers, userdiscn);
  });

  let usersocketid = socket.id;
  socket.emit("yourID", { usersocketid, allOnlineUsers });

  socket.on("joinsuccess", (onlineusers) => {
    allOnlineUsers = onlineusers;
    socket.broadcast.emit("resetonlineusers", onlineusers);
  });

  //join all rooms
  socket.on("joinrooms", (rooms) => {
    socket.join(rooms);
  });

  //received public message
  socket.on("sendpublicmsg", (msginfo) => {
    io.emit("newpublicmsg", msginfo);
  });

  //received private message
  socket.on("sendpvtmsg", (msginfo) => {
    if (msginfo.tosocket) {
      socket.broadcast
        .to(msginfo.tosocket)
        .emit("newprivatemsg", msginfo.message);
    }
  });

  //received room message
  socket.on("sendroommsg", ({ message, roomid }) => {
    if (message && roomid) {
      io.in(roomid).emit("newroommsg", { message, roomid });
    }
  });
});

server.listen(3001, (err) => {
  if (!err) {
    console.log("server started at 3001");
  } else {
    console.log("failed to start server");
  }
});

//sending to sender-client only
// socket.emit('message', "this is a test");

//sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");

//sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');

//sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');

//sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');

//sending to all clients, include sender
// io.emit('message', "this is a test");

//sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');

//sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');

//send to all connected clients
// socket.emit();

//send to all connected clients except the one that sent the message
// socket.broadcast.emit();

//event listener, can be called on client to execute on server
// socket.on();

//for emiting to specific clients
// io.sockets.socket();

//send to all connected clients (same as socket.emit)
// io.sockets.emit();

//initial connection from a client.
// io.sockets.on() ;
