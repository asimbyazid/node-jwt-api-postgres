const pool = require('../../db')
const queries = require('./authQueries')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')


const maxAge = 3 *24*60*60; //3 days, time in seconds
const createToken = (id)=>{
    return jwt.sign({ id },'secret-and-should-be-long',{
        expiresIn: maxAge
    });
}

const authLoginController =  (req,res)=>{
    const {email,password} = req.body

    pool.query(queries.userLogin,[email],(error,results)=>{
        console.log(results)
        if(results.rows.length>0){
           
            bcrypt.compare(password,results.rows[0].password, (err, result) => {
                    if (err)
                        res.status(err).json({
                            messsage: "Server error",
                        });
                    else if(result==true){
                        const token = createToken(results.rows[0].id);
                        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge *1000})        
                        res.status(200).json({
                            messsage:200,
                            id: results.rows[0].id,
                            email:results.rows[0].email,
                            token: token
                        })
                        
                    }
                    else{
                        res.json({messsage:"Wrong email or password"})  
                    }
               
                    
                })
        }
        else{
            res.json({messsage:"Email does not exist."})   
        }
       
    })
    
}

const authSignUpController =  (req,res)=>{
    const {email,password,confirmPassword} = req.body
    if (password !=confirmPassword){
        res.json({
            messsage: "Password did not match",
        });
    }
    else{
        console.log(req.body)

        pool.query(queries.checkEmailExistsQueries,[email],(error,results)=>{
            if(results.rows.length<=0){
            //add user
    
            bcrypt.hash(password, 10, (err, hash) => {
                        if (err)
                            res.status(err).json({
                                messsage: "Server error",
                            });
                        pool.query(queries.userSignUp,[email,hash],(error,results)=>{
                            console.log("Saved")
                        // if(error) throw error;
                            res.status(200).json({messsage:"User added succesfully"})
                        
                        })
                        
                    })
                    }
                    else{
                        res.json({messsage:"Email already exist."})   
            }
           
        })
        
        
    }

    
}


const authpassResetController =  (req,res)=>{
    const {id,oldpassword,newpassword,confirmPassword} = req.body
    
    if (newpassword !=confirmPassword){
        res.json({
            messsage: "Password did not match",
        });
    }
    else{
    pool.query(queries.checkEmailExistsQueriesByid,[id],(error,results)=>{
        console.log(results)
        if(results.rows.length>0){
           
            bcrypt.compare(oldpassword,results.rows[0].password, (err, result) => {
                    if (err)
                        res.status(err).json({
                            messsage: "Server error",
                        });
                    else if(result===true){
                        bcrypt.hash(newpassword, 10, (err, hash) => {
                            if (err)
                                res.status(err).json({
                                    messsage: "Server error",
                                });
                            pool.query(queries.passwordReset,[hash,id],(error,results)=>{
                                console.log("Saved")
                                res.status(200).json({messsage:"Password updated succesfully"})
                            
                            })
                            
                        })
                    }
                    else{
                        res.json({messsage:"Wrong password"})  
                    }
               
                    
                })
        }
        else{
            res.json({messsage:"Email does not exist."})   
        }
       
    })
}
}

module.exports ={
    authLoginController,
    authSignUpController,
    authpassResetController
}