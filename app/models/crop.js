'use strict';

class Crop {
  constructor(type){
    this.type = type;
    switch(type){
      case 'corn':
        this.cost = 1;
        this.cashValue = 1;
        this.foodValue = 5;
        this.growthRate = 10;
        this.isMature = false;
        break;
      case 'tobacco':
        this.cost = 3;
        this.cashValue = 7;
        this.foodValue = 0;
        this.growthRate = 10;
        this.isMature = false;
        break;
    }
  }
}

module.exports = Crop;
