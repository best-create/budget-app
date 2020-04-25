var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }



    var data = {
        allItem:
        {
            exp: [],
            inc: []

        },

        totals: {
            exp: 0,
            inc: 0
        }



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
        expenseContainer:'.expenses__list'
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
             html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
            }else if(type==='exp'){
             element=DOMstring.expenseContainer;
             html=   '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
            // replace with text  with actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',obj.value);
            
            //insert html to  dom
            document.querySelector(element).insertAdjacentHTML('beforeEnd',newHtml);

            

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

    };
    
    var updateBudget=function(){
        //1. calculate budget

        //2. return budget

        //3/display budget on ui

    }


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

        }

      
       

    };


    return {
        init: function () {
            console.log('application has started');
            setupEventListeners();
        }
    }


})(budgetController, UIController);


controller.init();