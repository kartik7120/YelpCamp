const express = require("express");
const app = express();
const path = require("path");
const Campground = require("./models/campground");
app.use(express.urlencoded({ extended: true }))
const mongoose = require('mongoose');
const ejsmate = require("ejs-mate");
const meathodOverride = require("method-override");
const joi = require("joi");
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");
const { join } = require("path");
mongoose.connect('mongodb://localhost:27017/campground')
    .then(() => {
        console.log("CONNETED TO MONGO DB");
    })
    .catch((err) => {
        console.log("OH NO ERROR");
        console.log(err);
    })
app.engine("ejs", ejsmate);
// ejs mate will allow us to make boiler plate and it will dynamically add in our templates 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(meathodOverride("_method"));
app.get("/", (req, res) => {
    res.render("home");
})

app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}))

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = Campground.findById(req.params.id);
    campground.then((data) => res.render(`campgrounds/edit`, { campground: data }));
}))

app.put("/campgrounds/:id", catchAsync(async (req, res) => {
    // res.send("IT WORKED");
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body });
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.post("/campgrounds", catchAsync(async (req, res, next) => {
    // if (!req.body.campground) {
    //     throw new ExpressError("Invalid Campground data", 400);
    // }
    const campgroundSchema = joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().required(),
        description: joi.string().required()
    }).required();
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        console.log(result);
        const { title, location, image, description, price } = req.body;
        const campground = new Campground({ title, location, image, description, price });
        await campground.save();
        res.redirect(`campgrounds/${campground._id}`);
    }
}))

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndRemove(req.params.id);
    res.redirect("/campgrounds");
}));



app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})

// app.get("/makecampground", async (req, res) => {
//     const camp = new Campground({ title: "My Backyard" ,price:350,description:"cheap camp"});
//     await camp.save();
//     res.send(camp);
// })

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong";
    }
    res.status(status).render("error", { err });
    // res.send("OH BOY SOMETHING WENT WRONG");
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})


// Seeding data is a fake data that we will store in the database so that we ensure that our all paths are working and data is being stored in the database
