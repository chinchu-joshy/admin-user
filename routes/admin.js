var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')
/* GET users listing. */
let checkAdmin=(req,res,next)=>{
  if(req.session.logged){

    
    next()
  }
  else{

    if(req.session.alerts){
      let alert=req.session.alerts
      req.session.alerts=null
      res.render('admin/adminlogin',{'admin':false,alert})
     }else{
      res.render('admin/adminlogin',{'admin':false})
     }
    
  }
  }


router.get('/', function(req, res, next) {
  console.log(req.session.admin)

  if(req.session.logged){
    // productHelper.getAllProduct().then((products)=>{
      let adminIn=req.session.admin
      productHelper.getAllProduct().then((products)=>{
         
         
        res.render('admin/view-products', {'admin':true ,products,adminIn});
      })
    
    // })
  }
  else{
    let flag=true;
    res.render('admin/view-products', {'admin':true,flag });
   } 


});
router.get('/add-product',(req,res)=>{
  res.render('admin/add-product',{'admin':true })
})
router.post('/add-product',(req,res)=>{
productHelper.addProduct(req.body).then((result)=>{
  let image=req.files.image
  // console.log(image)
  image.mv('./public/product-images/'+result+'.png',(err,done)=>{
    if(!err){
      res.redirect('/admin')
    }else{
      res.redirect('/admin/add-product')
    }
  })
  // console.log(result)
  
})


})
router.get('/delete/:id',(req,res)=>{
  productHelper.deleteProduct(req.params.id).then(()=>{
    res.redirect('/admin')
  })
})
router.get('/edit/:id',async(req,res)=>{
  let product=await productHelper.editProduct(req.params.id)
  
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  productHelper.updateProduct(req.params.id,req.body).then((response)=>{
    res.redirect('/admin')
    if(req.files.image!=null){
      let image=req.files.image
      image.mv('./public/product-images/'+req.params.id+'.png')
      
    }
    
  })
})
router.get('/adminlogin',checkAdmin,(req,res)=>{
  res.redirect('/admin')
})
router.post('/adminlogin',(req,res)=>{
  
  console.log(req.body)
  productHelper.checkAdmin(req.body).then((response)=>{
    if(response.status===true){
      req.session.admin=response.user;
      req.session.logged=true;
      res.redirect('/admin')
    }else if(response.status===false) {
      req.session.logged=false;
      req.session.alerts=response.alert;
      res.redirect('/admin/adminlogin')
    }
    else if(response.empty===true){
      req.session.logged=false;
      // req.session.alert=response.alert;

      res.redirect('/admin/adminlogin')
    }
  })
})
router.get('/block/:id',async(req,res)=>{
  console.log('called')
   productHelper.blockUser(req.params.id).then((response)=>{

res.json({status:response})
   })
  
})
router.get('/adminlogout',(req,res)=>{
  delete req.session.admin;
  delete req.session.logged;
  res.redirect('/admin')

})
router.get('/reg',(req,res)=>{
  res.render('/admin/register')
})
module.exports = router;
