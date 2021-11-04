
    $(function() {

        
        $("#email_error_message").hide();
        $("#password_error_message").hide();
       
    
        
        var error_email = false;
        var error_password = false;
        
    
        
        $("#form_email").focusout(function() {
           check_email();
        });
        $("#form_password").focusout(function() {
           check_password();
        });
        
    
        
    
        
    
        function check_password() {
           var password_length = $("#form_password").val().length;
           if (password_length < 3) {
              $("#password_error_message").html("please fill atleast three character");
              $("#password_error_message").show();
              $("#form_password").css("border-bottom","2px solid #F90A0A");
              error_password = true;
           } else {
              $("#password_error_message").hide();
              $("#form_password").css("border-bottom","2px solid #34F458");
           }
        }
    
    
        function check_email() {
           var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
           var email = $("#form_email").val();
           if (pattern.test(email) && email !== '') {
              $("#email_error_message").hide();
              $("#form_email").css("border-bottom","2px solid #34F458");
           } else {
              $("#email_error_message").html("Enter a valid Email");
              $("#email_error_message").show();
              $("#form_email").css("border-bottom","2px solid #F90A0A");
              error_email = true;
           }
        }
    
        $("#registration_form").submit(function() {
           
           error_email = false;
           error_password = false;
           
    
           
           check_email();
           check_password();
           
    
           if ( error_email === false && error_password === false ) {
              alert("confirm submission");
              return true;
           } else {
              alert("Something went wrong");
              return false;
           }
    
    
        });
     });
     function check(id,value){
      $.ajax({
          method:'get',
          url:'/admin/block/'+id ,
          success: function(data) {
            if(data.status=='block'){
               
                  document.getElementById(id).innerHTML="Unblock"
               
            }else{
               document.getElementById(id).innerHTML="block"
            }
            
          }
        });
    }

    