const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
	},
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
	res.send("Server started");
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);
	socket.on("disconnect", () => {
		socket.broadcast.emit("callended");
	});

	socket.on("calluser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("calluser", { signal: signalData, from, name });
	});

	socket.on("answercall", (data) => {
		io.to(data.to).emit("callaccepted", data.signal);
	});
});

server.listen(PORT, () => {
	console.log("App server listening to port 5000");
});
