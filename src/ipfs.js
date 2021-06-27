import React from "react";

import { ContractFactory,ethers } from 'ethers';
import Greeter from './Greeter.json';
import { react } from "@babel/types";
var contractAddress = "0xb365c193e8fe710933af00bf66c75568290eff29"


const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({
  host: 'localhost',
  port: '5001',
  protocol: 'http'
});

let saveImageToIpfs =(reader) =>{
  return new Promise(function(resolve,reject){
    const buffer =Buffer.from(reader.result);
    ipfs.add(buffer).then((response)=>{
      console.log(response)
      resolve(response[0].hash);
    }).catch((err)=>{
      console.error(err)
      reject(err);
    })
  })
}



class Dapp extends React.Component{
  state = { 
    imageHash: null
   };
    constructor(props){
        super(props);
        this.state={
            greeting:'',
            newContractAddr:contractAddress,
            NumberOfContract:0,
        }
        // this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event){
        this.setState({greeting:event.target.value})
    }
    // handleAddrUpdate(){
        
    // }
    render(){
        // const history;
        return(
            <div className="Dapp">
              <h2>上傳圖片到IPFS:</h2>
              <div>
           <label id="file">選擇上傳圖片</label>
           <input type="file" ref="file" id="file" name="file" multiple ="multiple"/>
        </div>
        <button style={{marginTop:10}} onClick={() => {
            var file = this.refs.file.files[0];
            var reader = new FileReader();
            reader.readAsArrayBuffer(file)
            reader.onloadend = (e)=>{
            console.log(reader);
            saveImageToIpfs(reader).then((hash) => {
            console.log(hash);
            this.setState({greeting:hash})
          });   
         }
       }}>開始上傳
       </button>
       
      <div style={{marginTop:10}}>圖片hash：{this.state.greeting}</div>
                <div class="blockchain">
                    <FetchBlock />
                    <DeployBlock data={this.state.greeting}/>
                      <input onChange={(e)=>this.handleChange(e)} placeholder="Set greeting" />                
                </div>
                <div class="history">
                </div>
                
            </div>
        )
    }


};
function DeployBlock(props){
    return(
        <button onClick={()=>createContract(props.data)}>Deploy</button> //去掉()可能會自動開啟錢包
    );
}
function FetchBlock(){
        return(
            <button onClick={fetch}>Fetch</button>
        );
}
async function fetch() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
      
    }  
      
  }
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  async function createContract(greeting){
  
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const factory=new ContractFactory(Greeter.abi,Greeter.bytecode,signer)
    const contract = await factory.deploy(greeting);
    contractAddress=contract.address;
    console.log(contract.address)
    
  }
// export default Dapp;