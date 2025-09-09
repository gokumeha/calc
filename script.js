
const historyDisplay = document.getElementById('history-display')
const currentDisplay = document.getElementById('current-display')
const buttons = document.querySelectorAll('.calculator-button')

let firstOperand=null;
let currentOperator=null;
let shouldResetDisplay= false;



function calculate(){
    const prev =parseFloat(firstOperand);
    const current = parseFloat(currentDisplay.textContent);

    if (isNaN(prev) || isNaN(current)) return;

    let result;
    switch (currentOperator){
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev- current;
            break;
        case '*':
            result= prev * current;
            break;
        case '/':
            if (current === 0) {
                currentDisplay.textContent = 'Error';
                historyDisplay.textContent = '';
                return;
            } 
                result = prev / current;
                break;
        default:
            return;
    }
    currentDisplay.textContent = result.toString();
    historyDisplay.textContent = `${prev} ${currentOperator} ${current} =`;
    

    firstOperand=result.toString();
    currentOperator = null;
    shouldResetDisplay = true;
    
}
buttons.forEach(button =>{
    button.addEventListener('click',(event)=> {
        const button = event.target;
        const number = button.dataset.number;
        const action = button.dataset.action;
        const operator=button.dataset.operator;

        if (number){
            if (currentDisplay.textContent ==='0' || shouldResetDisplay){
                currentDisplay.textContent=number;
                shouldResetDisplay=false;
            }else{
                currentDisplay.textContent += number;
            }
        }else if (action === 'decimal'){
            if (shouldResetDisplay){
                currentDisplay.textContent = '0.';
                shouldResetDisplay = false;
            }
        }else if ( action ==='operator'){
            if (firstOperand===null){
                firstOperand=currentDisplay.textContent;
            }else if (currentOperator){
                calculate();
                firstOperand=currentDisplay.textContent;
            }

            currentOperator=operator;
            historyDisplay.textContent = `${firstOperand} ${currentOperator} `;
            shouldResetDisplay= true;
            

        }else if (action ==='equals'){
            if (firstOperand !==null && currentOperator !==null){
                calculate();

            }
        }else if (action==='backspace')
        {
            if (currentDisplay.textContent.length >1){
                currentDisplay.textContent=currentDisplay.textContent.slice(0,-1);
            }else{
                currentDisplay.textContent='0';
            }
        }else if (action ==='clear')
        {
            firstOperand=null;
            currentOperator=null;
            shouldResetDisplay=false;
            currentDisplay.textContent='0';
            historyDisplay.textContent='';
        }
    })
});