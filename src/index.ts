import server from "./app";
import connectDB from "./config/db";

connectDB();

server.listen(process.env.PORT, () => {
  console.log("server started");
});
