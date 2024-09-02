const sessionId = localStorage.getItem('session')

function getResponsiveDimensions() {
   const width = window.innerWidth <= 425 ? "100%" : "425px";
   const height = window.innerHeight <= 700 ? "100%" : "700px";
   
   return { width, height };
}

if(sessionId){
   const cashfree = Cashfree({
      mode: "sandbox",
  });
  const dimensions = getResponsiveDimensions();
   let checkoutOptions = {
      paymentSessionId: sessionId,
      redirectTarget: document.getElementById("cf_checkout"),
      appearance: {
         width: dimensions.width,
         height: dimensions.height,
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
      window.length.href = 'https://cashfree.onrender.com'
      localStorage.clear()
   });
}
