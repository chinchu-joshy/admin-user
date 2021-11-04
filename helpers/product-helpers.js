const db=require('../config/connection')
const collection=require('../config/collections')
const objectId = require("mongodb").ObjectId
const collections = require('../config/collections')
const { Collection } = require('mongodb')
const bcrypt=require('bcrypt')
module.exports={
    addProduct:(product)=>{
        return new Promise(async(resolve,reject)=>{
        product.password=await bcrypt.hash(product.password,10)
             db.get().collection(collection.USER_COLLECTION).insertOne(product).then((data)=>{ 
             db.get().collection(collection.USER_COLLECTION).findOne({username:product.username}).then((result)=>{
                let val=(result._id).toString()
                // console.log(val)
                resolve(val)
             })  
        }) 
    })  
    },
    getAllProduct:()=>{
       return new Promise(async(resolve,reject)=>{
           let products=await db.get().collection(collection.USER_COLLECTION).find().toArray()
           
            resolve(products)
        })
    },
    deleteProduct:(data)=>{
        
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(data)}).then((response)=>{
                console.log(response)
                resolve(response)
            })
        })
    },
    editProduct:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(id)}).then((response)=>{
                resolve(response)
            })
        })
    },
    updateProduct:(id,product)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(id)},{
                $set:{
                   username:product.username,
                   email:product.email,
                   phone:product.phone
                }
            }).then((response)=>{
                console.log(response)
                resolve(response)
            })
        })
    },
    blockUser:(id)=>{
        return new Promise(async(resolve,reject)=>{
              let user=await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(id)})
              if(user.status=="block"){
          let val=await db.get().collection(collection.USER_COLLECTION).findOneAndUpdate({_id:objectId(id)},{
                $set:{
                   status:"unblock"
                }
             })//.then((response)=>{
                 console.log(val.value.status)
                resolve(val.value.status)
            // })
        
              }else{
                let val=await db.get().collection(collection.USER_COLLECTION).findOneAndUpdate({_id:objectId(id)},{
                    $set:{
                       status:"block"
                    }
                 })//.then((response)=>{
                     console.log(val.value.status)
                    resolve(val.value.status)
                // })
              }
        
        
        })
    },
    checkAdmin:(admin)=>{
        return new Promise(async(resolve,reject)=>{
            
            let response={}
            if(admin.email && admin.password){
            let user=await db.get().collection(collections.ADMIN_COLLECTIONS).findOne({email:admin.email });
            if(user){
              let result=await db.get().collection(collections.ADMIN_COLLECTIONS).findOne({password:admin.password });
                  if(result){
                    response.user=user;
                    response.status=true;
                    console.log('login success')
                    resolve(response);
                  }else{
                    console.log('failed the login');
                    response.status=false;
                    response.alert="Invalid username or password"
                    resolve(response)
                  }
             
            }else{
                console.log('failed');
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
    }
}
