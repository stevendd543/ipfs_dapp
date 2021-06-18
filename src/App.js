import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
// import Greeter from './Greeter.json';
import Store from './StorageCreate.json';
// Update with the contract address logged out to the CLI when it was deployed 
// const greeterAddress = "0x3E52F91d646769E95EebD0b1669A43C6448B11bA"
const stroeAddress="0xE4387CE6e2014118f16f8Cc22A9243db69A8F0AC"
function App() {
  // store greeting in local state
  // const [greeting, setGreetingValue] = useState()
  
  // request access to the user's MetaMask account
  async function requestAccount() { 
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  // async function fetchGreeting() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
  //     try {
  //       const data = await contract.greet()
  //       console.log('data: ', data)
  //     } catch (err) {
  //       console.log("Error: ", err)
  //     }
  //   }    
  // }
  async function fetchStasorage() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(stroeAddress, Store.abi, provider)
      try {
        const data = await contract.createSpace('addr')
        console.log('asdsasd')
        // console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }
 
  async function fetchStorage() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(stroeAddress, Store.abi, signer)
      const transaction = await contract.createSpace('addr')
      console.log(transaction)
      await transaction.wait()
      
    }
  }
  // call the smart contract, send an update
  // async function setGreeting() {
  //   if (!greeting) return
  //   if (typeof window.ethereum !== 'undefined') {
  //     await requestAccount()
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
  //     const transaction = await contract.setGreeting(greeting)
  //     await transaction.wait()
  //     fetchGreeting()
  //   }
  // }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchStorage}>Fetch </button>
        {/* <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button> */}
        {/* <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" /> */}
      </header>
    </div>
  );
}

export default App;