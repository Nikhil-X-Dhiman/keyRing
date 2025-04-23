import { useState } from 'react';
import './App.css'

function App() {
  // let count=0;
  const [count, setCount] = useState(0);
  function btnClick(){
    setCount((prev)=>prev+1);
  }

  return (
    <>
      <h2>Count value is: {count}</h2>
      <button onClick={btnClick}>I
    console.log(count);ncrement</button>
    </>
  )
}

export default App
