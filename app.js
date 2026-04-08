const express = require('express')
const app = express()

const contactRoute = require('./Routes/contact')
const userRoute =require('./Routes/user')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')


// mongoose.connect('mongodb+srv://divyanka:divyanka2006@sbs.gxkmfb7.mongodb.net/?appName=SBS')
// .then(()=>{
//     console.log('connected with database')
// })
// .catch(err=>{
//     console.log('something is wrong')
//     console.log('err')
// })

const connectWithDatabase = async() => {
    try {
        await mongoose.connect('mongodb+srv://divyanka:divyanka2006@sbs.gxkmfb7.mongodb.net/?appName=SBS')
        console.log("connect to database")
    }
    catch(err){
        console.log("something is wrong")
        console.log(err)
    }
}

connectWithDatabase()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/user',userRoute)
app.use('/contact',contactRoute)

module.exports = app






// const express = require('express')
// const app = express()
// const userRoute = require('./Routes/user')
// const contactRoute = require('./Routes/contact')
// const mongoose = require('mongoose')
// const bodyParser = require('body-parser')

// // mongoose.connect('mongodb+srv://ritesh:reet1234@rcp.ztvgqtz.mongodb.net/?appName=RCP')
// // .then(() => {
// //     console.log("Connected to Database")
// // })
// // .catch(err => {
// //     console.log('something went wrong')
// //     console.log(err)
// // })

// const connectWithDatabase = async() => {
//     try {
//         await mongoose.connect('mongodb+srv://divyanka:divyanka2006@sbs.gxkmfb7.mongodb.net/?appName=SBS')
//         console.log("Connected to database")
//     }
//     catch(err){
//         console.log('Something is wrong')
//         console.log(err)
//     }
// }

// connectWithDatabase()


// app.use(bodyParser.urlencoded())
// app.use(bodyParser.json())


// app.use('/user', userRoute)
// app.use('/contact', contactRoute)
// // app.use('/contact', userContact)

// module.exports = app