import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() =>
      console.log(`db successfully connected ${process.env.MONGO_URL}`)
    )
    .catch((err) => console.log(`faild to connect to db beacuse ${err}`));
};


export default dbConnection

// nsohila03
// zJmaeEd5xUFsuSzu;