// Send test email
fetch('https://awfyhgeflakjhxtntokd.supabase.co/functions/v1/send-test-pilot-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({})
})
.then(response => response.json())
.then(data => console.log('Test email sent:', data))
.catch(error => console.error('Error:', error));