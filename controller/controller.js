const User = require('../models/User')
const Note = require('../models/Note')

const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

// desc Get all userSelect
//routes Get / user
// access private

const getAllUsers = asyncHandler(async (req, res) =>{
 const users = await User.find().select("-password").lean()
 if (!users?.length){
      return res.status(400).json({message: 'NO USER FOUND'})
 }

 res.json(users)
})

// desc create new users
//routes Post / user:
// access private

const createNewUser = asyncHandler(async(req, res) => {
      const {username, password, roles} = req.body

      // confirm data
      if(!username || !password || !Array.isArray(roles) || !roles.length){
            return res.status(400).json({message: "All fields are required"})
      }
      //

      // check for duplicate
      const duplicate = await User.findOne({username}).lean().exec()
      if (duplicate) {
            res.status(409).json({message: "Username already exists"})
      }

      // # password

      const hashPwd = await bcrypt.hash(password, 10) // salt rounds
      const userObject = {
            username, "password": hashPwd, roles
                
      }
      // create a user
      const user = await User.create(userObject)
      if (user){
            // create 

            res.status(201).json({message: `New user: ${username} created`})
      }else{
            res.status(400).json({message: 'invalid user data recieved'})
      }
     
      
})

// desc update users
//routes Patch / user:
// access private

const updateUser = asyncHandler(async(req, res) => {
      const {id, username, roles, active, password} = req.body;

      // confirm data 
      if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
            return res.status(400).json({message: "All field are required"})
      }

      const user = await User.findById(id).exec()
      if(!user) return res.status(400).json({message: "user not found"})
      

      //check for duplicate
      const duplicate = await User.findOne({username}).lean().exec()
      if(duplicate && duplicate?._id.toString() !== id){
            return res.status(409).json({message: 'Duplicate username'})
      }

      user.username = username
      user.roles = roles
      user.active= active

      if(password){
            //hash password
            user.password = await bcrypt.hash(password)
      }

      const updateUser = await user.save()
      res.json({message: `${updateUser.username} updated`})
})

// desc delete users
//routes delete / user:
// access private

      // desc delete users
// routes DELETE user
// access private

const deleteUser = asyncHandler(async (req, res) => {
      const {id} = req.body
      if(!id) {
          return res.status(400).json({message: 'user ID is required'})
      }
  
      const notes = await Note.findOne({user: id}).lean().exec()
      if(notes?.length) {
          return res.status(400).json({message: 'user assigned notes'})
      } 
  
      const user = await User.findById(id).exec()
      if(!user) {
          return res.status(400).json({message: 'user not found '})
      }
  
      const result = await user.deleteOne()
      const reply = `username ${result.username} with ID ${result._id}
      dalete`
  
      res.json(reply)
  
  })


module.exports = {getAllUsers, createNewUser, updateUser, deleteUser}