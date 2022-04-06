let model = {
    boardSize: 7,
    // 游戏板网格的大小
    numShips: 3,
    // 游戏包含的战舰数 
    shipsSunk: 0,
    // 有多少艘战舰已被击沉
    shipLength: 3,
    // 每艘战舰占据多少单元格
    ships: [ {locations: ["0","0","0"], hits:["","",""] },
             {locations: ["0","0","0"], hits:["","",""] },
             {locations: ["0","0","0"], hits:["","",""] } ],
             // 战舰所处的位置以及被击中的部位

fire: function(guess) { 
// fire是一个处理玩家向战舰开火的方法，它判断战舰是否被击中
    for (let i = 0; i < this.numShips; i++) {
    let ship = this.ships[i];
    let index = ship.locations.indexOf(guess);
    //确定击中部位的索引，串接代码：let locations = ship.locations;
    //                         let index = locations.indexOf(guess); 
    if (index >=0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
    
    if (this.isSunk(ship)) {
        view.displayMessage("You sank my battleship!");
        this.shipsSunk++;
       }
    return true;
    }    
  }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
 },
 
 isSunk: function(ship) {//战舰击沉
     for (let i = 0; i < this.shipLength; i++) {
        if (ship.hits[i] !== "hit") {
            return false;
        }  
     }
  return true;
 },

 generateShipLocations: function() {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
        do {
            locations = this.generateShip();
        } while (this.collision(locations));
        this.ships[i].locations = locations;
    }
 },

 generateShip: function() {
     let direction = Math.floor(Math.random() * 2);
     let row,col;

     if (direction === 1) {
         row = Math.floor(Math.random() * this.boardSize);
         col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
     } else {
         row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
         col = Math.floor(Math.random() * this.boardSize);
     }

     let newShipLocations = [];
     for (let i = 0; i < this.shipLength; i++) {
         if (direction === 1) {
             newShipLocations.push(row + "" + (col + i));
         } else {
             newShipLocations.push((row + i) + "" + col);
         }
     }
     return newShipLocations;
 },

collision: function(locations) {
    for (let i = 0; i < this.shipLength; i++) {
        let ship = model.ships[i];
        for (let j = 0; j < locations.length; j++) {
            if (ship.locations.indexOf(locations[j]) >= 0) {
                return true;
            }
        }
    }
    return false;
  }

};

let view = {   
    //view更新界面，指出玩家是否击中了战舰及向用户显示消息
    displayMessage: function(msg) {
        let messageArea = document.getElementById("messageArea");
        //获取网页中的元素messageArea
        messageArea.innerHTML = msg;
        //将元素messageArea的innerHTML设置为msg，以更改该元素的文本
    },

    displayHit: function(location) { 
        //location是根据行号和列号生成的，它是一个<td>元素的id
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
        //将<td>元素的class特性设置为hit
    },

    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

let controller = {
    guesses: 0,

    processGuess: function(guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in" + this.guesses + "guesses");
            }
        }
    }
}

function parseGuess(guess){
    console.log(guess);
    let alphabet = ["A","B","C","D","E","F","G"];

    if(guess == null || guess.length !== 2) { 
        alert("Oops,please enter a letter and a number on the board.")
    } else {
        firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Oops,that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize ||
                   column < 0 || column >= model.boardSize) {
            alert("Oops,that's off the board!");
        } else {
            return row + column;
        }
    }
    return null;
}

function handleFireButton() {
    //实现事件处理程序
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
      } 
   }

window.onload = init;

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeydown = handleKeyPress;
    // 用于处理HTML输入字段的按键事件

    model.generateShipLocations();
}





/**
model.fire("53");

model.fire("06");
model.fire("16");
model.fire("26");

model.fire("34");
model.fire("24");
model.fire("44");

model.fire("12");
model.fire("11");
model.fire("10");

console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7")); 
 


controller.processGuess("A0");

controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");

controller.processGuess("C4");
controller.processGuess("D4");
controller.processGuess("E4");

controller.processGuess("B0");
controller.processGuess("B1");
controller.processGuess("B2");

以上为测试参数
**/
