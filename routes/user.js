var express = require('express');

let productHelper=require('../helpers/product-helpers')
var router = express.Router();
let userHelper=require('../helpers/user-helpers')
let checkLogin=(req,res,next)=>{
  if(req.session.user){
userHelper.findUser(req.session.user.email).then((response)=>{
  console.log(response.status)
  if(response.status==='unblock'){
    delete req.session.user
    delete req.session.loggedIn;
    res.redirect('/')
  }else{
    next()
  }
})
  }else{
    next()
  }
  

}
/* GET home page. */ 
router.get('/',checkLogin, function(req,res, next) {

  if(req.session.loggedIn){
    
  // productHelper.getAllProduct().then((products)=>{
    let users=req.session.user;
   
    let id=req.session.user._id
    console.log(id)
    res.render('user/index', {'user':true ,users,id});
  // })
}
else{
  let flag=true;
  res.render('user/index', {'user':true,flag });
 } 
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn ){
    
    res.redirect('/')
  }else{
     if(req.session.alert){
      let alert=req.session.alert
      
      req.session.alert=null
      res.render('user/login',{'user':false,alert})
     }else{
      res.render('user/login',{'user':false})
     }
    
  }
  
  
})                                                                                                 
router.post('/login',(req,res)=>{
  
  userHelper.userLogin(req.body).then((response)=>{
    
    if(response.status===true){
      
      req.session.user=response.user;
      req.session.loggedIn=true;
      res.redirect('/')
    }else if(response.status===false) {
      // req.session.user.loggedIn=false;
      req.session.alert=response.alert;
      res.redirect('/login')
    }
    else if(response.empty===true){
      req.session.loggedIn=false;
      // req.session.alert=response.alert;

      res.redirect('/login')
    }
  })
  
})
router.get('/register',(req,res)=>{
  
  res.render('user/register',{'user':false})
})
router.post('/register',(req,res)=>{
  userHelper.addUser(req.body).then((response)=>{

    // req.session.user=response.user;
    // req.session.loggedIn=true;


    res.redirect('/login');
  
  })
  
})
router.get('/logout',(req,res)=>{
  
  delete req.session.user;
  delete req.session.loggedIn;
   
    res.redirect('/')


  
})
router.get('/cart',checkLogin,(req,res)=>{
  res.render('user/cart')
})

module.exports = router;
