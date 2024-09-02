const sessionId = localStorage.getItem('session')
if(sessionId){
   const cashfree = Cashfree({
      mode: "sandbox",
  });
   let checkoutOptions = {
      paymentSessionId: sessionId,
      redirectTarget: document.getElementById("cf_checkout"),
      appearance: {
         width: window.innerWidth <= 425 ? "100%" : "425px",
         height:"500px",
     },
   };
   cashfree.checkout(checkoutOptions).then((result) => {
      if(result.error){
          console.log("There is some payment error, Check for Payment Status");
          console.log(result.error);
      }
      if(result.redirect){
          console.log("Payment will be redirected");
      }
      if(result.paymentDetails){
          console.log("Payment has been completed, Check for Payment Status");
          console.log(result.paymentDetails.paymentMessage);
      }
   }).finally(()=>{
      localStorage.clear()
      window.location.href = 'https://cashfree.onrender.com'
   })
}
