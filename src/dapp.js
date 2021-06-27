import React from "react";
import './dapp.css'
import { ContractFactory,ethers } from 'ethers';
import Greeter from './Greeter.json';
var contractAddress = ""
var Hash="";
// var IPFS = require('ipfs-http-client');
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({
  host: 'localhost',
  port: '5001',
  protocol: 'http'
});
class Dapp extends React.Component{
    constructor(props){
        super(props);
        this.state={
            hashCode:"",
            ContractAddr:"",
            NumberOfContract:0,
            AddrArray:[],
        }
        
        this.handleAddrUpdate = this.handleAddrUpdate.bind(this);
        this.handleContract = this.handleContract.bind(this);
        this.handleHashCode = this.handleHashCode.bind(this);
        
    }
    
    handleAddrUpdate(i){
        console.log('address update');
        this.setState(prevState => ({
                  NumberOfContract:prevState.NumberOfContract+=1,
                  ContractAddr:contractAddress,
                  AddrArray:prevState.AddrArray.concat(contractAddress)
                }));
    }

    handleHashCode(){
      this.setState({hashCode:Hash})
    }
    handleContract(index) {
      
      console.log(index);
        this.setState({
          ContractAddr: this.state.AddrArray[index]
        });
      }
    render(){
        const CurrentAddr=this.state.AddrArray;
        const UpdateAddr=CurrentAddr.map((value,index)=>{
            return(
              <li key={index}>
                  <button class="addr_button" onClick={()=>{this.handleContract(index)}}>{value}</button>
              </li>
            )
        });   
        
        return(
            <div className="Dapp">
            
                <div class="ipfs">
                    <Ipfs onClick={()=>this.handleHashCode()}/>
                </div>
                <div class="history">
                    <ol>{UpdateAddr}</ol>
                </div>
                <div class="blockchain" >
                    <FetchBlock 
                        data={this.state.ContractAddr} 
                        onClick={this.handleHashCode}/>
                    <DeployBlock 
                        data={this.state.hashCode} 
                        onClick={(i)=>this.handleAddrUpdate(i)}/>
                </div>
                <div>
                  <p>Hash:{this.state.hashCode}</p>
                </div>
            </div>
        );
    }

};


class Ipfs extends React.Component{
  
  render(){
    
      return(
    <div>
        <input type="file"  ref="file" id="file" name="file" multiple ="multiple"/>
       
        <button style={{marginTop:10}} onClick={()=>{
             var file = this.refs.file.files[0];
             var reader = new FileReader();
             reader.readAsArrayBuffer(file)
             reader.onloadend = (e)=>{
             console.log(reader);
             saveImageToIpfs(reader).then((hash) => {
             console.log(hash);
             Hash=hash;
             this.props.onClick();
            });
            
          }
             
         
        }
          }>開始上傳</button> 
        
    </div>
    
  );
  }
}

function DeployBlock(props){
        return(
            <button onClick={()=>{createContract(props.data,props)}}>Deploy</button> //去掉()可能會自動開啟錢包
        );
 
}
function FetchBlock(props){
        return(

            <button onClick={()=>{fetch(props)
                                  props.onClick() }}>Fetch</button>
        );
}
async function fetch(props) {
  // console.log(props);
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(props.data, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
        Hash=data;
      } catch (err) {
        console.log("Error: ", err)
      }
      
    }  
      
  }
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  async function createContract(hashCode,props){
  
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const factory=new ContractFactory(Greeter.abi,Greeter.bytecode,signer)
    const contract = await factory.deploy(hashCode);
    contractAddress=contract.address;
    console.log(contract.address)
    props.onClick();
  }
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
export default Dapp;