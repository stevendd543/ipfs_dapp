import './App.css';
import { useState } from 'react';
import { ContractFactory,ethers } from 'ethers';
import Greeter from './Greeter.json';
// Update with the contract address logged out to the CLI when it was deployed 
var greeterAddress = ""
// const hre = require("hardhat");


function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState()
 
  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  async function createContract(){
  
    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const factory=new ContractFactory(Greeter.abi,Greeter.bytecode,signer)
    const contract = await factory.deploy(greeting);
    greeterAddress=contract.address;
    console.log(contract.address)
    
  }
  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <button onClick={createContract}>create</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </header>
    </div>
  );
}

export default App;