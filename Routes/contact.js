require('dotenv').config();
const express = require('express')
const Router = express.Router()
const Contact = require('../models/Contact')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name:'drmvd6rit',
    api_key:'687331157955366',
    api_secret:'4k5hlb3PcoRSMApfz5RtuFokDcQ'
})

// add contact

// Router.post('/add-contact',(req,res)=>{
//     const newContact = new Contact({
//         fullName:req.body.name,
//         email:req.body.person_email,
//         phone:req.body.person_phone,
//         address:req.body.add
//     })

//     newContact.save()
//     .then((newData)=>{
//         console.log('data saved')
//         res.status(200).json({
//            result:newData
//         })
//     })
//     .catch((err)=>{
//         console.log(err)
//         res.status(500).json({
//             error:err
//         })
//     })
// })


Router.post('/add-contact',async(req,res)=>{
    try {
        console.log(req)
        // console.log(req.headers.authorization.split(" ")[1])
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        console.log(tokenData)

        const uploadedResult = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
        console.log(uploadedResult)

        const newContact = new Contact({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            gender:req.body.gender,
            userId:tokenData.userId,
            imageId:uploadedResult.public_id,
            imageUrl:uploadedResult.secure_url
        })
        
        const newData = await newContact.save()
        res.status(200).json({
            result:newData
        })

    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

// get all contact
Router.get('/all-contact',async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const allContact = await Contact.find({userId:tokenData.userId}).select("_id fullName email phone address gender userId imageUrl").populate('userId','fullName phone')
        res.status(200).json({
            contacts:allContact
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})


// get contact by id
Router.get('/contactById/:id',async(req,res)=>{
    try
    {
        // console.log(req.params.id)
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const id = req.params.id
        // const data = await Contact.findById(id).select("_id fullName email phone address gender userId")
        const data = await Contact.find({_id:req.params.id,userId:tokenData.userId})
        return res.status(200).json({
            contact:data.length>0 ? data[0] : {}
        })
        


    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

// get contact by gender
Router.get('/gender/:g',async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const contact = await Contact.find({gender:req.params.g,userId:tokenData.userId})
        res.status(200).json({
            contact:contact
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

// delete api 
Router.delete('/:id',async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const contact = await Contact.findById(req.params.id)
        if(contact.userId != tokenData.userId)
        {
            return res.status(500).json({
                error:'invalid user'
            })
        }
        await cloudinary.uploader.destroy(contact.imageId)
        await Contact.deleteOne({_id:req.params.id,userId:tokenData.userId})
        res.status(200).json({
            msg:'data deleted'
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

// delete many data
Router.delete('/byGender/:gender',async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        await Contact.deleteMany({gender:req.params.gender,userId:tokenData.userId})
        res.status(200).json({
            msg:'all contact of this gender deleted....'
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

// update 
Router.put('/update/:id',async(req,res)=>{
    try
    {
        console.log(req.body)
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const contactData = await Contact.findById(req.params.id)

        if(contactData.userId != tokenData.userId)
        {
            return res.status(500).json({
                msg:'you dont have permission to update this data'
            })
        }
        // console.log(contactData)
        const newData = {
            fullName:req.body.fullName,
            email:req.body.email,
            phone:req.body.phone,
            address:req.body.address,
            gender:req.body.gender,
            userId:req.body.userId
        }
        //balram k code (yaha se)

        if(req.files)
        {
            await cloudinary.uploader.destroy(IDContact.imageId)
            const uploadedresult=await cloudinary.uploader.upload(req.files.photo.tempFilePath)
            newData['imageId']=uploadedresult.public_id
            newData['imageUrl']=uploadedresult.secure_url
        }
        else{
            newData['imageId']=IDContact.imageId
             newData['imageUrl']=IDContact.imageUrl
        }
        //yaya tk
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id,newData,{new:true})
        res.status(200).json({
            msg:'contact updated',
            result:updatedContact
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})





module.exports = Router