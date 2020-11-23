const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');

exports.admin_signup =(req, res, next)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            return res.status(500).json({
                error:err,
            });
        }else{
            const admin = new Admin({
                _id:new mongoose.Types.ObjectId,
                userName:req.body.userName,
                password:hash,
            });
            admin
                .save()
                .then(result=>{
                    console.log(result);
                    res.status(201).json({
                        message:'Admin Created'
                    });
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({
                        error:err
                    });
                });
        }
    })
}

exports.admin_login =(req, res, next)=>{
    Admin.find({userName:req.body.userName})
        .exec()
        .then(user=>{
            if(user.length<1){
                return res.status(404).json({
                    message: 'Username Does not match!'
                });
            }
            bcrypt.compare(req.body.password,user[0].password,(err, result)=>{
                if(result){
                    const token = jwt.sign({
                        userName: user[0].userName
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn:'1h'
                    });
                    res.status(200).json({
                        message: 'Auth Successfull',
                        token: token
                    });
                }else{
                    return res.status(401).json({
                        message:'Incorrect Password!'
                    })
                }
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
}

exports.admin_password_change = (req, res, next)=>{
    Admin.find({userName:req.body.userName})
        .exec()
        .then(user=>{
            bcrypt.compare(req.body.oldPassword,user[0].password,(err,result)=>{
                if(err){
                    return res.status(401).json({
                        message:'Incorrect Password!'
                    });
                }
                if(result){
                bcrypt.hash(req.body.newPassword,10,(err,hash)=>{
                    if(err){
                        return res.status(500).json({
                            error:err
                        });
                    }else{
                        Admin.updateOne({password:hash})
                        .exec()
                        .then(result=>{
                            console.log(result);
                            res.status(200).json({
                                message:'Password Updated Successfully'
                            });
                        })
                        .catch(err=>{
                            console.log(err);
                            res.status(500).json({
                                error:err
                            });
                        })
                    }
                })                        
                }
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
}

exports.admin_authenticate = (req, res, next) =>{
    Admin.find({userName:req.params.user})
        .exec()
        .then(user=>{
            res.status(200).json({
                authenticated:true
            });
        })
        .catch(err=>{
            res.status(500).json({
                authenticated:false
            });
        });
}