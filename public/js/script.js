document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    const number = document.getElementById('number').value.trim();
    const name = document.getElementById('name').value.trim();
    const amount = parseFloat(document.getElementById('amount').value.trim());
    let validationPassed = true;
    let errorMessage = '';

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(number)) {
        validationPassed = false;
        errorMessage += 'Enter a valid number';
    }

    // Validate name (min 3 characters, max 100 characters)
    if (name.length < 3 || name.length > 100) {
        validationPassed = false;
        errorMessage += 'Name must be between 3 and 100 characters.\n';
    }

    // Validate amount (minimum 100)
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
        if (data.paymentLink) {
            window.location.href = data.paymentLink;
        } else {
            document.getElementById('responseMessage').textContent = 'Payment initiation failed.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('responseMessage').textContent = 'An error occurred. Please try again.';
    });
});
