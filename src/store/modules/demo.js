
/* eslint-disable */ 
import * as types from '../mutation-types'
import Vue from 'vue'
import Vuex from 'vuex'
import Web3 from "web3";

//メソッドで使用する変数の定義//
let myAccount;  //EOA(External Owned Address)
var contractInstance; //コントラクトインスタンス
var getweb3; //　web3オブジェクトを返す関数
var bcdat; //ブロックチェーンより取得したデータ
// var smartContractAddress = "0xCF5263E8df5E4f9bF83C21Db010215e9C99c1D66";  //Ropstenテストネット上でのコントラクトアドレス(deploy時に表示されるアドレスに書き換えてください)
var smartContractAddress = "0xEc457E7875D7A2A63248C701C5D198591c2563d9";  //Localテストネット上でのコントラクトアドレス(deploy時に表示されるアドレスに書き換えてください)

// ABI(Application Binary Interface) はブロックチェーンの外からコントラクトを利用するための
// インターフェースの定義です。
const abi = [
  {
     "constant": true,
     "inputs": [],
     "name": "message",
     "outputs": [
       {
         "name": "",
         "type": "string"
       }
     ],
     "payable": false,
     "stateMutability": "view",
     "type": "function"
   },
   {
     "inputs": [
       {
         "name": "initMessage",
         "type": "string"
       }
     ],
     "payable": false,
     "stateMutability": "nonpayable",
     "type": "constructor"
   },
   {
     "constant": false,
     "inputs": [
       {
         "name": "newMessage",
         "type": "string"
       }
     ],
     "name": "update",
     "outputs": [],
     "payable": false,
     "stateMutability": "nonpayable",
     "type": "function"
   }
 ];

Vue.use(Vuex)

 //initial state
const state = {
  account: '',
  bc_dat: '',
  updating_dat:'',
  updating_done:''
}

//stateから値を取得するための定義
const getters = {
  datACCOUNT: state => state.account, //Account
  BCDATA : state => state.bc_dat, //Block chainに保存されているdata
  UPDATING_DAT: state => state.updating_dat,  //Block chainに書き込みを行うdata
  UPDATING_DONE: state => state.updating_done  //Block chainに書き込み中と書き込み完了を知らせる。
}

// actions
const actions = {
  async initApp() {
    try{
        console.log("web3init",web3)
        //console.log(web3)
        // await web3.eth.getAccounts().then(function(mac){ myAccount = mac })[0];
        myAccount = await web3.eth.getAccounts().then(function(result) { return result[0] });
        console.log("myAccount",myAccount)
        return myAccount
    }catch(err){
        console.log(err);
    }
  },

// const actions = async () => {
//     try {
//         const myAccounts = await web3.eth.getAccounts();
//         console.log(myAccounts)
//         return myAccounts;

//     } catch (err) {
//         console.log(err);
//     }
// }


  async getdata(){
    try{
      const result = await contractInstance.methods.message().call();     
      console.log('Fetched msg value from blockchain:', result); 
      return result
      } catch (err) {
      console.log("err1",err);
      }
    },

  async initial({dispatch,commit}){

    window.addEventListener('load', getweb3 = async function() {

      // web3 がブラウザのアドオンなどから提供されているかチェックします。(MetaMask)
      // window.web3というAPIは公式削除された模様
        if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
          // MetaMask の provider を使う
          let provider = window['ethereum'] || window.web3.currentProvider;
          console.log('provider',provider)

          // MetaMask の provider の利用を可能にします。
          // MetaMask にはプライバシーモードがあり、これが有効になっている場合には、この enable() を使っ
          // てこのサイトでMetaMaskを使う許可をユーザから得る必要があります。
          await provider.enable();
          web3 = new Web3(provider);
          console.log('return web3',web3)
          return web3
        } else {
          // ユーザが web3 を持っていないケースのハンドリング。 おそらく、あなたのアプリを利用するために
          // MetaMask をインストールするように伝えるメッセージを表示する処理を書く必要があります。
          // もしくは、Ethereum ノードがローカルで動いている場合には、
          // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
          // また、 infura.io の RPC エンドポイントを利用する場合には、
          // var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/your_project_id'));
          // のようにできます。
          console.log('METAMASK NOT DETECTED');
        }
      // これで web3.js を自由に使えるようになりました。
      // アプリを初期化して起動しましょう！
    //   await this.initApp(this.abi,this.smartContractAddress);       
    });
    web3 = await getweb3()
      console.log("web3",web3)   
      //console.log(web3)
    contractInstance = new web3.eth.Contract(abi, smartContractAddress);
    console.log('contractInstance',contractInstance)
    myAccount = await dispatch('initApp')
    bcdat = await dispatch('getdata')
    commit(types.GET_ACCOUNT, myAccount)
    commit(types.GET_BCDAT, bcdat)   
  },


  async update_BCDATA ({dispatch,commit},value) {
    commit(types.UPDATING_BCDAT,value) 
      //console.log("state.updating_dat")
      //console.log(state.updating_dat)
    const msgString =state.updating_dat;
    commit(types.UPDATING_DONE,'処理中')
    if(!msgString){
      return window.alert("MESSAGE VALUE IS EMPTY");
    }

    try {
      let option = {
        from: myAccount,
        gasPrice: "20000000000", // このトランザクションで支払う1ガス当たりの価格。単位は wei。
        gas: "41000",            // ガスリミット。このトランザクションで消費するガスの最大量。
      };
      let result = await contractInstance.methods.update(msgString).send(option);       
      console.log('MESSAGE UPDATED IN BLOCKCHIAN SUCCESSFULLY')
      commit(types.UPDATING_DONE,'Block Chainへの書き込みが完了しました') 
      console.log(result);
      bcdat = await dispatch('getdata')
      commit(types.GET_BCDAT, bcdat)   
    } catch (err) {
      console.log("err2",err);
    }

},

}

// stateの状態を操作するためにgettersで定義したメソッドを呼び出す。
// mutations
const mutations = {

  [types.GET_ACCOUNT](state, data){
  state.account = data
  },
  [types.GET_BCDAT](state, data){
  state.bc_dat = data
  },
  [types.UPDATING_BCDAT](state, data){
  state.updating_dat = data
  },
  [types.UPDATING_DONE](state, flag){
  state.updating_done = flag
  }

}

//demo.jsで定義したメソッドを外部から呼び出せるようにする
export default {
  state,
  getters,
  actions,
  mutations
}