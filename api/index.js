const express = require('express');
const routes = require('./Routes/routes')
const cors = require('cors');
const connectDb = require('./db');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const download = require('image-downloader');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Place = require('./models/Place');
const Booking = require('./models/Booking');
const { promisify } = require('util'); // Import the promisify function from the 'util' module
const writeFileAsync = promisify(fs.writeFile);
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const Razorpay = require('razorpay');
const Review = require('./models/Reviews');


const app = express();
require('dotenv').config();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtsecret = process.env.jwtsecret;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '/uploads').replace(/\\/g, '/')));
// console.log(path.join(__dirname, '/uploads'));

app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:4000',
            'https://airbnb-clone-one-red.vercel.app'
            , 'https://airbnb-clone-git-master-anuragasawa20.vercel.app'
            , 'https://airbnb-clone-suc98ywod-anuragasawa20.vercel.app', 'https://airbnb-clone-anuragasawa20.vercel.app'],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.use(express.json());

app.get("/", (req, res) => {
    res.send(`<h1>Server is Working</h1>`);
})

connectDb();

function getUserData(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtsecret, {}, (err, userData) => {
            if (err)
                throw err;
            resolve(userData);
        })
    })
}

app.post('/api/payment/order', async (req, res) => {
    const options = {
        amount: req.body.amount, // amount in paise
        currency: 'INR',
        receipt: 'order_receipt',
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


app.get('/payment/razorpaykey', async (req, res) => {
    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID
    });
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // console.log(email);
    try {
        const userDoc = await User.findOne({ email });
        if (userDoc) {
            const passMatch = bcrypt.compareSync(password, userDoc.password);
            console.log(passMatch);
            if (passMatch) {
                jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtsecret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(userDoc);
                });
                // res.json('login successful')
            }
            else {
                res.status(422).json({ error: 'invalid password', status: false });
            }
        }
        else {
            res.json({ message: "email not exist", status: false });
        }
    }
    catch (e) {
        res.status(422).json({ error: e, status: false });
    }
});

app.post('/register', async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const userDetail = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        })
        res.json({ userDetail: userDetail, message: "registration successful", status: true });
    }
    catch (e) {
        res.status(422).json({ error: e, status: false, message: "registration failed" });
    }
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtsecret, {}, async (err, user) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(user.id);
            res.json({ name, email, _id });
        })
    }
    else {
        res.json(null);
    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
})

app.get('/search/:searchLocation', async (req, res) => {
    //const { query } = req.query;
    searchLocation = req.params.searchLocation;
    searchLocation_KEY = process.env.searchLocation_KEY;
    console.log(searchLocation);
    try {
        axios.get(`https://eu1.locationiq.com/v1/search.php?key=${searchLocation_KEY}&q=${encodeURIComponent(
            searchLocation
        )}&format=json`).then((response) => {
            //  console.log(response.data);
            res.json(response.data);
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from eu1' });
    }
});

app.get('/places/searchbyCategory/:category', async (req, res) => {
    //const { query } = req.query;
    const { token } = req.cookies;
    if (!token) {
        res.json({ error: "please Login first" });
    }
    let category = req.params.category;
    console.log(category);
    try {

        const places = await Place.find({ selectedCategory: category });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from place' });
    }
})


app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = '/photo' + Date.now() + '.jpg'
    const fp = path.join(__dirname, '/uploads');
    const pathWithSlash = fp.replace(/\\/g, '/');
    try {
        await download.image({
            url: link,
            dest: pathWithSlash + newName
        })

        // Upload the downloaded image to Cloudinary
        const uploadedFile = await cloudinary.uploader.upload(pathWithSlash + newName, {
            folder: 'uploads', // Specify the folder in Cloudinary where the file should be saved
            use_filename: true // Use the original filename
        });

        // Store the public URL of the uploaded file
        const publicURL = uploadedFile.secure_url;

        // Delete the image from the server (optional, depends on your use case)s
        fs.unlinkSync(pathWithSlash + newName);

        res.json(publicURL);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error downloading or uploading the file' });
    }
})

const multerMiddleware = multer();
app.post('/upload', multerMiddleware.array('photos', 100), async (req, res) => {
    // const uploadedFiles = [];
    // for (let i = 0; i < req.files.length; i++) {

    //     const { path, originalname } = req.files[i];
    //     const pathWithSlash = path.replace(/\\/g, '/');
    //     const parts = originalname.split('.');
    //     const ext = parts[parts.length - 1];
    //     const newPath = pathWithSlash + '.' + ext;
    //     fs.renameSync(path, newPath);
    //     const Path = newPath.replace('uploads/', '')
    //     uploadedFiles.push(Path);
    // }
    // // console.log(uploadedFiles);
    // res.json(uploadedFiles);
    //console.log(req.files);
    try {
        const uploadedFiles = [];

        for (const file of req.files) {
            // Convert the file buffer to a temporary file on the server
            const tempFilePath = `uploads/${Date.now()}_${file.originalname}`;
            await writeFileAsync(tempFilePath, file.buffer);

            // Upload the temporary file to Cloudinary
            const uploadedFile = await cloudinary.uploader.upload(tempFilePath, {
                folder: 'uploads', // Specify the folder in Cloudinary where the file should be saved
                use_filename: true // Use the original filename
            });

            // Store the public URL of the uploaded file in the array
            uploadedFiles.push(uploadedFile.secure_url);

            // Delete the temporary file from the server
            fs.unlinkSync(tempFilePath);
        }
        res.json(uploadedFiles);

    }
    catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        res.status(500).json({ error: 'Error uploading file to Cloudinary' });
    }
});

app.post('/api/reviewPlace/:id', async (req, res) => {
    const placeId = req.params.id;
    const { name, content } = req.body;
    const userData = await getUserData(req);
    if (!userData) {
        res.status(500).json("please login firstly");
    }
    const newReview = new Review({ userName: name, content, placeId });
    console.log(name, content, placeId);
    try {
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(400).json({ error: 'Error creating review' });
    }
})

app.get('/api/getReview/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const reviews = await Review.find({ placeId: id });
        console.log(reviews);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews' });
    }
})

app.post('/places', (req, res) => {

    const { token } = req.cookies;
    const { title, address, photos,
        description, perks, extrainfo,
        checkIn, checkOut, maxGuests, price, selectedCategory } = req.body;
    // console.log(selectedCategory);
    jwt.verify(token, jwtsecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id,
            title, address, photos,
            description, extraInfo: extrainfo, perks,
            checkIn, checkOut, maxGuests, price, selectedCategory
        })
        res.json(placeDoc);
    })
})

app.get('/user-places', async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtsecret, {}, async (err, userData) => {
        if (err) throw err;
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    })
});

app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
})

app.put('/places', async (req, res) => {
    const { token } = req.cookies;
    const { id, title, address, photos,
        description, perks, extrainfo,
        checkIn, checkOut, maxGuests, price, selectedCategory } = req.body;

    jwt.verify(token, jwtsecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            await placeDoc.set({
                title, address, photos,
                description, extraInfo: extrainfo, perks,
                checkIn, checkOut, maxGuests, price, selectedCategory
            });
            await placeDoc.save();
            res.json('ok');
        }
    })
})

app.delete('/places/delete/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const deletedPlace = await Place.findByIdAndDelete({ _id: id });
        res.status(200).json({ message: "place deleted succcesfully", deletedPlace })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }

})

app.get('/places', async (req, res) => {
    res.json(await Place.find());
})

app.get('/place/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
})

app.get('/places/search/:location', async (req, res) => {
    const { location } = req.params;
    //const userData = await getUserData(req);
    //console.log(location);
    const query = Place.find({ $text: { $search: `${location}` } })

    query.exec()
        .then(results => {
            // Process the query results
            //  console.log(results);
            res.json(results);
        })
        .catch(err => {
            // Handle the error
            console.error(err); ``
        });
    // console.log(places);
    // res.json(places);
})

app.post('/booking', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        res.json({ error: "please Login first" });
    }
    const userData = await getUserData(req);
    const { checkIn, checkOut, maxGuests, name, PhoneNumber, price, place } = req.body;
    try {
        const response = await Booking.create({
            checkIn, checkOut, maxGuests, name, phone: PhoneNumber, price, place
            , user: userData.id
        });
        res.json(response);
    }
    catch (err) {
        throw err;
    }
})

app.delete('/booking/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    if (!token) {
        res.json({ error: "please Login first" });
    }
    try {
        const deletedBooking = await Booking.findByIdAndDelete({ id });
        res.status(200).json({ message: "Booking Deleted successfully" });
    }
    catch (err) {
        res.json(err).status(500);
    }
})


app.get('/bookings', async (req, res) => {
    const userData = await getUserData(req);
    res.json(await Booking.find({ user: userData.id }).populate('place'));
})


app.listen(4000, () => { console.log("app is running on port 4000") });         