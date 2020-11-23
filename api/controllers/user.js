const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_get_all = (req, res, next) =>{
    User.find()
        .exec()
        .then(users=>{
            res.status(200).json({
                Users: users
            });
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        })
}

exports.user_signup = (req, res, next)=>{
    User.find({email: req.body.email})
        .exec()
        .then(user=>{
            console.log(user);
            if(user.length>=1){
                return res.status(409).json({
                    message:'Email already exists'
                });
            }else{
                return bcrypt.hash(req.body.password,10 ,(err, hash)=>{
                    if(err){
                        return res.status(500).json({
                            error:err
                        });
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name:req.body.name
                        });
                        user
                        .save()
                        .then(result=>{
                            console.log(result);
                            res.status(201).json({
                                message:'User Created!'
                            });
                        })
                        .catch(err=>{
                            console.log(err);
                            res.status(500).json({
                                error:err
                            });
                        });
                    }
                });
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(409).json({
                message:'ERROR'
            });
        });  
}

exports.user_login = (req, res, next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(404).json({
                message:'User does not Exist! Check you email'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(401).json({
                    message:'Incorrect Password!'
                });
            }
            if(result){
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0].id,
                        name:user[0].name,
                    },process.env.JWT_KEY,
                    {
                        expiresIn:'1h'
                    }
                );
                return res.status(200).json({
                    message: ' Auth Successful!',
                    token: token,
                    user:user[0],
                });
            }
            res.status(401).json({
                message: ' Auth failed!!'
            });
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.user_info = (req, res, next) =>{
    User.find({_id:req.params.userId})
        .exec()
        .then(user=>{
            if(user){
                user.map(item=>{
                    res.status(200).json({
                        User:item
                    });
                })
                
            }else{
                res.status(404).json({
                    message:'user not found'
                })
            }
        })
        .catch(err=>console.log(err));
}

exports.user_delete = (req, res, next)=>{
    User.deleteOne({_id:req.params.userId})
        .exec()
        .then(result =>{
            res.status(200).json({
                message:'User Deleted'
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
}