const App = () => {
  console.log('🚀 MINIMAL APP LOADING...');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: 'lightblue' }}>
      <h1>🔧 MINIMAL TEST</h1>
      <p>If you see this, the basic App component works</p>
      <p>URL: {window.location.href}</p>
    </div>
  );
};

export default App;