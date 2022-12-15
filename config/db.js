const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI);
    console.log(`MongoDB COnnected: ${conn.connection.host}`.cyan.underline);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
;