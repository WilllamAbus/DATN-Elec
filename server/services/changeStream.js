const mongoose = require("mongoose");

// Hàm theo dõi Change Stream
async function monitorChangeStream() {
  try {
    const db = mongoose.connection; 
    const collection = db.collection("productAuction"); 

    // Tạo Change Stream
    const changeStream = collection.watch();

    // Lắng nghe các thay đổi
    changeStream.on("change", (change) => {
      console.log("Change detected:", change);

      // Xử lý sự kiện update
      if (change.operationType === "update") {
        const updatedFields = change.updateDescription.updatedFields;
        console.log("Updated Fields:", updatedFields);

        // Gửi sự kiện qua socket.io nếu có thay đổi giá
        if (updatedFields.currentPrice) {
          global._io.emit("auction update", updatedFields.currentPrice);
        }
      }
    });

    console.log("Change Stream is monitoring...");
  } catch (err) {
    console.error("Error monitoring change stream:", err);
  }
}

module.exports = monitorChangeStream;
