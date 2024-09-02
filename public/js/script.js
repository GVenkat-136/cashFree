document.getElementById('paymentForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const number = document.getElementById('number').value.trim();
    const name = document.getElementById('name').value.trim();
    const amount = parseFloat(document.getElementById('amount').value.trim());
    let validationPassed = true;
    let errorMessage = '';

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(number)) {
        validationPassed = false;
        errorMessage += 'Enter a valid number';
    }
    if (name.length < 3 || name.length > 100) {
        validationPassed = false;
        errorMessage += 'Name must be between 3 and 100 characters.\n';
    }
    if (isNaN(amount) || amount < 100) {
        validationPassed = false;
        errorMessage += 'Amount must be at least 100.\n';
    }
    if (!validationPassed) {
        alert(errorMessage);
        return;
    }

    // If all validations pass, proceed with the fetch request
    fetch('/pay', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            number: number,
            name: name,
            amount: amount
        }),
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('session', data.payment_session_id)
        window.location.href = 'https://cashfree.onrender.com/payment'
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('responseMessage').textContent = 'An error occurred. Please try again.';
    });
})