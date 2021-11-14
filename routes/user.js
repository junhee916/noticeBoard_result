const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')

// signup
router.post('/signup', async (req, res) => {

    const { name, email, password } = req.body

    try{
        const user = await userModel.findOne({email})

        if(user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            const user = new userModel({
                name, email, password
            })

            await user.save()

            res.status(200).json({
                msg : "success signup",
                userInfo : {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msgs : err.message
        })
    }
})

// login
router.post('/login', async (req, res) => {

    const { email, password } = req.body

    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            await user.comparePassword(password, (err, isMatch) => {
                if(err || !isMatch){
                    return res.status(401).json({
                        msg : "not match password"
                    })
                }
                else{
                    const payload = {
                        id : user._id,
                        email : user.email
                    }

                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {
                            expiresIn : '1h'
                        }
                    )

                    res.status(200).json({
                        msg : "success login",
                        token : token,
                        userInfo : {
                            id : user._id,
                            name : user.name,
                            email : user.email,
                            password : user.password
                        }
                    })
                }   
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

module.exports = router