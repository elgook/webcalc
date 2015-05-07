/**
webcalc

Copyright (c) 2015 elgook

This software is released under the MIT License.

http://elgook.mit-license.org/

*/

"use strict";

var myCalculator = angular.module('webcalc', [])

.controller('webcalcController', function() {

  var MAXIMUM_NUMBER_OF_DIGIT = 15;
  var MAXIMUM_NUMBER_OF_CALCULATION = Math.pow(10, MAXIMUM_NUMBER_OF_DIGIT) - 1;

  this.displayValue = 0; // the value which is bound to the output display

  this.operandA = null;
  this.operandB = null;
  this.operation = null;

  var isPreviousPushEquals = false;
  var theValBeingEntered = []; // the value which is being input

  //
  // event handler for digit button
  //
  this.digitPush = function(value) {

    if (theValBeingEntered.length < MAXIMUM_NUMBER_OF_DIGIT) {

      // if previous push is equal"=", initialize the calculator.
      if (isPreviousPushEquals) {
        this.clear();
        isPreviousPushEquals = false;
      }

      //
      // insert the input value including negative value input support
      //
      if (this.operandA === null && this.operandB == null && this.operation == "-") theValBeingEntered.push(this.operation);

      // insert the digit
      theValBeingEntered.push(value);
    }

    // get the display value
    this.displayValue = this.operandB = convertArrayToNumber(theValBeingEntered);

  }

  //
  // calculator core function
  //
  this.calculate = function(operation) {

    //
    // if there is the value in the operandB, move it to the operandA.
    //
    if (this.operandA === null && this.operandB != null) {

      this.operandA = this.operandB;
      this.operandB = null;
      theValBeingEntered = [];

    } else if (this.operandA != null && this.operandB != null) {

      //
      // if there is a operation that has been pending, do calculation first.
      //
      if (this.operation != null && !isPreviousPushEquals) {
        try {
          this.displayValue = doArithmeticOperatation(this.operandA, this.operandB, this.operation);
          this.operandA = this.displayValue;
          this.operandB = null;
          theValBeingEntered = [];
        } catch (e) {
          alert(e.message);
          this.clear();
        }
      }
    }
    this.operation = operation;
    isPreviousPushEquals = false;
  }

  this.equals = function() {

    if (this.operandA != null && this.operandB != null && this.operation != null) {

      try {

        this.displayValue = doArithmeticOperatation(this.operandA, this.operandB, this.operation);
        this.operandA = this.displayValue;

        // for continuous "=" pushing
        this.operandB = convertArrayToNumber(theValBeingEntered);

        isPreviousPushEquals = true;

      } catch (e) {
        alert(e.message);
        this.clear();
      }
    }
  }

  this.clear = function() {
    this.operandA = null;
    this.operandB = null;
    this.operation = null;
    this.displayValue = 0;
    theValBeingEntered = []; // the value which is bound to the output display
    isPreviousPushEquals = false;
  }

  var convertArrayToNumber = function(array) {
    var tmp = "";
    for (var i = 0; i < array.length; i++) {
      tmp += array[i].toString();
    }
    return parseInt(tmp, 10);
  }

  var doArithmeticOperatation = function(operandA, operandB, operation) {
    var result = 0;
    switch (operation) {
      case "+":
        result = operandA + operandB;
        break;
      case "-":
        result = operandA - operandB;
        break;
      case "*":
        result = operandA * operandB;
        break;
      case "/":
        result = floorTowardsZero(operandA / operandB);
        break;
    }

    //
    // if the result of arithmetic operation exceeds
    // the maxinum mnumber, throw error.
    //
    if (Math.abs(result) > MAXIMUM_NUMBER_OF_CALCULATION) {
      var err = new Error();
      err.message = "Arithmetic Overflow";
      throw err;
    }

    return result;
  }

  //
  // rounding
  //
  var floorTowardsZero = function(n) {
    return (0 < n) ? Math.floor(n) : Math.ceil(n);
  }

});
