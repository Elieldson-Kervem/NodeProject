import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';



console.log('jaja');

operation();
function operation(){
    inquirer.prompt([{
        type:"list",
        name:'action',
        message:'o que voce deseja fazer',
        choices:['criar conta','consultar saldo','fazer deposito','sacar','sair']
    }]).then((answer)=>{
        const action=answer['action']
        if(action==='criar conta'){
            creatCount();
        }
        else if(action==='consultar saldo'){
              getCountBalance();
        }
        else if(action==='fazer deposito'){
            deposit();
        }
        else if(action==='sacar'){
                       withDraw();
        }
        else if(action==='sair'){
            console.log(chalk.bgGreen.black("Obrigado por utilizar o accounts"));
        }
    }).catch((err)=> console.log(err));
};

function creatCount(){
    console.log(chalk.bgGray.black('Obrigado por querer criar conta conosco'));
    console.log(chalk.gray('defina as opções da sua onta a seguir'));
    buildAccount();
};

function buildAccount(){
    inquirer.prompt([
        {
            name:'accountName',
            message:'digite o nome para a sua conta'
        }
    ]).then(answer=>{
        const accountName=answer['accountName']
        console.info(accountName);

        //crat a user

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }
        if(fs.existsSync(`accounts/ ${accountName}.json`)){
            console.log(chalk.bgRed.black('usuario já existe, tente outro nome'));
            buildAccount()
        return;
        }
        fs.writeFileSync(`accounts/${accountName}.json`,'{"balance":0}',function(err){
            console.log(err);
        })
        console.log(chalk.bgGreen.black('Parabéns sua conta foi criada'));
        operation();
        
    }).catch(err=>console.log(err))
};

function deposit(){
    inquirer.prompt([{
        name:'accountName',
        message:'qual o nome da sua conta?'
    }]).then((answer)=>{
        const accountName=answer['accountName']
        if(!checkAccount(accountName)){
            return deposit()
        }
        inquirer.prompt([{
            name:'amount',
            message:'quanto você deseja depositar?'
        }]).then((answer)=>{
            const amount=answer['amount']
            addAmount(accountName,amount);
            operation();
           

        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}

function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Essa conta não existe'));
        return false
    }
    return true;
}
function addAmount(accountName,mount){
    const accountData=getAccount(accountName)
    if(!mount){
        console.log(chalk.bgRed.dark('Ocorreu um erro, tente novamente!'))
        return deposit();
    }
    accountData.balance=parseFloat(mount)+ parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,JSON.stringify(accountData),err=>{
            console.log(err);
        }
    )
   
    setTimeout(() => {
        console.log(`Foi adicionado a sua conta o valor de $${mount}`);
    }, 3000);
    
 
}
function getAccount(accountName){
    const accountJSON=fs.readFileSync(`accounts/${accountName}.json`,{
        encoding:'utf-8',
        flag:'r'
    })
      return JSON.parse(accountJSON)
}
function getCountBalance(){
    inquirer.prompt([{
        name:'accountName',
        message:"qual o nome da sua conta?"
        
    }]).then((answer)=>{
        const accountName=answer['accountName']
        if(!checkAccount(accountName)){
            return getCountBalance()
        }
        const accountData=getAccount(accountName)
        console.log(`ola seu saldo é de ${accountData.balance}`);
        operation();
    }).catch(err=>console.log(err))
}


function withDraw(){
    inquirer.prompt([{
        name:'accountName',
        message:'qual o nomeda sua conta?'
    }]).then((answer)=>{

        const accountName=answer['accountName']

        if(!checkAccount(accountName)){
          return  withDraw()
        }

          inquirer.prompt([{
              name:'mount',
              message:'quanto voce deseja sacar?'
          }]).then((answer)=>{
              const mount=answer['mount']
              removeAmount(accountName,mount)

          }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}
function removeAmount(accountName,mount){
    const accountData=getAccount(accountName);
    if(!mount){
        console.log(chalk.bgRed.black(`ocorreu um erro tente novamente`))
        return withDraw()
    }
    if(accountData.balance<mount){
        console.log(chalk.bgRed.black(`Saldo insuficiente, tente outro valor`))
        return withDraw();
    }
    accountData.balance= parseFloat(accountData.balance) - parseFloat(mount);

    fs.writeFileSync(
        `accounts/${accountName}.json`,JSON.stringify(accountData),err=>console.log(err)
    )
    console.log(`foi realizado um saque de $${mount} na sua conta com sucesso`);
    operation();

}