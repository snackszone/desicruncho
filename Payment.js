document.addEventListener('DOMContentLoaded', ()=>{
  const params = new URLSearchParams(window.location.search);
  const productName = params.get('productName') || 'Product Name';
  const productPrice = parseInt(params.get('price')) || 0;
  const productImage = params.get('image') || 'https://placehold.co/60x60/d4d4d4/000?text=Product';
  const customerName = params.get('customerName') || 'Customer Name';
  const customerPhone = params.get('customerPhone') || '0000000000';
  const customerAddress = params.get('customerAddress') || 'Customer Address';

  const deliveryCharge = 50;
  const totalPrice = productPrice + deliveryCharge;

  document.getElementById('product-name').textContent = productName;
  document.getElementById('item-price').textContent = productPrice;
  document.getElementById('total-price').textContent = totalPrice;
  document.getElementById('product-image').src = productImage;
  document.getElementById('customer-name').textContent = customerName;
  document.getElementById('customer-phone').textContent = customerPhone;
  document.getElementById('customer-address').textContent = customerAddress;
  document.getElementById('cod-price').textContent = `₹${productPrice} + ₹50.00`;

  const codBtn = document.getElementById('cod-btn');
  const showQrBtn = document.getElementById('show-qr-btn');
  const qrImage = document.getElementById('qr-image');
  const qrTimer = document.getElementById('qr-timer');

  const webAppURL = 'https://script.google.com/macros/s/AKfycbw7UUWzYY3kb_JfxwyYVDkC2W2feWF-DPqHco0kJWSCgbY_JQ1W5PsB-Kuk7IYWMSpI-A/exec';

  function sendPaymentData(method){
      const data = {
          productName,
          price: totalPrice,
          customerName,
          customerPhone,
          customerAddress,
          paymentMethod: method
      };
      fetch(webAppURL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      }).catch(err => console.error(err));
  }

  codBtn.addEventListener('click', ()=>{
      sendPaymentData('COD');
      codBtn.textContent='Order Confirmed';
      codBtn.disabled=true;
      codBtn.style.backgroundColor='#15803d';
      document.getElementById('payment-modal').classList.add('hidden');
      const thankYou=document.getElementById('thank-you-modal');
      thankYou.classList.remove('hidden');
      thankYou.classList.add('active');
  });

  showQrBtn.addEventListener('click', ()=>{
      qrImage.classList.remove('blurred');
      showQrBtn.style.display='none';
      qrTimer.style.display='block';
      sendPaymentData('UPI');

      let timeLeft=120;
      qrTimer.textContent="02:00";
      const interval=setInterval(()=>{
          timeLeft--;
          let minutes=Math.floor(timeLeft/60);
          let seconds=timeLeft%60;
          qrTimer.textContent=`${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
          if(timeLeft<=0){
              clearInterval(interval);
              qrImage.classList.add('blurred');
              qrTimer.style.display='none';
              showQrBtn.style.display='block';
          }
      },1000);
  });
});
