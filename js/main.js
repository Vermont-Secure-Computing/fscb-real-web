
const importText =   document.getElementById('import-text');
const formCreateAccount =   document.getElementById('create-new-form');
const importTextButton = document.getElementById('import-text-button')
const mobileImportTextButton = document.getElementById('mobile-import-text-button')
const importTextForm = document.getElementById('import-text-form');
const userProfileForm = document.getElementById('user-profile-form')
const formAddBanker = document.getElementById('add-banker-form');
const formWithdraw = document.getElementById('withdraw-submit')
const contractName = document.getElementById("contract-name");
const creatorName = document.getElementById("creator-name");
const creatorEmail = document.getElementById("creator-email");
const creatorAddress = document.getElementById("creator-address");
const minusButton = document.getElementById('address-amount');
const withdrawalAddBtn = document.getElementById('withdrawal-plus-icon')
const getbankerClick = document.getElementsByClassName('getbankerClick')[0]
const getListClick = document.getElementsByClassName('getlistClick')[0]

/**
  Tabs container ids
**/
let importTextTab = document.getElementById('importText')
let firstTab = document.getElementById('first')
let secondTab = document.getElementById('second')
let addBankerTab = document.getElementById('addbanker')
let thirdTab = document.getElementById('third')
let fourthTab = document.getElementById('fourth')
let fifthTab = document.getElementById('sixth')

/**
  Import Text screen
**/
let importArea = document.getElementById('import-area')
let bankerVerifyWithdrawal = document.getElementById('banker-verify-withdrawal')
let bankerMessageSignTx = document.getElementById('banker-message-signtx-container')
let ownerMessageSignRequest = document.getElementById('owner-message-sign-request-container')
let ownerWithdrawalBroadcast = document.getElementById('owner-withdrawal-broadcast-container')
let bankerGeneratePrivkey = document.getElementById('banker-privkey-generation')

let openTab

let tabsContainer = document.querySelector("#tabs");
let tabTogglers = document.querySelectorAll("#tabs a, #mobileTabs a");

/**
  Withdrawal screen
**/
let withdrawalFee = document.getElementById("withdraw-fee")
let donateBtn = document.getElementById("donate-button")
let sendSignatureCloseBtn = document.getElementById("send-signature-close-btn")

/**
  Export screen
**/
let exportBtn = document.getElementById("export-btn")
let browseBtn = document.getElementById("export-browse-btn")
let inputFileBrowser = document.getElementById("select-dir")


/**
 * Add banker screen
 */
let bankerForm = document.getElementById('add-banker-form')
let bankersList = document.getElementById('bankers-list')
let bankerMessage = document.getElementById('banker-message-container')
let bankerListContainer = document.getElementById('bankers-list-container')


const sigNumber = document.getElementById('releaseCoins');
const currency = document.getElementById('account-coin-currency')
currency.addEventListener('change', setAccountCurrency)
let ACCOUNT_CURRENCY = "woodcoin"
let bankersArray
let selectedAccountDetails = {}
let USER = {}
let BANKERS

/**
  Withdrawal vars
**/
let unspentAmountTotal = 0
let userInputAmountTotal = 0
let TOTAL_AMOUNT_TO_WITHDRAW = 0
let CHANGE_ADDRESS
let CHANGE_AMOUNT
let DONATION_LOG = 'WhAiyvrEhG6Ty9AkTb1hnUwbT3PubdWkAg'
let DONATION_BTC = 'WhAiyvrEhG6Ty9AkTb1hnUwbT3PubdWkAg'
let DONATION_LTC = 'WhAiyvrEhG6Ty9AkTb1hnUwbT3PubdWkAg'
let DONATION_ADDRESS = 'WhAiyvrEhG6Ty9AkTb1hnUwbT3PubdWkAg'
let WITHDRAWAL_FEE = 0.01

/**
 * Check user data on load
 * If there is no user data, show user profile form
 * else fetch user and account data
 */
window.onload = async function() {

  let userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  if (!userData) {
    const userProfile = document.getElementById('user-profile')
    const mainContainer = document.getElementById("main-container")
    const mobileHeader = document.getElementById('mobile-header')
    userProfile.classList.remove('hidden')
    mainContainer.classList.add('hidden')
    mobileHeader.classList.add('hidden')
  } else {
    USER = userData
    const accounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : null;
    if (accounts) {
      listfile(accounts)
    }
  }

}

tabTogglers.forEach(function(toggler) {
    toggler.addEventListener("click", function(e) {
        e.preventDefault();
        importTextTab.classList.add('hidden')
        // Clear import textarea
        importText.value = ""

        //Close add banker message
        closeBankerMessage()

        //Close withdrawal request for sig screen
        closeSendSignatureOnLeave()

        let tabName = this.getAttribute("href");
        openTab = tabName;
        if (tabName === "#first") {
            balanceApi()
            let accountList = document.getElementById('accounts-list')
            let accountDetails = document.getElementById('account-details')
            let accountActions = document.getElementById('account-actions')
            let accountWithdrawal = document.getElementById('account-withdrawal')
            let withdrawalRef = document.getElementById('withdraw-reference')
            // Account Withdrawal screen
            let withdrawAddressInput = document.getElementById('withdraw-address')
            let withdrawAmountInput = document.getElementById('withdraw-amount')
            // Withdrawal reference screen
            let listUnspentRef = document.getElementById('banker-verify-inputs-initial')
            let listOutputRef = document.getElementById('banker-verify-outputs-initial')

            accountList.classList.remove("hidden")
            accountDetails.classList.add("hidden")
            accountActions.classList.add("hidden")
            accountWithdrawal.classList.add("hidden")
            withdrawalRef.classList.add("hidden")

            withdrawAddressInput.value = ""
            withdrawAmountInput.value = ""
            withdrawAddressInput.innerHTML = ""
            withdrawAmountInput.innerHTML = ""
        }
        if (tabName === "#addbanker") {
            refreshBankersList()
        }
        if (tabName === "#second") {
            accountBankerData()
        }
        let tabContents = document.querySelector("#tab-contents");
        
        for (let i = 0; i < tabContents.children.length-1; i++) {
          let tab = i + 1
          tabContents.children[tab].classList.remove("hidden");
          if ("#" + tabContents.children[tab].id === tabName) {
              continue;
          }
          tabContents.children[tab].classList.add("hidden");

        }
        for (let i = 0; i < tabTogglers.length; i++) {
          tabTogglers[i].parentElement.classList.remove("bg-gradient-to-l", "from-gray-500");
        }
        e.target.parentElement.classList.add("bg-gradient-to-l", "from-gray-500");
    });
});


/**
  Refresh button in account list screen
**/
let refreshBtn = document.getElementById("refresh-account-list")
refreshBtn.addEventListener("click", () => {
  balanceApi()
})
/**
  End of Refresh button in account list screen
**/


/**
 * Sanitize inputs by replacing HTML tags with a null string
 */
function removeTagsFromInput(str) {
  if ((str===null) || (str===''))
      return false;
  else
      str = str.toString();
       
  return str.replace( /(<([^>]+)>)/ig, '');
}
/**
 * End of sanitation
 */


function setAccountCurrency() {
  const coinCurrencySend = currency.options[currency.selectedIndex].text;
  ACCOUNT_CURRENCY = coinCurrencySend
  readBankersFile()
  accountBankerData()
}

async function readBankersFile() {
  const bankersArray = localStorage.getItem('bankers') ? JSON.parse(localStorage.getItem('bankers')) : null
  if (bankersArray) {
    console.log("bankersArray: ", bankersArray)
    
  }
  return
}


/* get balance from api */
async function balanceApi() {
    
    const allaccount = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null
    if (allaccount) {

      for(let i in allaccount) {
        if (allaccount[i].currency === 'woodcoin') {
          try {
            const apiUrl = `https://twigchain.com/ext/getAddress/${allaccount[i].address}`
            const response = await fetch(apiUrl)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                return data
              })
              .catch(error => {
                console.error('fetch Error:', error);
              });
              
              const body = response;
              if (body.address) {
                if (allaccount[i].address === body.address) {

                  allaccount[i].balance = body.balance

                  const accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null
                  if (accounts) {
                      const jdata = accounts
                      jdata[i] = allaccount[i]
                      
                      localStorage.setItem("accounts", JSON.stringify(jdata))

                      const readmore = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null
                      if (readmore) {
                        listfile(readmore)
                      }
                  }
                }
              }

          } catch (e) {
              console.log(e)
          }
        } else if (allaccount[i].currency === 'bitcoin') {
          try {
            const apiUrl = `https://api.logbin.org/api/coin/balance?address=${allaccount[i].address}&currency="BTC"`
            const response = await fetch(apiUrl, {
              method: "GET",
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              return data
            })
            .catch(error => {
              console.error('fetch Error:', error);
            });
            const body = response.message
            if (response.message.status === "success") {
              allaccount[i].balance = body.data.confirmed
              const accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null
              if (accounts) {
                const jdata = accounts
                jdata[i] = allaccount[i]
                localStorage.setItem("accounts", JSON.stringify(jdata))

                const readmore = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null
                if (readmore) {
                  listfile(readmore)
                }
                
              }
            }
          } catch (e) {
            console.log(e)
          }
        } else if (allaccount[i].currency === 'litecoin') {
          try {
            const apiUrl = `https://api.logbin.org/api/coin/balance?address=${allaccount[i].address}&currency="LTC"`
            const response = await fetch(apiUrl, {
              method: "GET"
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              return data
            })
            .catch(error => {
              console.error('fetch Error:', error);
            });
            const body = response.message
            if (response.message.status === "success") {
              allaccount[i].balance = body.data.confirmed
              const accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null
              if (accounts) {
                const jdata = accounts
                jdata[i] = allaccount[i]

                localStorage.setItem("accounts", JSON.stringify(jdata))

                const readmore = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null
                if (readmore) {
                  listfile(readmore)
                }
              }
            }
          } catch (e) {
            console.log(e)
          }
        } else {
          console.log("Chain not found")
          return
        }
    }
  }
}



/**
  Helper functions
**/
function setDonationAddress(currency) {
  if (currency === "woodcoin") {
    DONATION_ADDRESS = DONATION_LOG
  } else if (currency === "bitcoin") {
    DONATION_ADDRESS = DONATION_BTC
  } else if (currency === "litecoin") {
    DONATION_ADDRESS = DONATION_LTC
  } else {
    console.log("invalid currency")
  }
}

function isEmailValid(email) {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

async function listfile(evt) {
    const convertToJson = evt
    const accountBody = document.getElementById('accounts-list-body')
    const mobileAccountTableHead = document.getElementById('mobile-account-list-head')
    const mobileAccountTableBody = document.getElementById('mobile-account-list-body')

    let coinInitial;
    accountBody.innerHTML = ""
    mobileAccountTableBody.innerHTML = ""
    for(let x in convertToJson) {
      if(convertToJson.hasOwnProperty(x)){
        if (convertToJson[x].currency === 'woodcoin') {
          coinInitial = 'LOG'
        } else if (convertToJson[x].currency === 'bitcoin') {
          coinInitial = 'BTC'
        } else {
          coinInitial = 'LTC'
        }
        let row = accountBody.insertRow();
        let name = row.insertCell(0);
        name.setAttribute('class', 'text-center py-2')
        name.innerHTML = convertToJson[x].contract_name
        let address = row.insertCell(1);
        address.setAttribute('class', 'text-center')
        address.innerHTML = coinInitial + ':' + convertToJson[x].address
        let balance = row.insertCell(2);
        balance.setAttribute('class', 'text-center')
        balance.innerHTML = convertToJson[x].balance
        let veiwall = row.insertCell(3)
        veiwall.setAttribute('class', 'text-center')
        let viewAccountDetailsButton = document.createElement('button')
        viewAccountDetailsButton.setAttribute('class', "px-5 py-0.5 font-small text-white bg-orange-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-orange-500 hover:bg-orange-500 rounded-full")
        viewAccountDetailsButton.innerHTML = "view"
        veiwall.appendChild(viewAccountDetailsButton)
        let details = convertToJson[x]
        viewAccountDetailsButton.addEventListener("click", function() {getAccountDetails(details);}, false);
    
        /**
          Mobile view account list
        **/
        let bodytr1 = document.createElement('tr')
        bodytr1.setAttribute("class", "sm:table-row mb-2 sm:mb-0 text-sm font-normal")
        let headtd1 = document.createElement('td')
        headtd1.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
        headtd1.innerHTML = "Name"
        let bodytd1 = document.createElement('td')
        bodytd1.setAttribute("class", "border-grey-light border p-3")
        bodytd1.innerHTML = convertToJson[x].contract_name

        let bodytr2 = document.createElement('tr')
        bodytr2.setAttribute("class", "sm:table-row mb-2 sm:mb-0 text-sm font-normal")
        let headtd2 = document.createElement('td')
        headtd2.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
        headtd2.innerHTML = "Address"
        let bodytd2 = document.createElement('td')
        bodytd2.setAttribute("class", "break-all whitespace-normal border-grey-light border p-3")
        bodytd2.innerHTML = coinInitial + ':' + convertToJson[x].address

      
        let bodytr3 = document.createElement('tr')
        bodytr3.setAttribute("class", "sm:table-row mb-2 sm:mb-0 text-sm font-normal")
        let headtd3 = document.createElement('td')
        headtd3.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
        headtd3.innerHTML = "Balance"
        let bodytd3 = document.createElement('td')
        bodytd3.setAttribute("class", "border-grey-light border p-3")
        bodytd3.innerHTML = convertToJson[x].balance

        let bodytr4 = document.createElement('tr')
        bodytr4.setAttribute("class", "sm:table-row mb-2 sm:mb-0 text-sm font-normal")
        let headtd4 = document.createElement('td')
        headtd4.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
        headtd4.innerHTML = "Actions"
        let bodytd4 = document.createElement('td')
        bodytd4.setAttribute("class", "border-grey-light border p-3 text-center bg-orange-600")
        bodytd4.innerHTML = "View"
        let mobileDetails = convertToJson[x]
        bodytd4.addEventListener("click", function() {getAccountDetails(mobileDetails);}, false);

        let bodytr5 = document.createElement('tr')
        bodytr5.setAttribute("height", "12px")

        bodytr1.appendChild(headtd1)
        bodytr1.appendChild(bodytd1)
        bodytr2.appendChild(headtd2)
        bodytr2.appendChild(bodytd2)
        bodytr3.appendChild(headtd3)
        bodytr3.appendChild(bodytd3)
        bodytr4.appendChild(headtd4)
        bodytr4.appendChild(bodytd4)
        
        mobileAccountTableBody.appendChild(bodytr1)
        mobileAccountTableBody.appendChild(bodytr2)
        mobileAccountTableBody.appendChild(bodytr3)
        mobileAccountTableBody.appendChild(bodytr4)
        mobileAccountTableBody.appendChild(bodytr5)
      }
    }

}

/* account detail view */
function getAccountDetails(account){
    ACCOUNT_CURRENCY = account.currency
    if (account.hasOwnProperty('id')) {
      let accountList = document.getElementById('accounts-list')
      let accountDetails = document.getElementById('account-details')

      accountList.classList.add("hidden")
      accountDetails.classList.remove("hidden")

      //accountDetails.innerHTML = ""
      let accountName = document.getElementById('account-name')
      let accountEmail = document.getElementById('account-email')
      let accountBalance = document.getElementById('account-balance')
      let accountAddress = document.getElementById('account-address')
      let accountRedeemScript = document.getElementById('account-redeem-script')
      let accountCurrency = document.getElementById('account-currency')
      let accountSignatures = document.getElementById('account-signatures')

      accountName.innerHTML = account.contract_name
      accountEmail.innerHTML = account.creator_email
      accountBalance.innerHTML = account.balance
      accountAddress.innerHTML = account.address
      accountRedeemScript.innerHTML = account.redeem_script
      accountCurrency.innerHTML = account.currency
      accountSignatures.innerHTML = account.signature_nedded


      let tableBody = document.getElementById('account-bankers-list')
      let mobileAccountBankersListBody = document.getElementById('mobile-account-bankers-list-body')
      tableBody.innerHTML = ''
      mobileAccountBankersListBody.innerHTML = ''
      let bankers = account.bankers
      for(let x in bankers) {
        if(bankers.hasOwnProperty(x)){
          let pubkey = slicePubkey(bankers[x].pubkey)
          let row = tableBody.insertRow();
          let name = row.insertCell(0);
          name.innerHTML = bankers[x].banker_name
          let email = row.insertCell(1);
          email.innerHTML = bankers[x].banker_email
          let publicKey = row.insertCell(2);
          publicKey.innerHTML = pubkey

          /**
            Mobile view account details bankers list
          **/
          let bodytr1 = document.createElement('tr')
          bodytr1.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
          let headtd1 = document.createElement('td')
          headtd1.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
          headtd1.innerHTML = "Name"
          let bodytd1 = document.createElement('td')
          bodytd1.setAttribute("class", "border-grey-light border p-3")
          bodytd1.innerHTML = bankers[x].banker_name

          let bodytr2 = document.createElement('tr')
          bodytr2.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
          let headtd2 = document.createElement('td')
          headtd2.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
          headtd2.innerHTML = "Email"
          let bodytd2 = document.createElement('td')
          bodytd2.setAttribute("class", "border-grey-light border p-3")
          bodytd2.innerHTML = bankers[x].banker_email

        
          let bodytr3 = document.createElement('tr')
          bodytr3.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
          let headtd3 = document.createElement('td')
          headtd3.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
          headtd3.innerHTML = "Public key"
          let bodytd3 = document.createElement('td')
          bodytd3.setAttribute("class", "break-all whitespace-normal border-grey-light border p-3")
          bodytd3.innerHTML = pubkey

          let bodytr5 = document.createElement('tr')
          bodytr5.setAttribute("height", "12px")

          bodytr1.appendChild(headtd1)
          bodytr1.appendChild(bodytd1)
          bodytr2.appendChild(headtd2)
          bodytr2.appendChild(bodytd2)
          bodytr3.appendChild(headtd3)
          bodytr3.appendChild(bodytd3)
          
          mobileAccountBankersListBody.appendChild(bodytr1)
          mobileAccountBankersListBody.appendChild(bodytr2)
          mobileAccountBankersListBody.appendChild(bodytr3)
          mobileAccountBankersListBody.appendChild(bodytr5)
          /**
            End of Mobile view account details bankers list
          **/
        }
      }


      // Generate action and withdrawal buttons
      let buttonContainer = document.getElementById('account-buttons')
      buttonContainer.innerHTML = ''

      let viewActionsButton = document.createElement('button')
      viewActionsButton.classList.add("items-center", "m-2", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "text-white", "bg-orange-500", "rounded-full", "focus:ring-4", "focus:ring-yellow-200", "dark:focus:ring-yellow-900", "hover:bg-yellow-800")
      viewActionsButton.innerHTML = "Actions"
      let actions = account.withdrawals
      viewActionsButton.addEventListener("click", function() {listAccountActions(actions);}, false);

      /**
        Disable withdrawal button when account balance is zero(0)
      **/
      let withdrawalButton = document.createElement('button')
      withdrawalButton.innerHTML = "Withdrawal"
      if (account.balance > 0) {
        withdrawalButton.classList.add("inline-flex", "items-center", "m-2", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "text-white", "bg-orange-500", "rounded-full", "focus:ring-4", "focus:ring-yellow-200", "dark:focus:ring-yellow-900", "hover:bg-yellow-800")
        withdrawalButton.disabled = false;
      } else {
        withdrawalButton.classList.add("inline-flex", "items-center", "m-2", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "text-white", "bg-orange-500", "rounded-full", "cursor-not-allowed")
        withdrawalButton.disabled = true;
      }
      let address = {
        "address": account.address,
        "redeemscript": account.redeem_script,
        "currency": account.currency
    }
      withdrawalButton.addEventListener("click", function() {
        setDonationAddress(account.currency)
        accountWithdrawalFunc(address);
      }, false);


      buttonContainer.appendChild(viewActionsButton)
      buttonContainer.appendChild(withdrawalButton)

    }
  }


/**
  Account Actions Screen
  List request for signatures status
**/

function addNewlines(str) {
  var result = '';
  while (str.length > 0) {
    result += str.substring(0, 75) + '\n';
    str = str.substring(75);
  }
  return result;
}

function showTxId(txid) {
  let message = "Transaction ID: " + txid
  let messageLineBreaks = addNewlines(message)
  alert(messageLineBreaks)
}


/**
 * Account details
 * Actions screen
 * 
 */

function accountTxidDisplay(domElement, txid, w_id, banker_id, screen) {
  
  if (txid) {
    let id = screen === "web" ? 'view-txid-btn-' + String(w_id) + String(banker_id) : 'mobile-view-txid-btn-' + String(w_id) + String(banker_id)
    console.log("id: ", id)
    let viewBtn = "<button class='ml-4 disabled:opacity-75 bg-blue-500 active:bg-blue-700 text-white font-semibold hover:text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline' id='"+id+"'>View</button>"
    domElement.innerHTML = viewBtn
    
    let viewTxidBtn = document.getElementById(id)
    if(viewTxidBtn) {
      viewTxidBtn.addEventListener('click', () => {
        showTxId(txid)
      })
    }
  } else {
    domElement.innerHTML = ""
  }
}

function listAccountActions(actions, signatureNeeded){
  let accountDetails = document.getElementById('account-details')
  let accountWithdrawal = document.getElementById('account-withdrawal')
  let accountActions = document.getElementById('account-actions')
  accountDetails.classList.add("hidden")
  accountWithdrawal.classList.add("hidden")
  accountActions.classList.remove("hidden")

  let tableBody = document.getElementById('actions-list-body')
  let mobileTableBody = document.getElementById('mobile-actions-list-body')
  tableBody.innerHTML = ''
  mobileTableBody.innerHTML = ''

  /**
    Check if the withdrawal is ready for broadcasting
  **/
  for (const [index, withdrawal] of actions.entries()){
    for(let x in withdrawal.signatures) {
      if(withdrawal.signatures.hasOwnProperty(x)){
        let row = tableBody.insertRow();
        let id = row.insertCell(0);
        id.innerHTML = withdrawal.id
        let date = row.insertCell(1);
        let dateReq
        if (withdrawal.signatures[x].date_signed) {
          dateReq = new Date(withdrawal.signatures[x].date_signed);
        } else {
          dateReq = new Date(withdrawal.signatures[x].date_requested);
        }

        dateFormat = dateReq.toDateString()
        date.innerHTML = dateFormat
        let banker = row.insertCell(2);
        banker.innerHTML = withdrawal.signatures[x].banker_name
        let action = row.insertCell(3);
        action.innerHTML = withdrawal.signatures[x].action
        let txid = row.insertCell(4);
        accountTxidDisplay(txid, withdrawal.signatures[x].transaction_id, withdrawal.id, withdrawal.signatures[x].banker_id, "web")
        let status = row.insertCell(5);
        status.innerHTML = withdrawal.signatures[x].status


        /**
          Mobile view account list
        **/
        let bodytr1 = document.createElement('tr')
        bodytr1.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
        let headtd1 = document.createElement('td')
        headtd1.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
        headtd1.innerHTML = "ID"
        let bodytd1 = document.createElement('td')
        bodytd1.setAttribute("class", "border-grey-light border p-3")
        bodytd1.innerHTML = withdrawal.id

        let bodytr2 = document.createElement('tr')
        bodytr2.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
        let headtd2 = document.createElement('td')
        headtd2.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
        headtd2.innerHTML = "Date"
        let bodytd2 = document.createElement('td')
        bodytd2.setAttribute("class", "border-grey-light border p-3")
        bodytd2.innerHTML = dateFormat

      
        let bodytr3 = document.createElement('tr')
        bodytr3.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
        let headtd3 = document.createElement('td')
        headtd3.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
        headtd3.innerHTML = "Banker"
        let bodytd3 = document.createElement('td')
        bodytd3.setAttribute("class", "break-all whitespace-normal border-grey-light border p-3")
        bodytd3.innerHTML = withdrawal.signatures[x].banker_name

        let bodytr4 = document.createElement('tr')
        bodytr4.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
        let headtd4 = document.createElement('td')
        headtd4.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
        headtd4.innerHTML = "Actions"
        let bodytd4 = document.createElement('td')
        bodytd4.setAttribute("class", "border-grey-light border p-3")
        bodytd4.innerHTML = withdrawal.signatures[x].action

        let bodytr5 = document.createElement('tr')
        bodytr5.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
        let headtd5 = document.createElement('td')
        headtd5.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
        headtd5.innerHTML = "Txid"
        let bodytd5 = document.createElement('td')
        bodytd5.setAttribute("class", "border-grey-light border p-3")

        let bodytr6 = document.createElement('tr')
        bodytr6.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
        let headtd6 = document.createElement('td')
        headtd6.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
        headtd6.innerHTML = "Status"
        let bodytd6 = document.createElement('td')
        bodytd6.setAttribute("class", "border-grey-light border p-3")
        bodytd6.innerHTML = withdrawal.signatures[x].status

        let bodytr7 = document.createElement('tr')
        bodytr7.setAttribute("height", "12px")

        bodytr1.appendChild(headtd1)
        bodytr1.appendChild(bodytd1)
        bodytr2.appendChild(headtd2)
        bodytr2.appendChild(bodytd2)
        bodytr3.appendChild(headtd3)
        bodytr3.appendChild(bodytd3)
        bodytr4.appendChild(headtd4)
        bodytr4.appendChild(bodytd4)
        bodytr5.appendChild(headtd5)
        bodytr5.appendChild(bodytd5)
        bodytr6.appendChild(headtd6)
        bodytr6.appendChild(bodytd6)
        
        mobileTableBody.appendChild(bodytr1)
        mobileTableBody.appendChild(bodytr2)
        mobileTableBody.appendChild(bodytr3)
        mobileTableBody.appendChild(bodytr4)
        mobileTableBody.appendChild(bodytr5)
        mobileTableBody.appendChild(bodytr6)
        mobileTableBody.appendChild(bodytr7)

        accountTxidDisplay(bodytd5, withdrawal.signatures[x].transaction_id, withdrawal.id, withdrawal.signatures[x].banker_id, "mobile")
      }
    }

    if(withdrawal.hasOwnProperty('txid')){

      let row = tableBody.insertRow();
      let id = row.insertCell(0);
      id.innerHTML = withdrawal.id
      let date = row.insertCell(1);
      let date_broadcasted = new Date(withdrawal.date_broadcasted)
      dateFormat = date_broadcasted.toDateString()
      date.innerHTML = dateFormat
      let banker = row.insertCell(2);
      banker.innerHTML = "Owner"
      let action = row.insertCell(3);
      action.innerHTML = "Withdrawal broadcasted"
      let txid = row.insertCell(4);
      let viewBtn = "<button class='ml-4 disabled:opacity-75 bg-blue-500 active:bg-blue-700 text-white font-semibold hover:text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline' id='view-txid-btn'>View</button>"
      txid.innerHTML = viewBtn
      let viewTxidBtn = document.getElementById('view-txid-btn')
      viewTxidBtn.addEventListener('click', () => showTxId(withdrawal.txid))
      let status = row.insertCell(5);
      status.innerHTML = "Success"
    }
  }
}

let actionsBackBtn = document.getElementById('account-actions-back-btn')
actionsBackBtn.addEventListener('click', listAccountActionsBack)

function listAccountActionsBack(){
  let accountDetails = document.getElementById('account-details')
  let accountWithdrawal = document.getElementById('account-withdrawal')
  let accountActions = document.getElementById('account-actions')
  accountDetails.classList.remove("hidden")
  accountWithdrawal.classList.add("hidden")
  accountActions.classList.add("hidden")
}
/**
  End of Account Actions
**/



/**
  Owner view - Account withdrawal
**/
async function accountWithdrawalFunc(address){
    CHANGE_ADDRESS = address.address
    let coin_js
    if (address.currency === "woodcoin") {
      coin_js = coinjs
    } else if (address.currency === "bitcoin") {
      coin_js = bitcoinjs
    } else if (address.currency === "litecoin") {
      coin_js = litecoinjs
    } else {
      console.log("invalid currency")
    }
    const responseUnspent = await unspentApi(address)
    const listP = responseUnspent.utxo
    const script = coin_js.script()
    const addressScript = script.decodeRedeemScript(address.redeemscript)

    let accountDetails = document.getElementById('account-details')
    let accountWithdrawal = document.getElementById('account-withdrawal')
    let accountActions = document.getElementById('account-actions')
    let unspentdiv = document.getElementById('list-unspent')

    // Clear unspent list
    unspentdiv.innerHTML = ""
    unspentAmountTotal = 0
    userInputAmountTotal = 0
    TOTAL_AMOUNT_TO_WITHDRAW = 0

    let tx = coin_js.transaction();
    accountDetails.classList.add("hidden")
    accountWithdrawal.classList.remove("hidden")
    accountActions.classList.add("hidden")


    if (unspentAmountTotal == 0) {
        if (listP) {
            for (let i = 0; i < listP.length; i++) {
              let listPAmount;
              let listPTXID;
              let listPvout
              if (address.currency === 'woodcoin') {
                listPAmount = listP[i].amount / 100000000
                listPTXID = listP[i].txid
                listPvout = listP[i].vout
              } else {
                listPAmount = listP[i].value
                listPTXID = listP[i].hash
                listPvout = listP[i].index
              }
              unspentAmountTotal += Number(listPAmount)
                let div = document.createElement('div')
                div.setAttribute('id', 'inner-unspent')
                div.setAttribute('class', 'grid grid-cols-4 gap-3')
                let input1 = document.createElement('input')
                input1.setAttribute('class', 'col-span-2 txid-withdraw text-black text-sm md:text-base text-normal p-1')
                input1.setAttribute('id', 'txid-withdraw')
                input1.value = listPTXID
                let input2 = document.createElement('input')
                input2.setAttribute('class', 'text-black')
                input2.setAttribute('class', 'hidden')
                input2.setAttribute('id', 'vout-withdraw')
                input2.value = listPvout
                let input3 = document.createElement('input')
                input3.setAttribute('class', 'text-black text-sm md:text-base text-normal')
                input3.setAttribute('class', 'hidden')
                input3.setAttribute('id', 'script-withdraw')
                input3.value = addressScript.redeemscript
                let input4 = document.createElement('input')
                input4.setAttribute('class', 'col-span-1 text-black text-sm md:text-base text-normal p-1')
                input4.setAttribute('id', 'amount-withdraw')
                input4.value = listPAmount
                let input5 = document.createElement('input')
                input5.setAttribute('class', 'hidden')
                input5.value = address.redeemscript
                let check = document.createElement('input')
                check.setAttribute('type', 'checkbox')
                check.setAttribute('checked', '')
                check.addEventListener('change', (e, evt) => {
                  let withdrawAmt = getTotalWithdrawalAmt()

                  if(e.target.defaultChecked) {
                    check.removeAttribute('checked', '')

                    unspentAmountTotal -= parseFloat(input4.value)
                    withdrawalFee.value = (unspentAmountTotal - withdrawAmt).toFixed(8)
                  } else {
                    check.setAttribute('checked', '')
                    unspentAmountTotal += parseFloat(input4.value)
                    withdrawalFee.value = (unspentAmountTotal - withdrawAmt).toFixed(8)
                  }
                })
                div.appendChild(input1)
                div.appendChild(input2)
                div.appendChild(input3)
                div.appendChild(input4)
                div.appendChild(input5)
                div.appendChild(check)
                unspentdiv.appendChild(div)
            }
        }

    }
    withdrawalFee.value = (unspentAmountTotal).toFixed(8)

  }

  function getTotalWithdrawalAmt() {
    const getuserinput = document.querySelectorAll('#address-keys')
    let totalOutput = 0

    for (let i = 0; i < getuserinput.length; i++) {
      let amount = getuserinput[i].children[1].value
      totalOutput += Number(amount)
    }
    return totalOutput
  }

async function unspentApi(address) {
    if (address.currency === 'woodcoin') {
      try {
          
        const apiUrl = `https://api.logbin.org/api?address=${address.address}`
        const response = await fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          return data
        })
        .catch(error => {
          console.error('fetch Error:', error);
        });

        if (response.message) {
            const data = {
              "utxo": response.message.address,
              "currency": address.currency
            }
            return data
        }
      } catch(e) {
          console.log("error : ", e)
      }
    } else if (address.currency === 'bitcoin') {
      try {
        
        const apiUrl = `https://api.logbin.org/api/coin/utxo?address=${address.address}&currency="BTC"`
        const response = await fetch(apiUrl, {
          method: "GET",
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          return data
        })
        .catch(error => {
          console.error('fetch Error:', error);
        });
        

        if (response.message.status === "success") {
          const data = {
            "utxo": response.message.data.outputs,
            "currency": address.currency
          }
          return data
        }
      } catch(e) {
          console.log("error : ", e)
      }
    } else if (address.currency === 'litecoin') {
      try {
        const apiUrl = `https://api.logbin.org/api/coin/utxo?address=${address.address}&currency="BTC"`
        const response = await fetch(apiUrl, {
          method: "GET",
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          return data
        })
        .catch(error => {
          console.error('fetch Error:', error);
        });

        if (response.message.status === "success") {
          const data = {
            "utxo": response.message.data.outputs,
            "currency": address.currency
          }
          return data
        }
      } catch(e) {
          console.log("error : ", e)
      }
    } else {
      console.log("Chain not found")
      return
    }
}


/**
  Create user profile
**/
async function createUserProfile(e) {
    e.preventDefault()
    const userName = document.getElementById('user-name').value
    const userEmail = document.getElementById('user-email').value

    /**
      Validation
    **/
    if (userName == '' || userEmail == '') {
      alertError("Name and email is required.")
      return
    } else if (userName.length > 50) {
      alertError("Name should not be more than 50 characters")
      return
    } else if (!isEmailValid) {
      alertError("Invalid email address")
      return
    }

    writeUserData(userName, userEmail)
}

async function writeUserData(userName, userEmail) {

    const addProfileSubmit = document.getElementById('add-user-profile-btn')
    const userNameInput = document.getElementById('user-name')
    const userEmailInput = document.getElementById('user-email')

    addProfileSubmit.disabled = true
    addProfileSubmit.classList.add('opacity-20')
    try {

        let userData = {
          "user_name": userName,
          "user_email": userEmail
        }
        
        localStorage.setItem('user', JSON.stringify(userData));

        addProfileSubmit.disabled = false
        addProfileSubmit.classList.remove('opacity-20')
        userNameInput.value = '';
        userEmailInput.value = '';

        USER = userData
        const userProfile = document.getElementById('user-profile')
        const mainContainer = document.getElementById('main-container')
        const mobileHeader = document.getElementById('mobile-header')
        userProfile.classList.add('hidden')
        mainContainer.classList.remove('hidden')
        mobileHeader.classList.remove('hidden')
        alertSuccess("Profile has successfully been created")

    } catch (e) {
        console.log("Writing user data error: ", e)
    }

}

/**
  Enable / Disable the add banker submit button
**/
function addBankerButton(status) {
  const addBankerSubmit = document.getElementById('banker-submit-button')
  if (status === "enable") {
    addBankerSubmit.disabled = false
    addBankerSubmit.classList.remove('opacity-20')
  } else {
    addBankerSubmit.disabled = true
    addBankerSubmit.classList.add('opacity-20')
  }
}


/* add banker function */
async function addBanker(e) {
    e.preventDefault()
  
    const nameInput = document.getElementById('banker-name-add')
    const emailInput = document.getElementById('banker-email-add')
    addBankerButton("disable")

    // Get value of selected currency
    const selectElement = document.querySelector('#banker-coin-currency');
    const bankerCurrency = selectElement.options[selectElement.selectedIndex].text;

    const bankerName = removeTagsFromInput(nameInput.value)
    const bankerEmail = emailInput.value
    
    /**
      Add banker form validation
    **/
    if (bankerName == "" || bankerEmail == "") {
      alertError("User name and email is required.")
      addBankerButton("enable")
      return
    }
    if (bankerEmail) {
      let validEmail = isEmailValid(bankerEmail)
      if (!validEmail) {
        alertError("Please enter a valid email")
        addBankerButton("enable")
        return
      }
    }
    /**
      Check the banker to be add is already in the bankers,json
    **/
    if (BANKERS) {
      for(let x in BANKERS) {
          if(BANKERS.hasOwnProperty(x)){
              if (BANKERS[x].banker_name == bankerName && BANKERS[x].banker_email == bankerEmail && BANKERS[x].currency == bankerCurrency) {
                alertError("You are trying to add a banker that is already in the list.")
                addBankerButton("enable")
                return
              }
          }
      }
    }

    if (bankerEmail && bankerName) {
        const getBankerIdNumber = await bankerIdNumber()
        let data = {
            "id": Math.floor(1000000000 + Math.random() * 9000000000),
            "banker_id": getBankerIdNumber,
            "banker_name": bankerName,
            "banker_email": bankerEmail,
            "currency": bankerCurrency,
            "pubkey": ""
        }
        writeBankerData(data, getBankerIdNumber, nameInput, emailInput)
    }
}

async function writeBankerData(data, idNumber, nameInput, emailInput) {
    const bankersData = localStorage.getItem('bankers') ? JSON.parse(localStorage.getItem('bankers')) : null
    const addBankerSubmit = document.getElementById('banker-submit-button')
    try {
      if (bankersData) {
        const contentnew = bankersData
        contentnew["banker" + idNumber] = data
        
        // Update the bankers data in the localStorage
        localStorage.setItem('bankers', JSON.stringify(contentnew));
        
        addBankerSubmit.disabled = false
        addBankerSubmit.classList.remove('opacity-20')
        nameInput.value = '';
        emailInput.value = '';
        showBankerRequestSend(data)
      } else {
        const addBanker = {
          ["banker" + idNumber]: data
        }
        // Update the bankers data in the localStorage
        localStorage.setItem('bankers', JSON.stringify(addBanker));

        addBankerSubmit.disabled = false
        addBankerSubmit.classList.add('opacity-20')
        nameInput.value = '';
        emailInput.value = '';
        showBankerRequestSend(data)
      }
    } catch (e) {
        console.log(e)
    }

}

function showBankerRequestSend(data) {
    bankerListContainer.classList.add('hidden')
    bankerForm.classList.add('hidden')
    bankersList.classList.add('hidden')
    bankerMessage.classList.remove('hidden')


    let buttonDiv = document.getElementById('banker-message-close-button')
    buttonDiv.innerHTML = ""

    const div = document.createElement('div')
    div.setAttribute('class', 'bg-white p-3 rounded-md text-black')
    const p = document.createElement('p')
    const br = document.createElement('br')
    const p1 = document.createElement('p')
    const p2 = document.createElement('p')
    const p3 = document.createElement('p')
    const p4 = document.createElement('pre')
    p4.setAttribute("class", "whitespace-pre-wrap")
    const p5 = document.createElement('p')

    let userName = USER.user_name
    let message = {
      "header": "free_state_central_bank",
      "message": "request-pubkey",
      "creator_name": USER.user_name,
      "creator_email": USER.user_email,
      "banker_id": data.banker_id,
      "banker_name": data.banker_name,
      "banker_email": data.banker_email,
      "currency": data.currency
    }


    bankerMessage.innerHTML = ''
    p.innerHTML = "Please copy the line below and send it to " + message.banker_email;
    p1.innerHTML = USER.user_name + " is requesting for you to become a banker.";
    p2.innerHTML = "Please copy the message inside and import in FSCB";
    p3.innerHTML = "-----Begin fscb message-----";
    p4.innerHTML = JSON.stringify(message, undefined, 2);
    p5.innerHTML = "-----End fscb message-----";

    const copyToClipboardText = p1.innerHTML + '\n' + p2.innerHTML + '\n' + p3.innerHTML + '\n' + p4.innerHTML  + '\n' +  p5.innerHTML
    let copyButtonContainer = document.createElement('div')
    copyButtonContainer.setAttribute('class', 'flex justify-end')
    let copyButton = document.createElement('img')
    copyButton.setAttribute('src', './assets/imgs/copy_button.png')
    copyButton.setAttribute('class', 'px-2 cursor-pointer hover:scale-125 transition duration-500')
    copyButton.addEventListener("click", async function() {
      navigator.clipboard.writeText(copyToClipboardText);
      alertSuccess("Message successfully copied in clipboard.")
    }, false);

    copyButtonContainer.appendChild(copyButton)
    div.appendChild(copyButtonContainer)
    div.appendChild(p)
    div.appendChild(br)
    div.appendChild(p1)
    div.appendChild(p2)
    div.appendChild(p3)
    div.appendChild(p4)
    div.appendChild(p5)

    bankerMessage.appendChild(div)


    let closeButton = document.createElement('button')
    closeButton.classList.add("items-center", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "mt-5", "text-white", "bg-orange-500", "rounded-lg", "focus:ring-4", "focus:ring-blue-200", "dark:focus:ring-orange-500", "hover:bg-orange-500")
    closeButton.innerHTML = "Close"
    closeButton.addEventListener("click", function() {

      addBankerButton("enable")
      refreshBankersList()
      closeBankerMessage()
    }, false);

    buttonDiv.appendChild(closeButton)
    bankerMessage.appendChild(buttonDiv)
}

function closeBankerMessage() {
  bankerListContainer.classList.remove('hidden')
  bankerForm.classList.remove('hidden')
  bankersList.classList.remove('hidden')
  bankerMessage.classList.add('hidden')
}


/**
  Read user's data from the localStorage
**/
async function getUserData() {
  const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  return userData
}


async function getBankers() {
  try {
    const contents = localStorage.getItem('bankers') ? JSON.parse(localStorage.getItem('bankers')) : null
    return contents
  }catch(e) {
    console.log("Error trying to read bankers.json")
  }
}

async function refreshBankersList() {
  const contents = localStorage.getItem('bankers') ? JSON.parse(localStorage.getItem('bankers')) : null
  bankersListView(contents)
}

async function bankersListView(evt) {
    bankersArray = evt
    BANKERS = evt
    //
    // Start of Banker's table
    //
    const bankersBody = document.getElementById('bankers-list-body')
    const mobileBankersListBody = document.getElementById('mobile-bankers-list-body')

    bankersBody.innerHTML = ""
    mobileBankersListBody.innerHTML = ""
    for(let x in bankersArray) {
        if(bankersArray.hasOwnProperty(x)){
            let pubkey = slicePubkey(bankersArray[x].pubkey)
            let row = bankersBody.insertRow();
            let name = row.insertCell(0);
            name.innerHTML = bankersArray[x].banker_name
            let email = row.insertCell(1);
            email.innerHTML = bankersArray[x].banker_email
            let pubKey = row.insertCell(2);
            pubKey.innerHTML = pubkey
            let currency = row.insertCell(3)
            currency.innerHTML = bankersArray[x].currency

            /**
              Mobile view account list
            **/
            let bodytr1 = document.createElement('tr')
            bodytr1.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
            let headtd1 = document.createElement('td')
            headtd1.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
            headtd1.innerHTML = "Name"
            let bodytd1 = document.createElement('td')
            bodytd1.setAttribute("class", "border-grey-light border p-3")
            bodytd1.innerHTML = bankersArray[x].banker_name

            let bodytr2 = document.createElement('tr')
            bodytr2.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
            let headtd2 = document.createElement('td')
            headtd2.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
            headtd2.innerHTML = "Email"
            let bodytd2 = document.createElement('td')
            bodytd2.setAttribute("class", "border-grey-light border p-3")
            bodytd2.innerHTML = bankersArray[x].banker_email

          
            let bodytr3 = document.createElement('tr')
            bodytr3.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
            let headtd3 = document.createElement('td')
            headtd3.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
            headtd3.innerHTML = "Public key"
            let bodytd3 = document.createElement('td')
            bodytd3.setAttribute("class", "break-all whitespace-normal border-grey-light border p-3")
            bodytd3.innerHTML = pubkey

            let bodytr4 = document.createElement('tr')
            bodytr4.setAttribute("class", "sm:table-row sm:mb-0 text-base font-normal")
            let headtd4 = document.createElement('td')
            headtd4.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
            headtd4.innerHTML = "Currency"
            let bodytd4 = document.createElement('td')
            bodytd4.setAttribute("class", "border-grey-light border p-3")
            bodytd4.innerHTML = bankersArray[x].currency

            let bodytr5 = document.createElement('tr')
            bodytr5.setAttribute("height", "12px")

            bodytr1.appendChild(headtd1)
            bodytr1.appendChild(bodytd1)
            bodytr2.appendChild(headtd2)
            bodytr2.appendChild(bodytd2)
            bodytr3.appendChild(headtd3)
            bodytr3.appendChild(bodytd3)
            bodytr4.appendChild(headtd4)
            bodytr4.appendChild(bodytd4)
            
            mobileBankersListBody.appendChild(bodytr1)
            mobileBankersListBody.appendChild(bodytr2)
            mobileBankersListBody.appendChild(bodytr3)
            mobileBankersListBody.appendChild(bodytr4)
            mobileBankersListBody.appendChild(bodytr5)
        }
    }
}

async function accountBankerData() {
    const contents = localStorage.getItem('bankers') ? JSON.parse(localStorage.getItem('bankers')) : null;

    bankersArray = contents
    BANKERS = contents
    
    //
    // Start of Banker's table
    //
    const bankersBody = document.getElementById('bankers-list-body')

    bankersBody.innerHTML = ""
    for(let x in bankersArray) {
      if(bankersArray.hasOwnProperty(x)){
          let pubkey = slicePubkey(bankersArray[x].pubkey)
          let row = bankersBody.insertRow();
          let name = row.insertCell(0);
          name.innerHTML = bankersArray[x].banker_name
          let email = row.insertCell(1);
          email.innerHTML = bankersArray[x].banker_email
          let pubKey = row.insertCell(2);
          pubKey.innerHTML = pubkey
          let currency = row.insertCell(3)
          currency.innerHTML = bankersArray[x].currency
      }
    }
    //
    // End of Banker's table
    //
    
    
    const selectDiv = document.getElementById('banker-select')
    selectDiv.innerHTML = ''


    var select =  document.createElement("select");
    select.classList.add('hidden')
    select.setAttribute('multiple', '');
    select.dataset.placeholder = 'Choose Bankers'

    // Add the select component to the select container
    selectDiv.appendChild(select)

    // Get the selected value for contract currency
    // And filter bankers array with the value
    select.options.length = 0
    for(const key in bankersArray) {
      if(bankersArray[key].pubkey && bankersArray[key].currency === ACCOUNT_CURRENCY){
        const opt = bankersArray[key].banker_email;
        const pub = bankersArray[key].pubkey;
        const el = document.createElement("option");
        el.textContent = opt;
        el.value = pub;
        el.setAttribute('class', 'hidden')
        select.appendChild(el);
      }
    }

    const selectOptions = select.querySelectorAll('option');
    const newSelect = document.createElement('div');
    newSelect.setAttribute('class', 'selectMultiple bg-white w-full relative')
    const active = document.createElement('div');
    
    active.setAttribute('class', 'activeClass')
    const optionList = document.createElement('ul');
    optionList.setAttribute('class', 'optionListClass')
    
    const placeholder = select.dataset.placeholder;

    const span = document.createElement('span');
    span.setAttribute('class', 'spanClass')
    span.innerText = placeholder;
    active.appendChild(span);

    selectOptions.forEach((option) => {
        let text = option.innerText;
        if(option.selected){
            let tag = document.createElement('a');
            tag.setAttribute('class', 'relative pt-0 pr-5 pb-5 pl-0')
            tag.dataset.value = option.value;
            tag.innerHTML = "<em class='emClass'>"+text+"</em><i class='iClass'></i>";
            active.appendChild(tag);
            span.classList.add('opacity-0 invicible -translate-x-4');
        }else{
            let item = document.createElement('li');
            item.setAttribute('class', 'itemClass')
            item.dataset.value = option.value;
            item.innerHTML = text;
            optionList.appendChild(item);
        }
    });
    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    active.appendChild(arrow);

    newSelect.appendChild(active);
    newSelect.appendChild(optionList);

    select.parentElement.append(newSelect);
    span.appendChild(select);

    document.querySelector('.selectMultiple ul').addEventListener('click', (e) => {
        let li = e.target.closest('li');
        if(!li){return;}
        let select = li.closest('.selectMultiple');
        // add a checker, banker selected should not exceed to 14 bankers
        let selectedB = document.querySelectorAll('.activeClass a')
        if(!select.classList.contains('clicked') && selectedB.length < 14){
            select.classList.add('clicked');
            if(li.previousElementSibling){
                li.previousElementSibling.classList.add('beforeRemove');
            }
            if(li.nextElementSibling){
                li.nextElementSibling.classList.add('afterRemove');
            }
            li.classList.add('remove');
            let a = document.createElement('a');
            a.setAttribute('class', 'relative pt-0 pr-5 pb-5 pl-0')
            a.dataset.value = li.dataset.value;
            a.innerHTML = "<em class='emClass'>"+li.innerText+"</em><i class='iClass'></i>";
            a.classList.add('notShown');
            
            select.querySelector('div').appendChild(a); //might have to check later
            let selectEl = select.querySelector('select');
            let opt = selectEl.querySelector('option[value="'+li.dataset.value+'"]');
            opt.setAttribute('selected', 'selected');
            setTimeout(() => {
                a.classList.add('shown');
                select.querySelector('span').classList.add('hide');

            }, 300);
            //1st
            setTimeout(() => {
                let styles = window.getComputedStyle(li);
                    let liHeight = styles.height;
                    let liPadding = styles.padding;
                    let removing = li.animate([
                        {
                            height: liHeight,
                            padding: liPadding
                        },
                        {
                            height: '0px',
                            padding: '0px'
                        }
                    ], {
                        duration: 300, easing: 'ease-in-out'
                    });
                    removing.onfinish = () => {
                        if(li.previousElementSibling){
                            li.previousElementSibling.classList.remove('beforeRemove');
                        }
                        if(li.nextElementSibling){
                            li.nextElementSibling.classList.remove('afterRemove');
                        }
                        li.remove();
                        select.classList.remove('clicked');
                    }
            }, 300); //600
                //2nd
        } else {
          alertError("Maximum number of bankers in an account is 14.")
        }
    });
    //2
    //document.querySelectorAll('.selectMultiple > div a').forEach((a) => {
    document.querySelector('.selectMultiple > div').addEventListener('click', (e) => {
        let a = e.target.closest('a');
        let select = e.target.closest('.selectMultiple');
        if(!a){return;}
        a.className = '';
        a.classList.add('remove');
        select.classList.add('open');
        let selectEl = select.querySelector('select');
        let opt = selectEl.querySelector('option[value="'+a.dataset.value+'"]');
        opt.removeAttribute('selected');
        //setTimeout(() => {
            a.classList.add('disappear');
            setTimeout(() => {
                // start animation
                let styles = window.getComputedStyle(a);
                let padding = styles.padding;
                let deltaWidth = styles.width;
                let deltaHeight = styles.height;

                let removeOption = a.animate([
                    {
                        width: deltaWidth,
                        height: deltaHeight,
                        padding: padding
                    },
                    {
                        width: '0px',
                        height: '0px',
                        padding: '0px'
                    }
                ], {
                    duration: 0,
                    easing: 'ease-in-out'
                });

                let li = document.createElement('li');
                // li.setAttribute('class', 'itemClass')
                li.dataset.value = a.dataset.value;
                li.innerText = a.querySelector('em').innerText;
                li.classList.add('show');
                select.querySelector('ul').appendChild(li);
                setTimeout(() => {
                    if(!selectEl.selectedOptions.length){
                        select.querySelector('span').classList.remove('hide');
                    }
                    li.className = 'itemClass';
                }, 350);

                removeOption.onfinish = () => {
                    a.remove();
                }
                //end animation

            }, 300);
        //}, 400);
    });
    //});
    //3
    document.querySelectorAll('.selectMultiple > div .arrow, .selectMultiple > div span').forEach((el) => {
        el.addEventListener('click', (e) => {
            el.closest('.selectMultiple').classList.toggle('open');
        });
    });

}

function slicePubkey(pubkey) {
    if (pubkey) {
      return pubkey.substring(0, 20) + '...'
    } else {
      return "Pending ..."
    }
  }

function openImportTextTab() {
    importTextTab.classList.remove('hidden')
    firstTab.classList.add('hidden')
    secondTab.classList.add('hidden')
    addBankerTab.classList.add('hidden')
    thirdTab.classList.add('hidden')
    fourthTab.classList.add('hidden')
    fifthTab.classList.add('hidden')

    let tabContents = document.querySelector("#tab-contents");
    for (let i = 0; i < tabContents.children.length-1; i++) {
        tabTogglers[i].parentElement.classList.remove("bg-gradient-to-l", "from-gray-500");
    }
}

function alertSuccess(message) {
  let toastContainer = document.getElementById("tab-contents")
    Toastify({
        selector: toastContainer,
        text: message,
        duration: 5000,
        close: false,
        style: {
        background: '#d4edda',
        borderColor: '#c3e6cb',
        color: '#155724',
        textAlign: 'center',
        },
    }).showToast();
}

function alertError(message) {
    Toastify({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: '#f8d7da',
            borderColor: '#f5c6cb',
            color: '#721c24',
            textAlign: 'center',
        },
    }).showToast();
};

function verifyIfExists(ITEM, LIST) {
    let verification = false;
    for (let i = 0; i < LIST.length; i++) {
      if (LIST[i].name === ITEM) {
        verification = true;
        break;
      }
    }
    return verification;
  }

async function readdir(locFile) {
    try {
        let ret = await Filesystem.readdir({
        path: 'fscb',
        directory: Directory.Documents
        });
        if (verifyIfExists(locFile, ret.files)) {
            return true
        }
        else {
            // Do something else
            return false
        }
    }
    catch(e) {
        console.log('Unable to read dir: ' + e);
    }
}


/* generate contract id */
async function idNumber() {
    const dataJson = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null
    try {
      if (dataJson) {
        const jconvert = dataJson
        return jconvert[Object.keys(jconvert)[Object.keys(jconvert).length - 1]].contract_id + 1
          
      } else {
        return 1
      }
    } catch(err) {
        console.error(err)
    }
}

/* generate banker id */
async function bankerIdNumber() {
    const bankersData = localStorage.getItem('bankers') ? JSON.parse(localStorage.getItem('bankers')) : null
    try {
        if (bankersData) {
          const jconvert = bankersData
          return jconvert[Object.keys(jconvert)[Object.keys(jconvert).length - 1]].banker_id + 1
        } else {
            return 1
        }
    } catch(err) {
        console.error(err)
    }
}

function parseTextArea(e) {
    e.preventDefault();
    const textarea = document.getElementById('import-text');
    const jsonString = textarea.value;
    const startIndex = jsonString.indexOf('{');
    const endIndex = jsonString.lastIndexOf('}');

    if (startIndex !== -1 && endIndex !== -1) {
        let jsonStr = jsonString.substring(startIndex, endIndex + 1);
        jsonStr = jsonStr.replace(/\s/g, " ")
        addOrSign(jsonStr)
    } else {
      alertError("Invalid FSCB JSON message. Please copy the message sent to your email.")
    }
}


/**
 * 
 * Import text functions
 */
function addOrSign(options) {
    
    const banker = JSON.parse(options)
    
    if (banker.message.includes("request-pubkey")) {
      
      /**
        Generate new keys for the account
      **/
      bankerPukey(banker)
    }else if (banker.message.includes("response-pubkey")) {
      bankerPubkeyResponse(banker)
    }else if (banker.message.includes("request-signature")) {
      bankerSignatureRequest(banker)
    } else if (banker.message.includes("response-signature")) {
      bankerSignatureResponse(banker)
    } else if (banker.message.includes("import:json-data")) {
      importData(banker)
    } else {
      console.log("signature")
    }
  }

/* response banker signature */
async function bankerSignatureResponse(message) {
  const bankerCheckResult = await readdir('data.json');
  const accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null;
  if (accounts) {
    let accountID = message.id
    let bankerID = message.banker_id
    let next_banker

		for (const [key, value] of Object.entries(accounts)) {
      let account = value
      if (account.id == accountID) {
				for (const [index, withdrawal] of account.withdrawals.entries()){
					if (withdrawal.id == message.withdrawal_id){
			    	for (const [index, signature] of withdrawal.signatures.entries()) {
              
				      if(signature.banker_id == bankerID) {
                
				        signature.transaction_id = message.transaction_id
				        signature.status = "SIGNED"
				        const date_signed = new Date()
				        signature.date_signed = date_signed

                localStorage.setItem("accounts", JSON.stringify(accounts))
                const writeAccount = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null
                
                if (writeAccount) {
                  // check number of signatures needed
                  const signatures = withdrawal.signatures.filter(val => val.transaction_id != "");
                  if (signatures.length == account.signature_nedded) {
                    withdrawReadyToBroadcast(message)
                  } else {
                    let data = {
                      "account": account,
                      "message": message
                    }
                    responseBankerSignture(data)
                  }
                }
				      }
			    	}
					}
				}
			}
		}
  }
}

/* show user transaction ready for broadcast */
async function withdrawReadyToBroadcast(message) {
  ownerWithdrawalBroadcast.classList.remove('hidden')
  importArea.classList.add('hidden')

  let withdrawalTxId = document.getElementById('owner-withdrawal-txid-for-broadcast')
  withdrawalTxId.innerHTML = message.transaction_id

  let broadcastButton = document.getElementById("owner-withdrawal-broadcast-button")
  broadcastButton.addEventListener('click', () => {
    withdrawalApi(message)
  })

  let closeButton = document.getElementById("owner-withdrawal-close-button")
  closeButton.addEventListener('click', () => {
    importArea.classList.remove('hidden')
    ownerWithdrawalBroadcast.classList.add('hidden')
    importText.value = ""
    withdrawalTxId.innerHTML = ""

    showImportListScreen()
  })
}

/* broadcast transaction */
async function withdrawalApi(message) {
  const txid = message.transaction_id
	const accountId = message.id
	const withdrawalId = message.withdrawal_id

	if (message.currency === "woodcoin") {
		try {
	  
      const apiUrl = `https://api.logbin.org/api/broadcast/r?transaction=${txid}`
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          'Accept': 'application/json'
        },
        
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        return data
      })
      .catch(error => {
        console.error('fetch Error:', error);
      });
      
      const body = response
      if (body.message) {
        const accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null;
        if (accounts) {
          for (const [key, value] of Object.entries(accounts)) {
            let account = value
            if (account.id == accountId) {
              for (const [index, withdrawal] of account.withdrawals.entries()){
                if (withdrawal.id == withdrawalId){
                  withdrawal.date_broadcasted = Date.now()
                  withdrawal.txid = body.message.result
                  
                  localStorage.setItem("accounts", JSON.stringify(accounts))
                  
                }
              }
            }
          }
          withdrawalBroadcastResponse(body)
        }
      }
	  } catch(e) {
	    withdrawalBroadcastResponse(e.response)
	  }
	} else if (message.currency === "bitcoin" || message.currency === "litecoin") {
		let chain = message.currency === "bitcoin" ? "BTC" : "LTC";
		try {
      const apiUrl = `https://api.logbin.org/api/coin/broadcast?txid=${txid}&currency=${chain}`
      const response = await fetch(apiUrl, {
        method: "GET"
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        return data
      })
      .catch(error => {
        console.error('fetch Error:', error);
      });
      const resp = response.message
      let body

      if (resp.data) {
        body = {
          message: {
            result: resp.data.hash
          }
        }
      } else {
        body = {
          error : {
            error: {
              message: resp.error
            }
          }
        }
      }
      if (body.message) {
        
        const accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null;
        for (const [key, value] of Object.entries(accounts)) {
          let account = value
          if (account.id == accountId) {
            for (const [index, withdrawal] of account.withdrawals.entries()){
              if (withdrawal.id == withdrawalId){
                
                withdrawal.date_broadcasted = Date.now()
                withdrawal.txid = resp.data.hash
                
                /**
                 * Update the account record with the withdrawal txid
                 */
                localStorage.setItem("accounts", JSON.stringify(accounts))
                
              }
            }
          }
        }
        withdrawalBroadcastResponse(body)
      }
	  } catch(e) {
      withdrawalBroadcastResponse(e.response)
	  }
	} else {
		console.log("invalid currency")
		return
	}
}

/* broadcast response */
function withdrawalBroadcastResponse(res) {
  let withdrawalSuccessResponseContainer = document.getElementById('owner-withdrawal-response-success-container')
  let withdrawalErrorResponseContainer = document.getElementById('owner-withdrawal-response-error-container')

  let withdrawalTxIdResponse = document.getElementById('owner-withdrawal-txid-response')
  let withdrawalErrorResponse = document.getElementById('owner-withdrawal-error-response')

  let broadcastButton = document.getElementById("owner-withdrawal-broadcast-button")
  let closeButton = document.getElementById("owner-withdrawal-close-button")
  closeButton.addEventListener('click', () => {
    showImportListScreen()
  })

  if(res.message){
    withdrawalSuccessResponseContainer.classList.remove('hidden')
    withdrawalTxIdResponse.innerHTML = res.message.result

    closeButton.classList.remove('hidden')
    broadcastButton.classList.add('hidden')

    /**
      Update the account details with the withdrawal transaction
    */

  } else {
    withdrawalErrorResponseContainer.classList.remove('hidden')
    withdrawalErrorResponse.innerHTML = res.error.error.message

    closeButton.classList.remove('hidden')
    broadcastButton.classList.add('hidden')
  }
}

/* response banker signature from import text */
async function responseBankerSignture(data) {
  const account = data.account
  const message = data.message

  // Loop thru the account withdrawal array And
  // get the list of bankers that already signed
  const bankers = account.bankers
  let acctWithdrawal
  let signedBankers = []

  for (const [index, withdrawal] of account.withdrawals.entries()) {
    if (withdrawal.id === Number(message.withdrawal_id)) {
      
      let sx = withdrawal.signatures
      for (const [index, signature] of sx.entries()) {
        if (signature.status === "SIGNED") {
          signedBankers.push(signature)
        }
      }
    }
  }
  
  const bankersArray = bankers.filter((elem) => !signedBankers.find((banker) => elem.banker_id === banker.banker_id));

  let selectNextBankerScreen = document.getElementById('request-sig-next-banker-select')
  selectNextBankerScreen.classList.remove('hidden')
  importArea.classList.add('hidden')

  //
  // Start of Signed Banker's table
  //
  const bankersBody = document.getElementById('signed-bankers-list-body')

  bankersBody.innerHTML = ""
  for(let x in signedBankers) {
      if(signedBankers.hasOwnProperty(x)){
          let signedTx = slicePubkey(signedBankers[x].transaction_id)
          let row = bankersBody.insertRow();
          let name = row.insertCell(0);
          name.innerHTML = signedBankers[x].banker_name
          let dateSigned = row.insertCell(1);
          let ds = signedBankers[x].date_signed
          dateFormat = ds.toDateString()
          dateSigned.innerHTML = dateFormat
          let signature = row.insertCell(2);
          signature.innerHTML = signedTx
      }
  }
  //
  // End of Banker's table
  //


  let selectBankers = document.getElementById("next-banker-to-sign-container")
  var select =  document.getElementById("select-next-bankers-to-sign");
  select.innerHTML = ''
  select.dataset.placeholder = 'Choose Bankers'

  const el = document.createElement("option");
  el.textContent = "Select a banker";
  el.value = "";
  select.appendChild(el);
  bankersArray.forEach((banker, i) => {
    const opt = banker.banker_email;
    const pub = banker.pubkey;
    const el = document.createElement("option");
    el.textContent = opt;
    el.value = JSON.stringify(banker);
    select.appendChild(el);
  });

  let generateBtn = document.getElementById('generate-next-sign-message')
  generateBtn.addEventListener('click', () => {
    const banker = select.options[select.selectedIndex].value;

    if (banker) {
      // let parsedBanker = JSON.parse(banker)
      // ipcRenderer.send("owner:save-next-banker", {account, message, parsedBanker})
      const optiondata = {
        account,
        message,
        "banker": JSON.parse(banker)
      }
      
      ownerSaveNextBanker(optiondata)
    } else {
      alertError("Please select a banker.")
    }
  })
}

/* owner save data next banker */
async function ownerSaveNextBanker(data) {
  let account = data.account
	let message = data.message
	let next_banker = data.banker

  const accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null;
	if (accounts) {
		for (const [key, value] of Object.entries(accounts)) {
      let acct = value
      if (acct.id == account.id) {
				for (const [index, withdrawal] of acct.withdrawals.entries()){
					if (withdrawal.id == message.withdrawal_id){

					  let newMessage = {
					    "header": "free_state_central_bank",
					    "message":"request-signature",
					    "id": message.id,
					    "contract_name": message.contract_name,
					    "banker_id": next_banker.banker_id,
					    "creator_name": message.creator_name,
					    "creator_email": message.creator_email,
					    "banker_name": next_banker.banker_name,
					    "banker_email": next_banker.banker_email,
					    "transaction_id_for_signature": message.transaction_id,
					    "currency": message.currency,
							"withdrawal_id": message.withdrawal_id,
					  }

					  // Create new signature object in the account signature array
					  const newSignatory = {
					    "banker_id": next_banker.banker_id,
							"banker_name": next_banker.banker_name,
					    "date_requested": Date.now(),
					    "date_signed": null,
					    "status": "PENDING",
					    "transaction_id": "",
							"action": "Request for signature"
					  }
					  withdrawal.signatures.push(newSignatory)

            localStorage.setItem("accounts", JSON.stringify(accounts))
            ownerShowBankerSignatureMessage(newMessage)

					}
				}
			}
		}
	}
}

/* show user message signature to be send on banker */
async function ownerShowBankerSignatureMessage(message) {
  alertSuccess("Banker signature successfully updated.")

  ownerMessageSignRequest.classList.remove('hidden')
  let selectNextBankerScreen = document.getElementById('request-sig-next-banker-select')
  selectNextBankerScreen.classList.add('hidden')

  let ownerMessageSignRequestBody = document.getElementById('owner-message-sign-request-body')
  let signResponseTitle = document.getElementById('sign-request-title')
  let buttonDiv = document.getElementById('owner-message-sign-request-close-button')
  const div = document.createElement('div')
  div.setAttribute('class', 'bg-white p-3 rounded-md text-black')

  const p1 = document.createElement('p')
  const p2 = document.createElement('p')
  const p3 = document.createElement('p')
  const p4 = document.createElement('pre')
  p4.setAttribute("class", "whitespace-pre-wrap")
  const p5 = document.createElement('p')

  ownerMessageSignRequestBody.innerHTML = ''

  signResponseTitle.innerHTML = "Please copy the line below and send it to " + message.banker_email;
  p1.innerHTML = USER.user_name + " is requesting for a withdrawal transaction from " + message.contract_name;
  p2.innerHTML = "Please copy the message inside and import in FSCB";
  p3.innerHTML = "-----Begin fscb message-----";
  p4.innerHTML = JSON.stringify(message, undefined, 2);
  p5.innerHTML = "-----End fscb message-----";

  const copyToClipboardText = p1.innerHTML + '\n' + p2.innerHTML + '\n' + p3.innerHTML + '\n' + p4.innerHTML  + '\n' +  p5.innerHTML
  let copyButtonContainer = document.createElement('div')
  copyButtonContainer.setAttribute('class', 'flex justify-end')
  let copyButton = document.createElement('img')
  copyButton.setAttribute('src', './assets/imgs/copy_button.png')
  copyButton.setAttribute('width', '50')
  copyButton.setAttribute('height', '50')
  copyButton.setAttribute('class', 'px-2 cursor-pointer hover:scale-125 transition duration-500')
  copyButton.addEventListener("click", async function() {
    navigator.clipboard.writeText(copyToClipboardText);
    alertSuccess("Message successfully copied in clipboard.")
  }, false);

  copyButtonContainer.appendChild(copyButton)
  div.appendChild(copyButtonContainer)

  p1.classList.add('my-1')
  p4.classList.add('whitespace-pre-wrap', 'break-all')
  div.appendChild(p1)
  div.appendChild(p2)
  div.appendChild(p3)
  div.appendChild(p4)
  div.appendChild(p5)

  ownerMessageSignRequestBody.appendChild(div)


  let closeButton = document.createElement('button')
  closeButton.classList.add("items-center", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "mt-5", "text-white", "bg-orange-500", "rounded-lg", "focus:ring-4", "focus:ring-blue-200", "dark:focus:ring-orange-500", "hover:bg-orange-500")
  closeButton.innerHTML = "Close"
  closeButton.addEventListener("click", function() {
    importArea.classList.remove('hidden')
    ownerMessageSignRequest.classList.add('hidden')
    importText.value = ""

    showImportListScreen()
  }, false);

  buttonDiv.appendChild(closeButton)
}

/* request banker signature */
async function bankerSignatureRequest (message) {
  importArea.classList.add('hidden')
  bankerVerifyWithdrawal.classList.remove('hidden')

  let inputsTable = document.getElementById('banker-verify-inputs')
  let outputsTable = document.getElementById('banker-verify-outputs')

  let coin_js
  if (message.currency === "woodcoin") {
    coin_js = coinjs
  } else if (message.currency === "bitcoin") {
    coin_js = bitcoinjs
  } else if (message.currency === "litecoin") {
    coin_js = litecoinjs
  } else {
    console.log("invalid currency")
  }
  const tx = coin_js.transaction()
  const deserializeTx = tx.deserialize(message.transaction_id_for_signature)

  let inputs = deserializeTx.ins
  let outputs = deserializeTx.outs

  for (let i = 0; i < inputs.length; i++) {
    var s = deserializeTx.extractScriptKey(i);
    let input = inputs[i]

    let div = document.createElement('div')
    div.setAttribute('class', 'grid grid-cols-7 gap-3 text-black')
    let inputs1 = document.createElement('input')
    inputs1.setAttribute('readonly', true)
    inputs1.setAttribute('class', 'col-span-3 txid-withdraw p-1 text-sm text-normal')
    inputs1.value = input.outpoint.hash
    
    let inputs2 = document.createElement('input')
    inputs2.setAttribute('readonly', true)
    inputs2.setAttribute('class', 'col-span-1 text-center');
    inputs2.value = input.outpoint.index
    
    let inputs3 = document.createElement('input')
    inputs3.setAttribute('readonly', true)
    inputs3.setAttribute('class', 'col-span-3 bg-gray-300 p1 text-sm text-normal');
    inputs3.value = s.script
    
    div.appendChild(inputs1)
    div.appendChild(inputs2)
    div.appendChild(inputs3)

    inputsTable.appendChild(div)
  }

  for (let i = 0; i < outputs.length; i++) {

    let output = outputs[i]
    if(output.script.chunks.length==2 && output.script.chunks[0]==106){ // OP_RETURN

      var data = Crypto.util.bytesToHex(output.script.chunks[1]);
      var dataascii = hex2ascii(data);

      if(dataascii.match(/^[\s\d\w]+$/ig)){
        data = dataascii;
      }

      let div = document.createElement('div')
      div.setAttribute('class', 'grid grid-cols-7 gap-3 text-black')
      let outputs1 = document.createElement('input')
      outputs1.setAttribute('readonly', true)
      outputs1.setAttribute('class', 'col-span-3 txid-withdraw p-1 text-sm text-normal')
      outputs1.value = data
      
      let outputs2 = document.createElement('input')
      outputs2.setAttribute('readonly', true)
      outputs2.setAttribute('class', 'col-span-1 text-sm text-center');
      outputs2.value = (output.value/100000000).toFixed(8)
      
      let outputs3 = document.createElement('input')
      outputs3.setAttribute('readonly', true)
      outputs3.setAttribute('class', 'col-span-3 bg-gray-300 p1 text-sm text-normal');
      outputs3.value = Crypto.util.bytesToHex(output.script.buffer)
      
      div.appendChild(outputs1)
      div.appendChild(outputs2)
      div.appendChild(outputs3)

      outputsTable.appendChild(div)
    } else {

      var addr = '';
      if(output.script.chunks.length==5){
        addr = coin_js.scripthash2address(Crypto.util.bytesToHex(output.script.chunks[2]));
      } else if((output.script.chunks.length==2) && output.script.chunks[0]==0){
        addr = coin_js.bech32_encode(coin_js.bech32.hrp, [coin_js.bech32.version].concat(coin_js.bech32_convert(output.script.chunks[1], 8, 5, true)));
      } else {
        var pub = coin_js.pub;
        coin_js.pub = coin_js.multisig;
        addr = coin_js.scripthash2address(Crypto.util.bytesToHex(output.script.chunks[1]));
        coin_js.pub = pub;
      }

      let div = document.createElement('div')
      div.setAttribute('class', 'grid grid-cols-7 gap-3 text-black')
      let outputs1 = document.createElement('input')
      outputs1.setAttribute('readonly', true)
      outputs1.setAttribute('class', 'col-span-3 txid-withdraw p-1 text-sm text-normal')
      outputs1.value = addr
      
      let outputs2 = document.createElement('input')
      outputs2.setAttribute('readonly', true)
      outputs2.setAttribute('class', 'col-span-1 text-sm text-center');
      outputs2.value = (output.value/100000000).toFixed(8)
      
      let outputs3 = document.createElement('input')
      outputs3.setAttribute('readonly', true)
      outputs3.setAttribute('class', 'col-span-3 bg-gray-300 p1 text-sm text-normal');
      outputs3.value = Crypto.util.bytesToHex(output.script.buffer)
      
      div.appendChild(outputs1)
      div.appendChild(outputs2)
      div.appendChild(outputs3)

      outputsTable.appendChild(div)
    }
  }

  let signButton = document.getElementById("banker-sign-button")
  signButton.addEventListener('click', () => {

    let pk = document.getElementById('banker-pivkey-for-signature')
    let privkey = pk.value
    
    if (privkey) {
        if (isWifKeyValid(privkey)) {
        bankerSignTransaction(message, privkey)
        } else {
          alertError('The text you entered is not a valid private key.')
        }
    } else {
      alertError('Please enter your private key for this account.')
    }

  })
}

function bankerSignTransaction(message, privkey) {

  let tx
  if (message.currency === "woodcoin") {
    tx = coinjs.transaction()
  } else if (message.currency === "bitcoin") {
    tx = bitcoinjs.transaction()
  }  else if (message.currency === "litecoin") {
    tx = litecoinjs.transaction()
  }

  const scriptToSign = tx.deserialize(message.transaction_id_for_signature)
  const signedTX = scriptToSign.sign(privkey, 1)

  bankerVerifyWithdrawal.classList.add('hidden')
  bankerMessageSignTx.classList.remove('hidden')

  let bankerMessageSignTxBody = document.getElementById('banker-message-signtx-body')
  let signResponseTitle = document.getElementById('sign-response-title')
  let buttonDiv = document.getElementById('banker-message-signtx-close-button')
  buttonDiv.innerHTML = ""
  const div = document.createElement('div')
  div.setAttribute('class', 'bg-white p-3 rounded-md text-black')

  const p1 = document.createElement('p')
  const p2 = document.createElement('p')
  const p3 = document.createElement('p')
  const p4 = document.createElement('pre')
  const p5 = document.createElement('p')

  delete message.transaction_id_for_signature
  message.message = "response-signature-" + message.banker_id
  message.transaction_id = signedTX

  bankerMessageSignTxBody.innerHTML = ''

  signResponseTitle.innerHTML = "Please copy the line below and send it to " + message.creator_email;
  p1.innerHTML = USER.user_name + " response for your withdrawal signature request for " + message.contract_name;
  p2.innerHTML = "Please copy the message inside and import in FSCB";
  p3.innerHTML = "-----Begin fscb message-----";
  p4.innerHTML = JSON.stringify(message, undefined, 2);
  p5.innerHTML = "-----End fscb message-----";

  const copyToClipboardText = p1.innerHTML + '\n' + p2.innerHTML + '\n' + p3.innerHTML + '\n' + p4.innerHTML  + '\n' +  p5.innerHTML

  let copyButtonContainer = document.createElement('div')
  copyButtonContainer.setAttribute('class', 'flex justify-end')
  let copyButton = document.createElement('img')
  copyButton.setAttribute('src', './assets/imgs/copy_button.png')
  copyButton.setAttribute('class', 'px-2 cursor-pointer hover:scale-125 transition duration-500')
  copyButton.addEventListener("click", async function() {
    navigator.clipboard.writeText(copyToClipboardText);
    alertSuccess("Message successfully copied in clipboard.")
  }, false);

  copyButtonContainer.appendChild(copyButton)
  div.appendChild(copyButtonContainer)

  p1.classList.add('my-1')
  p4.classList.add('whitespace-pre-wrap', 'break-all')
  div.appendChild(p1)
  div.appendChild(p2)
  div.appendChild(p3)
  div.appendChild(p4)
  div.appendChild(p5)

  bankerMessageSignTxBody.appendChild(div)


  let closeButton = document.createElement('button')
  closeButton.classList.add("items-center", "px-5", "py-2.5", "text-sm", "font-medium", "text-center", "mt-5", "text-white", "bg-orange-500", "rounded-lg", "focus:ring-4", "focus:ring-blue-200", "dark:focus:ring-orange-500", "hover:bg-orange-500")
  closeButton.innerHTML = "Close"
  closeButton.addEventListener("click", function() {

    importArea.classList.remove('hidden')
    bankerMessageSignTx.classList.add('hidden')
    importText.value = ""
    bankerMessageSignTxBody.innerHTML = ""

    // Clear verify withdrawal inputs
    let inputsTable = document.getElementById('banker-verify-inputs')
    let outputsTable = document.getElementById('banker-verify-outputs')
    let userPrivKey = document.getElementById('banker-pivkey-for-signature')

    inputsTable.innerHTML = ""
    outputsTable.innerHTML = ""
    userPrivKey.value = ""

    showImportListScreen()
  }, false);

  buttonDiv.appendChild(closeButton)
};

/* request banker pubkey */
async function bankerPukey(message) {
    importArea.classList.add('hidden')
    bankerGeneratePrivkey.classList.remove('hidden')
    let coin_js
    if (message.currency === "woodcoin") {
      coin_js = coinjs
    } else if (message.currency === "bitcoin") {
      coin_js = bitcoinjs
    } else if (message.currency === "litecoin") {
      coin_js = litecoinjs
    } else {
      return
    }
    coin_js.compressed = true
    const userAddress = await coin_js.newKeys()

    let privkeyHexInput = document.getElementById('pivkey-hex')
    let privkeyWifInput = document.getElementById('pivkey-wif')
    let pubkeyInput = document.getElementById('pubkey-compressed')
    let accountOwner = document.getElementById('account-owner-name')
    let accountOwner2 = document.getElementById('account-owner-name2')

    privkeyHexInput.value = userAddress.privkey
    privkeyWifInput.value = userAddress.wif
    pubkeyInput.value = userAddress.pubkey
    accountOwner.innerHTML = message.creator_name
    accountOwner2.innerHTML = message.creator_name

    let generatePrivkey = document.getElementById('banker-generate-privkey')
    let finalizeKeys = document.getElementById('banker-finalize-keys')

    generatePrivkey.addEventListener('click', async() => {
      let updatedHex = privkeyHexInput.value
      let isValid = isKeyValid(updatedHex)
      if (!isValid) {
        alertError("The text you entered is not a valid private key")
        return
      }

      coin_js.compressed = true
      const newKeys = await coin_js.newKeysFromHex(updatedHex)

      privkeyHexInput.value = newKeys.privkey
      privkeyWifInput.value = newKeys.wif
      pubkeyInput.value = newKeys.pubkey

      return

    })

    finalizeKeys.addEventListener('click', () => {

      let pubkey = pubkeyInput.value
      message.message = "response-pubkey"
      message.pubkey = pubkey

      bankerGeneratePrivkey.classList.add('hidden')
      finalizeNewKeys(message)
    })

    return
}

function finalizeNewKeys(evt){
    const textBody = document.getElementById('text-show')
    const textId = document.getElementById('import-show')
    const textImport = document.getElementById('import-area')
    const textImportArea = document.getElementById('import-text')
    const div = document.createElement('div')
    div.setAttribute('class', 'bg-white p-3 rounded-md')

    const btnContainer = document.createElement('div')
    btnContainer.setAttribute('class', 'flex justify-end')
    const button = document.createElement('button')
    button.setAttribute('class', 'items-center px-10 py-3 text-sm font-medium text-center text-white bg-orange-500 focus:ring-4 focus:ring-orange-500 dark:focus:bg-orange-500 hover:bg-orange mt-5 rounded-full')
    button.setAttribute('id', "import-again-button")
    button.textContent = "Clear"
    btnContainer.appendChild(button)

    textBody.innerHTML = ""
    const p = document.createElement('p')
    const br = document.createElement('br')
    const p1 = document.createElement('p')
    const p2 = document.createElement('p')
    const p3 = document.createElement('p')
    const p4 = document.createElement('pre')
    const p5 = document.createElement('p')
    textId.classList.remove('hidden')
    textImport.classList.add('hidden')
    textImportArea.value = ''
    p.innerHTML = "Please copy the line below and send it to " + evt.creator_name;
    p1.innerHTML = evt.banker_name + " public key response to " + evt.creator_name + " request";
    p2.innerHTML = "Please copy the message inside and import in FSCB";
    p3.innerHTML = "-----Begin fscb message-----";
    p4.innerHTML = JSON.stringify(evt, undefined, 2);
    p5.innerHTML = "-----End fscb message-----";
    p4.classList.add('whitespace-pre-wrap', 'break-all')

    const copyToClipboardText = p1.innerHTML + '\n' + p2.innerHTML + '\n' + p3.innerHTML + '\n' + p4.innerHTML  + '\n' +  p5.innerHTML
    let copyButtonContainer = document.createElement('div')
    copyButtonContainer.setAttribute('class', 'flex justify-end')
    let copyButton = document.createElement('img')
    copyButton.setAttribute('src', './assets/imgs/copy_button.png')
    copyButton.setAttribute('class', 'px-2 cursor-pointer hover:scale-125 transition duration-500')
    copyButton.addEventListener("click", async function() {
      navigator.clipboard.writeText(copyToClipboardText);
      alertSuccess("Message successfully copied in clipboard.")
    }, false);

    copyButtonContainer.appendChild(copyButton)
    div.appendChild(copyButtonContainer)
    div.appendChild(p)
    div.appendChild(br)
    div.appendChild(p1)
    div.appendChild(p2)
    div.appendChild(p3)
    div.appendChild(p4)
    div.appendChild(p5)
    textBody.appendChild(div)
    textBody.appendChild(btnContainer)
    const importAgain = document.getElementById('import-again-button')
    importAgain.addEventListener('click', importAgainShow)
};

function importAgainShow(div, button) {
  const textId = document.getElementById('import-show')
  const textImport = document.getElementById('import-area')
  const textBody = document.getElementById('text-show')
  textId.classList.add('hidden')
  textImport.classList.remove('hidden')
  textBody.innerHTML = ''

}

function isKeyValid(hex) {
    var key = hex.toString();
    var isValidFormat = /^[0-9a-fA-F]{64}$/.test(key)
    return isValidFormat
  }

  function isWifKeyValid(hex) {
    var key = hex.toString();
    var isValidFormat = /^[0-9a-zA-Z]{52}$/.test(key)
    return isValidFormat
  }

/* response banker pubkey */

async function bankerPubkeyResponse(evt) {
    
    const bankersData = localStorage.getItem('bankers') ? JSON.parse(localStorage.getItem('bankers')) : null
    if (bankersData) {
      
      for (const i in bankersData) {
        if (bankersData[i].banker_id == evt.banker_id) {
          bankersData[i].pubkey = evt.pubkey
        
          localStorage.setItem('bankers', JSON.stringify(bankersData))
          importText.value = ''
          alertSuccess("Successfully added banker's public key.")
        }
      }
    }else {
      console.log("err in adding banker pubkey")
    }
  }

/* Create contract */
async function saveAndCreateText(e) {
    e.preventDefault();
    
    const contractSendName = removeTagsFromInput(contractName.value);
    const creatorSendName = USER.user_name;
    const creatorSendEmail = USER.user_email;

    const sigSendNumber = sigNumber.options[sigNumber.selectedIndex].text;
    const coinCurrencySend = currency.options[currency.selectedIndex].text;
    const innerMultiKey = document.querySelectorAll('.activeClass a')



    let coin_js

    if (coinCurrencySend === "woodcoin") {
      coin_js = coinjs
    } else if (coinCurrencySend === "bitcoin") {
      coin_js = bitcoinjs
    } else if (coinCurrencySend === "litecoin") {
      coin_js = litecoinjs
    } else {
      console.log("invalid currency")
    }

    coin_js.compressed = true
    const creatorAddressDetail = await coin_js.newKeys()


    /**
      New account data validation
    **/
    if (contractSendName == "") return alertError("Contract name is required.")
    if (contractSendName.length > 75) return alertError("Contract name should not be more than 75 characters.")
    if (innerMultiKey.length == 0) return alertError("Please select a banker")
    if (innerMultiKey.length < parseInt(sigSendNumber)) return alertError("Number of required signature should not be more than the number of bankers.")

    let bankersMerge = [];
    for (let i = 0; i < innerMultiKey.length; i++) {
        bankersMerge.push(innerMultiKey[i].dataset.value)
    }


    const keys = bankersMerge;
    const multisig =  coin_js.pubkeys2MultisigAddress(keys, sigSendNumber);
    const pubkeySend = multisig.address;
    const redeemScriptSend = multisig.redeemScript;

    let data = {
        contractSendName,
        creatorSendName,
        creatorSendEmail,
        bankersMerge,
        sigSendNumber,
        coinCurrencySend,
        creatorAddressDetail,
        pubkeySend,
        redeemScriptSend
    }
    contractnew(data)
}

async function contractnew (options) {
    const getIdNumber = await idNumber()
    const mybankers = localStorage.getItem('bankers') ? JSON.parse(localStorage.getItem('bankers')) : null
    let mergeBankers = []
  
    for (let i = 0; i < options.bankersMerge.length; i++ ) {
      for (let j in mybankers) {
        if (options.bankersMerge[i] === mybankers[j].pubkey) {
          mergeBankers.push(mybankers[j])
        }
      }
    }
    

    let data = {
        "id": Math.floor(1000000000 + Math.random() * 9000000000),
        "contract_id": getIdNumber,
        "contract_name": options.contractSendName,
        "creator_name": options.creatorSendName,
        "creator_email": options.creatorSendEmail,
        "bankers": mergeBankers,
        "signature_nedded": options.sigSendNumber,
        "address": options.pubkeySend,
        "redeem_script": options.redeemScriptSend,
        "withdrawals": [],
        "balance": "0.0",
        "currency": options.coinCurrencySend,
        "claimed": "false"
    }

    try {
      const contents = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : null
      if (contents) {
      
        const contentnew = contents
        contentnew["contract" + getIdNumber] = data
        
        // Update accounts data in the localStorage
        localStorage.setItem("accounts", JSON.stringify(contentnew))
        alertSuccess("Account successfully created.")
        updateAccountListScreen(contentnew)
        showImportListScreen()
      } else {
        const addContract = {
            ["contract" + getIdNumber]: data
          }
        
        // Create accounts data in the localStorage
        localStorage.setItem("accounts", JSON.stringify(addContract))

        alertSuccess("Account successfully created.")
        updateAccountListScreen(addContract)
        showImportListScreen()
      }
    } catch (e) {
        console.log(e)
    }
  }

  function showImportListScreen() {
    importTextTab.classList.add('hidden')
    firstTab.classList.remove('hidden')
    secondTab.classList.add('hidden')
    addBankerTab.classList.add('hidden')
    thirdTab.classList.add('hidden')
    fourthTab.classList.add('hidden')
    fifthTab.classList.add('hidden')

    let tabContents = document.querySelector("#tab-contents");
    for (let i = 0; i < tabContents.children.length-1; i++) {
      tabTogglers[i].parentElement.classList.remove("bg-gradient-to-l", "from-gray-500");
    }
    let accountListTab = document.getElementById('account-list-tab')
    accountListTab.classList.add("bg-gradient-to-l", "from-gray-500");
  }

  function updateAccountListScreen(accounts) {
    const accountBody = document.getElementById('accounts-list-body')
    const mobileAccountTableHead = document.getElementById('mobile-account-list-head')
    const mobileAccountTableBody = document.getElementById('mobile-account-list-body')
    let coinInitial;

    accountBody.innerHTML = ""
    for(let x in accounts) {
        if(accounts.hasOwnProperty(x)){
            if (accounts[x].currency === 'woodcoin') {
              coinInitial = 'LOG'
            } else if (accounts[x].currency === 'bitcoin') {
              coinInitial = 'BTC'
            } else {
              coinInitial = 'LTC'
            }
            let row = accountBody.insertRow();
            let name = row.insertCell(0);
            name.setAttribute('class', 'text-center py-2')
            name.innerHTML = accounts[x].contract_name
            let address = row.insertCell(1);
            address.setAttribute('class', 'text-center')
            address.innerHTML = coinInitial + ':' + accounts[x].address
            let balance = row.insertCell(2);
            balance.setAttribute('class', 'text-center')
            balance.innerHTML = accounts[x].balance
            let veiwall = row.insertCell(3)
            veiwall.setAttribute('class', 'text-center')
            let viewAccountDetailsButton = document.createElement('button')
            viewAccountDetailsButton.setAttribute('class', "px-5 py-0.5 font-small text-white bg-orange-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-orange-500 hover:bg-orange-500 rounded-full")
            viewAccountDetailsButton.innerHTML = "view"
            veiwall.appendChild(viewAccountDetailsButton)

            let details = accounts[x]
            viewAccountDetailsButton.addEventListener("click", function() {getAccountDetails(details);}, false);


            /**
              Mobile view account list
            **/
            let bodytr1 = document.createElement('tr')
            bodytr1.setAttribute("class", "sm:table-row mb-2 sm:mb-0 text-sm font-normal")
            let headtd1 = document.createElement('td')
            headtd1.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
            headtd1.innerHTML = "Name"
            let bodytd1 = document.createElement('td')
            bodytd1.setAttribute("class", "border-grey-light border p-3")
            bodytd1.innerHTML = accounts[x].contract_name

            let bodytr2 = document.createElement('tr')
            bodytr2.setAttribute("class", "sm:table-row mb-2 sm:mb-0 text-sm font-normal")
            let headtd2 = document.createElement('td')
            headtd2.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
            headtd2.innerHTML = "Address"
            let bodytd2 = document.createElement('td')
            bodytd2.setAttribute("class", "break-all whitespace-normal border-grey-light border p-3")
            bodytd2.innerHTML = coinInitial + ':' + accounts[x].address

          
            let bodytr3 = document.createElement('tr')
            bodytr3.setAttribute("class", "sm:table-row mb-2 sm:mb-0 text-sm font-normal")
            let headtd3 = document.createElement('td')
            headtd3.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
            headtd3.innerHTML = "Balance"
            let bodytd3 = document.createElement('td')
            bodytd3.setAttribute("class", "border-grey-light border p-3")
            bodytd3.innerHTML = accounts[x].balance

            let bodytr4 = document.createElement('tr')
            bodytr4.setAttribute("class", "sm:table-row mb-2 sm:mb-0 text-sm font-normal")
            let headtd4 = document.createElement('td')
            headtd4.setAttribute("class", "border-grey-light border p-3 bg-white text-black")
            headtd4.innerHTML = "Actions"
            let bodytd4 = document.createElement('td')
            bodytd4.setAttribute("class", "border-grey-light border p-3 text-center bg-orange-600")
            bodytd4.innerHTML = "View"
            let mobileDetails = accounts[x]
            bodytd4.addEventListener("click", function() {getAccountDetails(mobileDetails);}, false);

            let bodytr5 = document.createElement('tr')
            bodytr5.setAttribute("height", "12px")

            bodytr1.appendChild(headtd1)
            bodytr1.appendChild(bodytd1)
            bodytr2.appendChild(headtd2)
            bodytr2.appendChild(bodytd2)
            bodytr3.appendChild(headtd3)
            bodytr3.appendChild(bodytd3)
            bodytr4.appendChild(headtd4)
            bodytr4.appendChild(bodytd4)
            bodytr4.appendChild(headtd4)
            bodytr4.appendChild(bodytd4)
            
            mobileAccountTableBody.appendChild(bodytr1)
            mobileAccountTableBody.appendChild(bodytr2)
            mobileAccountTableBody.appendChild(bodytr3)
            mobileAccountTableBody.appendChild(bodytr4)
            mobileAccountTableBody.appendChild(bodytr5)
        }
    }

  }

  function addDonationAddress() {
    const addressInput = document.getElementById('withdraw-address')
    if (addressInput.value) {
      addOrDelete('donation-address')
    } else {
      addressInput.value = DONATION_ADDRESS
    }
  }

  function addOrDelete(id) {
      const mainKey = document.getElementById('address-amount')

      let div = document.createElement('div');
      div.setAttribute("class", "grid md:grid-cols-4 gap-2");
      div.setAttribute('id', 'address-keys')

      let input1 = document.createElement('input')
      input1.setAttribute('class', 'text-base text-black font-normal h-10 col-span-2 mt-2')
      input1.setAttribute('placeholder', 'Enter Address')
      let input2 = document.createElement('input')
      input2.setAttribute('class', 'text-base text-black font-normal h-10 col-span-1 mt-2 user-input-amount')
      input2.setAttribute('placeholder', 'Enter Amount')

      /**
        Add event listener to the amount input
      **/
      input2.addEventListener('input', () => {amountOnInput(input2.value)})
      input2.addEventListener('change', () => {amountOnchange(input2.value)})

      if (id == "donation-address") {
          input1.value = DONATION_ADDRESS
      }

      let anchor = document.createElement('a')
      anchor.setAttribute('class', 'red pubkeyRemove cursor-pointer')
      
      let minusContainer = document.createElement("div")
      minusContainer.setAttribute("class", "flex justify-center")
      let minus = document.createElement('img')
      minus.setAttribute('src', './assets/imgs/minus.svg')
      minus.setAttribute('width', '50')
      minus.setAttribute('height', '50')
      minus.setAttribute('class', 'red pubkeyRemove')
      minusContainer.appendChild(minus)



      div.appendChild(input1)
      div.appendChild(input2)
      div.appendChild(minusContainer)
      mainKey.appendChild(div)

      minus.addEventListener('click', (e) => {
        deleteInput(e)
        if (input2.value) amountOnchangeSubtract(input2.value)
      })
  }

  function deleteInput(e) {
      const removeEl = e.target.parentNode;
      const remove = e.target.classList.contains('pubkeyRemove')
      if (!remove) return;

      document.getElementById('address-amount').removeChild(removeEl);
  }

  function amountOnInput(amount) {
    if (!isNaN(amount)) {
      const getuserinput = document.querySelectorAll('#address-keys')
      let totalOutput = 0

      for (let i = 0; i < getuserinput.length; i++) {
        let amount = getuserinput[i].children[1].value
        totalOutput += Number(amount)
      }
      TOTAL_AMOUNT_TO_WITHDRAW = totalOutput
      withdrawalFee.value = (unspentAmountTotal - TOTAL_AMOUNT_TO_WITHDRAW).toFixed(8)
    }
  }

  function amountOnchange(amount) {
    const getuserinput = document.querySelectorAll('#address-keys')
    let totalOutput = 0

    for (let i = 0; i < getuserinput.length; i++) {
      let amount = getuserinput[i].children[1].value
      totalOutput += Number(amount)
    }

    //TOTAL_AMOUNT_TO_WITHDRAW += Number(amount)
    TOTAL_AMOUNT_TO_WITHDRAW = totalOutput
    withdrawalFee.value = (unspentAmountTotal - TOTAL_AMOUNT_TO_WITHDRAW).toFixed(8)
  }

  function amountOnchangeSubtract(amount) {

    TOTAL_AMOUNT_TO_WITHDRAW -= Number(amount)
    withdrawalFee.value = (unspentAmountTotal - TOTAL_AMOUNT_TO_WITHDRAW).toFixed(8)
  }

  let withdrawAmountInput = document.getElementById('withdraw-amount')
  withdrawAmountInput.addEventListener('input', () => {amountOnInput(withdrawAmountInput.value)})
  withdrawAmountInput.addEventListener('change', () => {amountOnchange(withdrawAmountInput.value)})

  function checkTxFee(e) {
    e.preventDefault()
    let withdrawFeeInput = document.getElementById("withdraw-fee")
    let userInputtedFee = withdrawFeeInput.value

    let change = (unspentAmountTotal - TOTAL_AMOUNT_TO_WITHDRAW).toFixed(8)

    if (unspentAmountTotal < TOTAL_AMOUNT_TO_WITHDRAW) {
      alertError("Insufficient balance. Please adjust the withdrawal amount.")
      return
    }

    if (userInputtedFee == change) {
      if (change > 0.001) {
        let text = "Current transaction fee is high. If you want to proceed, click Ok";
        if (confirm(text) == true) {
          generateClaim(0)
        } else {
          console.log("The confirmation modal is cancelled.")
        }
      } else {
        generateClaim(0)
      }
    } else if (userInputtedFee > change) {
      alertError("Transaction fee is greater than remaining amount. Please adjust.")
    } else if (userInputtedFee < change) {
      let amountToChangeAddress = unspentAmountTotal - TOTAL_AMOUNT_TO_WITHDRAW - userInputtedFee
      generateClaim(amountToChangeAddress)
    }

  }

  async function generateClaim(changeAmount) {
    let coin_js
    if (ACCOUNT_CURRENCY === "woodcoin") {
      coin_js = coinjs
    } else if (ACCOUNT_CURRENCY === "bitcoin") {
      coin_js = bitcoinjs
    } else if (ACCOUNT_CURRENCY === "litecoin") {
      coin_js = litecoinjs
    } else {
      console.log("invalid currency")
      return
    }

    let tx = coin_js.transaction()
    const getunspent = document.querySelectorAll('#inner-unspent')
    const getuserinput = document.querySelectorAll('#address-keys')
    let userunspentindex;
    let userinputindex;
    let unspentindexsum = 0;
    let userinputsum = 0 ;
    let txRedeemTransaction;
    let accountSigFilter;
    let inputsTable = document.getElementById('banker-verify-inputs-initial')
    let outputsTable = document.getElementById('banker-verify-outputs-initial')

    inputsTable.innerHTML = ""
    outputsTable.innerHTML = ""
    for(let i = 0; i < getunspent.length; i++) {
      if(getunspent[i].children[5].defaultChecked) {
        userunspentindex = i
        unspentindexsum += Number(getunspent[i].children[3].value)
        tx.addinput(getunspent[i].children[0].value, getunspent[i].children[1].value, getunspent[i].children[2].value, null)
      }
    }
    
    for (let i = 0; i < getuserinput.length; i++) {
      let address = getuserinput[i].children[0].value
      let amount = getuserinput[i].children[1].value

      userinputindex = i
      userinputsum += Number(amount)

      let isValidAddress = coinjs.addressDecode(address)
      if (isValidAddress == false) {
        alertError("Address is not valid")
        return
      } else {
        tx.addoutput(address, amount)
      }
    }

    /**
      Disabled automatic addition of change address
    **/
    if (changeAmount) {
      tx.addoutput(CHANGE_ADDRESS, changeAmount)
    }
    /**End of automatically adding change address**/

    if (userunspentindex === getunspent.length -1 && userinputindex === getuserinput.length -1) {
      let accountDetails = document.getElementById('account-details')
      let accountWithdrawal = document.getElementById('account-withdrawal')
      let accountActions = document.getElementById('account-actions')
      let withdrawalReference = document.getElementById('withdraw-reference')
      accountDetails.classList.add('hidden')
      accountWithdrawal.classList.add('hidden')
      accountActions.classList.add('hidden')
      withdrawalReference.classList.remove('hidden')
      txRedeemTransaction = tx.serialize();
      const sigScript = {
        "script": getunspent[0].children[4].value
      }
      accountSigFilter = await getredeemscriptRedeemscript(sigScript)
      const deserializeTx = tx.deserialize(tx.serialize())
      
      let inputs = deserializeTx.ins
      let outputs = deserializeTx.outs

      for (let i = 0; i < inputs.length; i++) {
        var s = deserializeTx.extractScriptKey(i);
        let input = inputs[i]

        let div = document.createElement('div')
        div.setAttribute('class', 'grid grid-cols-7 gap-3 text-black')
        let inputs1 = document.createElement('input')
        inputs1.setAttribute('readonly', true)
        inputs1.setAttribute('class', 'col-span-3 txid-withdraw p-1 text-sm text-normal')
        inputs1.value = input.outpoint.hash
        
        let inputs2 = document.createElement('input')
        inputs2.setAttribute('readonly', true)
        inputs2.setAttribute('class', 'col-span-1 text-center');
        inputs2.value = input.outpoint.index
        
        let inputs3 = document.createElement('input')
        inputs3.setAttribute('readonly', true)
        inputs3.setAttribute('class', 'col-span-3 bg-gray-300 p1 text-sm text-normal');
        inputs3.value = s.script
        
        div.appendChild(inputs1)
        div.appendChild(inputs2)
        div.appendChild(inputs3)

        inputsTable.appendChild(div)
      }

      for (let i = 0; i < outputs.length; i++) {

        let output = outputs[i]
        if(output.script.chunks.length==2 && output.script.chunks[0]==106){ // OP_RETURN

          var data = Crypto.util.bytesToHex(output.script.chunks[1]);
          var dataascii = hex2ascii(data);

          if(dataascii.match(/^[\s\d\w]+$/ig)){
            data = dataascii;
          }

          let div = document.createElement('div')
          div.setAttribute('class', 'grid grid-cols-7 gap-3 text-black')
          let inputs1 = document.createElement('input')
          inputs1.setAttribute('readonly', true)
          inputs1.setAttribute('class', 'col-span-3 txid-withdraw p-1 text-sm text-normal')
          inputs1.value = data
          
          let inputs2 = document.createElement('input')
          inputs2.setAttribute('readonly', true)
          inputs2.setAttribute('class', 'col-span-1 text-sm text-center');
          inputs2.value = (output.value/100000000).toFixed(8)
          
          let inputs3 = document.createElement('input')
          inputs3.setAttribute('readonly', true)
          inputs3.setAttribute('class', 'col-span-3 bg-gray-300 p1 text-sm text-normal');
          inputs3.value = Crypto.util.bytesToHex(output.script.buffer)
          
          div.appendChild(inputs1)
          div.appendChild(inputs2)
          div.appendChild(inputs3)

          inputsTable.appendChild(div)
        } else {

          var addr = '';
          if(output.script.chunks.length==5){
            addr = coinjs.scripthash2address(Crypto.util.bytesToHex(output.script.chunks[2]));
          } else if((output.script.chunks.length==2) && output.script.chunks[0]==0){
            addr = coinjs.bech32_encode(coinjs.bech32.hrp, [coinjs.bech32.version].concat(coinjs.bech32_convert(output.script.chunks[1], 8, 5, true)));
          } else {
            var pub = coinjs.pub;
            coinjs.pub = coinjs.multisig;
            addr = coinjs.scripthash2address(Crypto.util.bytesToHex(output.script.chunks[1]));
            coinjs.pub = pub;
          }

          let div = document.createElement('div')
          div.setAttribute('class', 'grid grid-cols-7 gap-3 text-black')
          let inputs1 = document.createElement('input')
          inputs1.setAttribute('readonly', true)
          inputs1.setAttribute('class', 'col-span-3 txid-withdraw p-1 text-sm text-normal')
          inputs1.value = addr
          
          let inputs2 = document.createElement('input')
          inputs2.setAttribute('readonly', true)
          inputs2.setAttribute('class', 'col-span-1 text-sm text-center');
          inputs2.value = (output.value/100000000).toFixed(8)
          
          let inputs3 = document.createElement('input')
          inputs3.setAttribute('readonly', true)
          inputs3.setAttribute('class', 'col-span-3 bg-gray-300 p1 text-sm text-normal');
          inputs3.value = Crypto.util.bytesToHex(output.script.buffer)
          
          div.appendChild(inputs1)
          div.appendChild(inputs2)
          div.appendChild(inputs3)

          outputsTable.appendChild(div)
        }
      }

      const generateButton = document.getElementById('generate-request-signature-message')
      generateButton.addEventListener('click', function() {
        selectBankerToSign(txRedeemTransaction, accountSigFilter)
      }, false)
    }

  }

  function selectBankerToSign(tx, account, withdrawalID=null) {

    let accountDetails = document.getElementById('account-details')
    let accountWithdrawal = document.getElementById('account-withdrawal')
    let accountActions = document.getElementById('account-actions')
    let withdrawalReference = document.getElementById('withdraw-reference')
    let reqBankersSelect = document.getElementById('request-sig-banker-select')
    let messageSignature = document.getElementById('request-sig-message')
    messageSignature.innerHTML = ""
    accountDetails.classList.add('hidden')
    accountWithdrawal.classList.add('hidden')
    accountActions.classList.add('hidden')
    withdrawalReference.classList.add('hidden')
    reqBankersSelect.classList.remove('hidden')

    const accountParse = account

    let selectBankers = document.getElementById("next-banker-to-sign")
    var select =  document.getElementById("select-bankers-to-sign");
    select.innerHTML = ''
    select.dataset.placeholder = 'Choose Bankers'

    let bankersArray = accountParse[0].bankers

    const el = document.createElement("option");
    el.textContent = "Select a banker";
    el.value = "";
    select.appendChild(el);
    bankersArray.forEach((banker, i) => {
      const opt = banker.banker_email;
      const pub = banker.pubkey;
      const el = document.createElement("option");
      el.textContent = opt;
      el.value = JSON.stringify(banker);
      select.appendChild(el);
    });

    let generateBtn = document.getElementById('generate-sign-message')
    generateBtn.addEventListener('click', () => {
      let selectBanker = document.getElementById('select-bankers-to-sign')
      const banker = select.options[select.selectedIndex].value;

      if (banker) {
        let parsedBanker = JSON.parse(banker)
        requestSignatureWindow(tx, account, parsedBanker)
      } else {
        alertError("Please select a banker.")
      }
    })

  }

  async function getredeemscriptRedeemscript(options) {
    
    const accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null;
    const accountFilter = Object.values(accounts).filter(value => {
      return value.redeem_script === options.script;
    });
    
    return accountFilter
  };



function closeSendSignatureOnLeave() {
  let sendSignature = document.getElementById('send-signature')
  let signatureMessage = document.getElementById('request-sig-message')
  let accountListScreen = document.getElementById('accounts-list')

  accountListScreen.classList.remove('hidden')
  sendSignature.classList.add('hidden')
  signatureMessage.innerHTML = ""

}

function closeSendSignatureScreen() {
  let sendSignature = document.getElementById('send-signature')
  let signatureMessage = document.getElementById('request-sig-message')
  let accountListScreen = document.getElementById('accounts-list')

  accountListScreen.classList.remove('hidden')
  sendSignature.classList.add('hidden')
  signatureMessage.innerHTML = ""

  showImportListScreen()
}


  function requestSignatureWindow(tx, account, banker) {
    // Clear withdraw address and amount input
    let withdrawAddrInput = document.getElementById('withdraw-address')
    let withdrawAmtInput = document.getElementById('withdraw-amount')
    let withdrawFeeInput = document.getElementById('withdraw-fee')

    withdrawAddrInput.value = ""
    withdrawAmtInput.value = ""
    withdrawAmtInput.value = 0

    let withdrawalID = Date.now()
    let sendSignature = document.getElementById('send-signature')
    let messageSignature = document.getElementById('request-sig-message')
    let selectBankerScreen = document.getElementById('request-sig-banker-select')
    messageSignature.innerHTML = ""
    selectBankerScreen.classList.add('hidden')
    sendSignature.classList.remove('hidden')
    const accountParse = account
    const br = document.createElement('br')

    const p1 = document.createElement('p')
    p1.innerHTML = "Please copy the line below and send it to" + " " + banker.banker_email
    const p2 = document.createElement('p')
    p2.innerHTML = accountParse[0].creator_name + " is requesting for your banker signature at this " + accountParse[0].contract_name
    const p3 = document.createElement('p')
    p3.innerHTML = "Please copy the message inside and import in FSCB"
    const p4 = document.createElement('p')
    p4.innerHTML = "-----Begin fscb message-----"
    const p5 = document.createElement('p')
    p5.innerHTML = "{" + '"header":"free_state_central_bank",'
    const p6 = document.createElement('p')
    p6.innerHTML = '"message": "request-signature",'
    const p7 = document.createElement('p')
    p7.innerHTML = '"id":' + '"' + accountParse[0].id + '",'
    const p8 = document.createElement('p')
    p8.innerHTML = '"banker_id":' + banker.banker_id + ','
    const p9 = document.createElement('p')
    p9.innerHTML = '"creator_name":' + '"' + accountParse[0].creator_name + '",'
    const p10 = document.createElement('p')
    p10.innerHTML = '"creator_email":' + '"' + accountParse[0].creator_email + '",'
    const p11 = document.createElement('p')
    p11.innerHTML = '"banker_name":' + '"' + banker.banker_name + '",'
    const p12 = document.createElement('p')
    p12.innerHTML = '"banker_email":' + '"' + banker.banker_email + '",'
    const p13 = document.createElement('p')
    p13.innerHTML = '"transaction_id_for_signature":' + '"' + tx + '",'
    const p14 = document.createElement('p')
    p14.innerHTML = '"currency":' + '"' + accountParse[0].currency + '",'
    const p15 = document.createElement('p')
    p15.innerHTML = '"contract_name":' + '"' + accountParse[0].contract_name + '",'
    const p16 = document.createElement('p')
    p16.innerHTML = '"withdrawal_id":' + '"' + withdrawalID + '"}'
    const p17 = document.createElement('p')
    p17.innerHTML = "-----End fscb message-----"

    const copyToClipboardText = p2.innerHTML + '\n' + p3.innerHTML + '\n' + p4.innerHTML  + '\n' +  p5.innerHTML + '\n' + p6.innerHTML + '\n' + p7.innerHTML + '\n' + p8.innerHTML + '\n' + p9.innerHTML + '\n' + p10.innerHTML + '\n' + p11.innerHTML + '\n' + p12.innerHTML + '\n' + p13.innerHTML + '\n' + p14.innerHTML + '\n' + p15.innerHTML
    + '\n' + p16.innerHTML + '\n' + p17.innerHTML
    let copyButtonContainer = document.createElement('div')
    copyButtonContainer.setAttribute('class', 'flex justify-end')
    let copyButton = document.createElement('img')
    copyButton.setAttribute('src', './assets/imgs/copy_button.png')
    copyButton.setAttribute('class', 'px-2 cursor-pointer hover:scale-125 transition duration-500')
    copyButton.addEventListener("click", async function() {
      navigator.clipboard.writeText(copyToClipboardText);
      alertSuccess("Message successfully copied in clipboard.")
    }, false);

    copyButtonContainer.appendChild(copyButton)
    messageSignature.appendChild(copyButtonContainer)
    messageSignature.appendChild(p1)
    messageSignature.appendChild(br)
    messageSignature.appendChild(br)
    messageSignature.appendChild(p2)
    messageSignature.appendChild(p3)
    messageSignature.appendChild(p4)
    messageSignature.appendChild(p5)
    messageSignature.appendChild(p6)
    messageSignature.appendChild(p7)
    messageSignature.appendChild(p15)
    messageSignature.appendChild(p8)
    messageSignature.appendChild(p9)
    messageSignature.appendChild(p10)
    messageSignature.appendChild(p11)
    messageSignature.appendChild(p12)
    messageSignature.appendChild(p13)
    messageSignature.appendChild(p14)
    messageSignature.appendChild(p16)
    messageSignature.appendChild(p17)
    const data = {
      "banker_id": banker.banker_id,
      "banker_name": banker.banker_name,
      "date_requested": Date.now(),
      "date_signed": null,
      "status": "PENDING",
      "transaction_id": "",
      "action": "Request for signature"
    }
  
    const newWithdrawal = {
      id: withdrawalID,
      signatures: [
        data
      ]
    }
    accountParse[0].withdrawals.push(newWithdrawal)
    
    const signEncode = {
      "id": accountParse[0].contract_id,
      "contract": accountParse[0]
    }
    
    signatureEncode(signEncode)
  }

async function signatureEncode (data) {
  
  const contentnew = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null;
  contentnew["contract" + data.id] = data.contract
  localStorage.setItem("accounts", JSON.stringify(contentnew))

  const readmore = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null;
  if (readmore) {
    listfile(readmore)
  }
}

/**
  Function to export json data
**/
function exportJsonData() {
  
	const parsedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null 
	const parsedBankers = localStorage.getItem('bankers') ? JSON.parse(localStorage.getItem('bankers')) : null
	const parsedAccounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : null

  let accountJson = {
    "user": parsedUser,
    "bankers": parsedBankers,
    "accounts": parsedAccounts
  }

	let message = {
		"header": "free_state_central_bank",
		"message": "import:json-data",
		"user": parsedUser,
		"bankers": parsedBankers,
		"accounts": parsedAccounts
	}

	displayExportData(message)
}

/**
  Display data to backup in a textarea and let
  the copy and save it
**/
function displayExportData(message) {
  let backupBtnContainer = document.getElementById('backup-btn-container')
  let backupMessageContainer = document.getElementById('backup-message-container')
  let backupMessageBody = document.getElementById('backup-message')
  let closeBtn = document.getElementById('close-backup-btn')

  backupBtnContainer.classList.add('hidden')
  backupMessageContainer.classList.remove('hidden')

  const div = document.createElement('div')
  div.setAttribute('class', 'bg-white p-3 rounded-md text-black')
  const p1 = document.createElement('p')
  const p2 = document.createElement('pre')
  const p3 = document.createElement('p')

  backupMessageBody.innerHTML = ''

  p1.innerHTML = "-----Begin fscb message-----";
  p2.innerHTML = JSON.stringify(message, undefined, 2);
  p3.innerHTML = "-----End fscb message-----";

  p1.classList.add('my-1')
  p2.classList.add('whitespace-pre-wrap', 'break-all')

  const copyToClipboardText = p1.innerHTML + '\n' + p2.innerHTML + '\n' + p3.innerHTML
  let copyButtonContainer = document.createElement('div')
  copyButtonContainer.setAttribute('class', 'flex justify-end')
  let copyButton = document.createElement('img')
  copyButton.setAttribute('src', './assets/imgs/copy_button.png')
  copyButton.setAttribute('class', 'px-2 cursor-pointer hover:scale-125 transition duration-500')
  copyButton.addEventListener("click", async function() {
    navigator.clipboard.writeText(copyToClipboardText);
    alertSuccess("Message successfully copied in clipboard.")
  }, false);

  copyButtonContainer.appendChild(copyButton)
  div.appendChild(copyButtonContainer)
  div.appendChild(p1)
  div.appendChild(p2)
  div.appendChild(p3)

  backupMessageBody.appendChild(div)

  closeBtn.addEventListener("click", function() {
    backupBtnContainer.classList.remove('hidden')
    backupMessageContainer.classList.add('hidden')
    showImportListScreen()
  }, false);
}

function importData(data) {

	if (data.user) {
		const user = JSON.stringify(data.user, null, 2)
    localStorage.setItem("user", user)
	}
	if (data.bankers) {
		const bankers = JSON.stringify(data.bankers, null, 2)
    localStorage.setItem("bankers", bankers)
	}
	if (data.accounts) {
		const accounts = JSON.stringify(data.accounts, null, 2)
    localStorage.setItem("accounts", accounts)
	}

	/****/
	alertSuccess("Successfully imported FSCB data.")
  const textarea = document.getElementById('import-text');
  textarea.innerHTML = ""
}

formCreateAccount.addEventListener("submit", saveAndCreateText);
importTextForm.addEventListener('submit', parseTextArea);
userProfileForm.addEventListener('submit', createUserProfile);
withdrawalAddBtn.addEventListener('click', () => {addOrDelete('address-keys')});
formAddBanker.addEventListener('submit', addBanker);
importTextButton.addEventListener('click', openImportTextTab)
mobileImportTextButton.addEventListener('click', openImportTextTab)
formWithdraw.addEventListener('submit', checkTxFee);
donateBtn.addEventListener('click', addDonationAddress);
exportBtn.addEventListener('click', exportJsonData);
sendSignatureCloseBtn.addEventListener('click', closeSendSignatureScreen)
