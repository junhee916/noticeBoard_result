const express = require('express')
const router = express.Router()
const commendModel = require('../models/commend')
const checkAuth = require('../middleware/check_auth')

// get commend
router.get('/:commendId', async (req, res) => {
    const id = req.params.commendId
    try{
        const commend = await commendModel.findById(id)
                            .populate('user', ['email'])
                            .populate('board', ['board'])
        if(!commend){
            return res.status(402).json({
                msg : "get commend",
                commendInfo : {
                    id : commend._id,
                    user : commend.user,
                    board : commend.board,
                    commend : commend.commend
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

// register commend
router.post('/save/:boardId', checkAuth, (req, res) => {

    const board = req.params.boardId
    const user = res.locals.user.id
    const {commend} = req.body
    const newCommend = new commendModel({
        user, board, commend
    })
    try{
        if(res.locals.user){
            const commend = newCommend.save()
            res.status(200).json({
                msg : "register commend",
                commendInfo : {
                    id : commend._id,
                    user : commend.user,
                    board : commend.board
                }
            })
        }
        else{
            res.status(403).json({
                msg : "no token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// update commend
router.post('/update/:commendId', async (req, res) => {
    const id = req.params.commendId
    try{
        const commend = await commendModel.findById(id)
        if(!commend){
            return res.status(402).json({
                msg : "no commendId"
            })
        }
        else{
            res.status(200).json({
                msg : "delete commend by id: " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// delete commend

module.exports = router