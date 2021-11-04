const collections = require('../config/collections')
const db=require('../config/connection')
const bcrypt=require('bcrypt')
module.exports={
    addUser:(data)=>{
        return new Promise(async(resolve,reject)=>{
           data.password= await bcrypt.hash(data.password,10)
        db.get().collection(collections.USER_COLLECTION).insertOne(data).then((result)=>{
            console.log(result)
            resolve(result)
        })
        })
    },
    userLogin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            if(data.email && data.password){
            let user=await db.get().collection(collections.USER_COLLECTION).findOne({email:data.email });
            if(user && user.status=="block"){
              bcrypt.compare(data.password,user.password).then((result)=>{
                  if(result){
                    response.user=user;
                    response.status=true;
                    console.log('login success')
                    resolve(response);
                  }else{
                    console.log('failed');
                    response.status=false;
                    response.alert="Invalid username or password"
                    resolve(response)
                  }
              })
            }else if(user && user.status=="unblock"){
                response.status=false;
                response.alert="You are blocked"
                resolve(response)
            }
            
            else{
                console.log('failed to login');
                response.status=false;
                response.alert="Invalid username or password"
                resolve(response)
            }
        }else{
            response.alert="Please fill the empty field"
            response.empty=true;
            resolve(response);
        }
        })
    },
    findUser:(email)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).findOne({email:email}).then((response)=>{
                resolve(response)
            })
        })
    }
}