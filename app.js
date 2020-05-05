var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage=-1;
    }

    Expense.prototype.calPercentage=function(totalIncome){
        if(totalIncome>0){
        this.percentage=Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage=-1;
        }
        
    };

    Expense.prototype.getPercentage=function(){
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal=function(type){
        var sum=0;

        data.allItem[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.totals[type]=sum;
        
    };

    var data = {
        allItem:
        {
            exp: [],
            inc: []

        },

        totals: {
            exp: 0,
            inc: 0
        },

        budget:0,

        percentage:-1



    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            ID = 0;
            //[1 2 3 4 5], next id = 6
            //[1 3 5 9 10], next id =10
            //id= last id+1

            //create new id
            if (data.allItem[type].length > 0) {
                ID = data.allItem[type][data.allItem[type].length - 1].id + 1;
            } else {
                ID = 0;
            }




            //create  new item base on type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }
            else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }


            //   push item to data structure and return element 
            data.allItem[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type,id){
            //id=6
            //ids=[123567]
            //index=4
            var ids, idex;

             ids=data.allItem[type].map(function(current){

                return current.id;

            });

            index=ids.indexOf(id);

            if(index !==-1){
                data.allItem[type].splice(index,1);
            }
        },

        calculateBudget:function(){
            //1.sum of income and expense
            calculateTotal('inc');
            calculateTotal('exp');
            
            //2.calcualte budeget: income-expense
            data.budget=data.totals.inc-data.totals.exp;

            //3.calculate the percentage of income we spent
           if(data.totals.inc>0){
           data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
           }else{
               data.percentage=-1;
           }

        },

        calculatePercentage:function(){
            /*
            a=20
            b=30
            c=40
            income=100
            a=20/100=20%
            */

            data.allItem.exp.forEach(function(cur){
                cur.calPercentage(data.totals.inc);
            });

        },

        getPercentage:function(){
            var allPerc=data.allItem.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        
        },

        getBudget:function(){
            return {
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            }; 
        },

        // test method 
        testing: function () {
            console.log(data);
        }
    }


})();

//module pattern retunr object containing all functions want to be public


//ui module

var UIController = (function () {

    var DOMstring = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensepercentageLabel:'.item__percentage',
        dateLabel:'.budget__title--month'

    };
    
    var formatNumber=function(num,type){
        /*
        +- before number
        exactly 2 decimal point
        comma separating the thousand

        */
       var numSplit,int,dec;

        num=Math.abs(num);
        //put 2 decimal number on num we call
        num=num.toFixed(2);

        numSplit=num.split('.');

        int=numSplit[0];

        if(int.length>3){
                int=int.substr(0,int.length-3)+','+ int.substr(int.length-3,3);
        }

        dec=numSplit[1];
        

        

        return (type==='exp'?'-':'+')+ ' '+int+'.'+dec;


    };

    var nodeListForEach=function(list,callback){
        for(var i=0; i<list.length;i++){
            callback(list[i],i);

        }

    };
    



    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstring.inputType).value,// will be either inc or expense
                description: document.querySelector(DOMstring.inputDescription).value,
                value: parseFloat( document.querySelector(DOMstring.inputValue).value)
            };


        },

        addListItem: function (obj, type) {
            //create html string with place holder text
            var html;
            
            if(type==='inc'){
             element=DOMstring.incomeContainer;
             html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
            }else if(type==='exp'){
             element=DOMstring.expenseContainer;
             html=   '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
            // replace with text  with actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            
            //insert html to  dom
            document.querySelector(element).insertAdjacentHTML('beforeEnd',newHtml);

            

        },

        deleteListItem:function(selectorID){
            var el=document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearfield:function(){
            var fields;

           fields =   document.querySelectorAll(DOMstring.inputDescription+','+DOMstring.inputValue);


           //convert return list to array with call method
           fieldsArr=Array.prototype.slice.call(fields);
            
           fieldsArr.forEach(function(current,index,array){
               current.value="";
               
           });

           fieldsArr[0].focus();  


        },

        displaybudget:function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstring.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstring.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstring.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
            
            if(obj.percentage>0){
                document.querySelector(DOMstring.percentageLabel).textContent=obj.percentage+'%';
             
            }else{
                document.querySelector(DOMstring.percentageLabel).textContent='---';
            }
            
             

        },

        displayPercentage:function(percentage){
            var fields=document.querySelectorAll(DOMstring.expensepercentageLabel);
            //return node list
            

            nodeListForEach(fields,function(current,index){
                if(percentage[index]>0){
                current.textContent=percentage[index]+'%';
                }else{
                    current.textContent='---';
                }

            });

        },

        displayMonth: function(){
           
            var now, month,year,months;
           
             now=new Date();

             months=['january','february','march','april','may','june','july','august','sepetember','october','november','december'];



           //var christmas=new Date(2020,11,25);

           year=now.getFullYear();

           month=now.getMonth();

           document.querySelector(DOMstring.dateLabel).textContent=months[month]+' '+year;

        },

        changetype:function(){
            var fields=document.querySelectorAll(DOMstring.inputType+','+DOMstring.inputDescription+','+DOMstring.inputValue);
            nodeListForEach(fields,function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstring.inputBtn)/classList.toggle('red');

        },


        getDomstring: function () {
            return DOMstring;
        }
    };






})();


//global app controller to link
//function expression can pass argument

var controller = (function (budgetCtrl, UICtrl) {



    var setupEventListeners = function () {
        var DOM = UICtrl.getDomstring();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {

            if (event.keyCode === 13 || event.which === 13) {
                console.log('enter pressed')
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDelteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changetype);

    };
    
    var updateBudget=function(){
        //1. calculate budget
        budgetCtrl.calculateBudget();

         //2. return budget
        var budget=budgetCtrl.getBudget();

        //3/display budget on ui
        UICtrl.displaybudget(budget);

        //console.log(budget);

    }

    var updatePercentage=function(){
        //1.calculate percentage
        budgetCtrl.calculatePercentage();

        

        //2.read percentge from the bc

        var percentage=budgetCtrl.getPercentage();

        //3.update ui
        UICtrl.displayPercentage(percentage);

    };


    var ctrlAddItem = function () {
 
        var input, newItem;
        // to do list

        //1. to get the field input data
        var input = UICtrl.getInput();
        
        // validation input
        if(input.description!==""&&!isNaN(input.value)&&input.value>0){
        //2. add item to budgetcontroller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        

        //3. add new item to user interface
        UICtrl.addListItem(newItem,input.type);

        //4. clear the field
        UICtrl.clearfield();

        //5. calculate budget and update budget

       updateBudget();

       updatePercentage();

        }

      
       

    };

    var ctrlDelteItem= function(event){
             
        var itemid,splitID,type,ID;
         
        itemid=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemid){
            splitID=itemid.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);
            console.log(splitID);

            //1.deltet item from the data structure

            budgetCtrl.deleteItem(type,ID);

            //2. delete item from ui
            UICtrl.deleteListItem(itemid);

            //3.update budget
            updateBudget();

            updatePercentage();

        }

    }


    return {
        init: function () {

            console.log('application has started');
            UICtrl.displayMonth();
            UICtrl.displaybudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            });
            setupEventListeners();
            
        }
    }


})(budgetController, UIController);


controller.init();