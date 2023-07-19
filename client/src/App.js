import {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
const [info, setInfo] = useState("")

function callInfo() {
  axios.get('http://localhost:3002/info')
    .then((response) => {
      setInfo(response.data[0]["content"])
    })
    .catch(error => {
      console.error('Error loading info:', error);
    
    })
}

  return (
    <div className="App">
      <header className="App-header">
        <h1>Deployment en AWS</h1>
        <button onClick={callInfo}>Llamar a la información de la base de datos</button>
        <p>{info}</p>
      </header>
    </div>
  );
}

export default App;
