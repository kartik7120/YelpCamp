const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const path = require("path");

mongoose.connect('mongodb://localhost:27017/campground')
    .then(() => {
        console.log("SEED CONNECTED TO MONGO DB");
    })
    .catch((err) => {
        console.log("SEED COULD NOT CONNECT TO MONGO DB");
    })

const sample = (arr) => {
    return arr[(Math.floor(Math.random() * arr.length))]
}

const seedDb = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({ title: "purple feild" });
    // await c.save();
    for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://images.unsplash.com/photo-1518602164578-cd0074062767?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo velit dolor consequatur incidunt, vitae explicabo aperiam similique aspernatur amet repellat, non, facilis harum quibusdam earum! Ab dolores accusantium dolor sint",
            price: price
        })
        await camp.save();
    }
}
// seed Db is an async function and it automatically returns a promise
seedDb().then(() => {
    mongoose.connection.close(); // This is used to close the connection between mongoose and our database MongoDB
})