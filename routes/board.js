const express = require('express')
const router = express.Router()
const boardModel = require('../models/board')
const checkAuth = require('../middleware/check_auth')

// get board
router.get('/', checkAuth, (req, res) => {
    const userId = res.locals.user.id

    const result = {status : "success", boardData : []}
    try{
        boardModel.find({userId}).exec(function(err, boards){
            if(err){
                console.log('fail get board data')
            }
            else{
                for(board of boards){
                    const temp = {
                        id : board._id,
                        board : board.board
                    }
                    result.boardData.push(temp)
                }
                res.status(200).json({
                    msg : "get boards",
                    boards : result
                })
            }
        })

    }   
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail get board
router.get('/show/:boardId', checkAuth, async (req, res) => {

    const id = req.params.boardId
    const result = {status : "success", boardData : []}
    try{
        if(res.locals.user){
            const board = await boardModel.findById(id)
                                .populate('user', ['email'])
            if(!board){
                return res.status(402).json({
                    msg : "no boardId"
                })
            }
            else{
                const temp = {
                    id : board._id,
                    board : board.board
                }
                result.boardData.push(temp)

                res.status(200).json({
                    msg : "get board",
                    board : result
                })
            }
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

// register board
router.post('/save', checkAuth, async (req, res) => {
    const user = res.locals.user.id
    const { board } = req.body
    const newBoard = new boardModel({
        user, board
    })
    try{
        const board = await newBoard.save()
        res.status(200).json({
            msg : "register board",
            boardInfo : {
                id : board._id,
                user : board.user,
                board : board.board
            }
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// update board
router.post('/update/:boardId', checkAuth, async (req, res) => {
    const id = req.params.boardId
    const userId = res.locals.user.id
    console.log("update token 확인: ", userId)
    try{
        if(res.locals.user){
            const board = await boardModel.findByIdAndUpdate(id, {$set : {
                user : userId,
                board : req.body.board
            }})
    
            if(!board){
                return res.status(402).json({
                    msg : "no boardId"
                })
            }
            else{
                res.status(200).json({
                    msg : "update board by id: " + id
                })
            }
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

// delete board
router.post('/delete/:boardId', checkAuth, async (req, res) => {
    const id = req.params.boardId
    try{
        if(res.locals.user){
            const board = await boardModel.findByIdAndRemove(id)
            if(!board){
                return res.status(402).json({
                    msg : "no boardId"
                })
            }
            else{
                res.status(200).json({
                    msg : "delete board by id: " + id
                })
            }
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

module.exports = router