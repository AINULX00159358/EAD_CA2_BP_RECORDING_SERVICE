var express = require("express");
var app = express();

const config = require('./config/config.json');

module.exports = {

    calculateCategory: function (diastolic, systolic) {
      if (diastolic < 60 && systolic < 90) {
       return "Low";
      }
      if ((diastolic >= 60 && diastolic < 80) && systolic < 90) {
       return "Normal";
      }
      if (diastolic < 80 && (systolic >= 90 && systolic < 120)) {
       return "Normal";
      }
      if ((diastolic >= 80 && diastolic < 90) && systolic < 120) {
       return "PreHigh";
      }
      if (diastolic < 90 && (systolic >= 120 && systolic < 140)) {
       return "PreHigh";
      }
      if ((diastolic >= 90 && diastolic < 100) && systolic < 140) {
       return "High";
      }
      return "Unknown";
    }

    checkSystolic: function (systolic){
        if (systolic < config.ranges.SYSTOLIC_MIN){
            throw new Error("Invalid Systolic Value - too low")
        }
        if (systolic > config.ranges.SYSTOLIC_MAX){
            throw new Error("Invalid Systolic Value - too high")
        }
        return systolic;
    }

    checkDiastolic: function (diastolic){
        if (diastolic < config.ranges.DIASTOLIC_MIN){
            throw new Error("Invalid Diastolic Value - too low")
        }
        if (diastolic > config.ranges.DIASTOLIC_MAX){
            throw new Error("Invalid Diastolic Value - too high")
        }
        return diastolic;
    }

    processCategory: function (systolic, diastolic) => {
        let categoryResp = {
             "systolic": systolic ,
             "diastolic": diastolic,
             "category": "",
             "error": ""
            }

        try{
               categoryResp.category = calculateCategory(checkDiastolic(diastolic), checkSystolic(systolic));
             }catch (error){
               categoryResp.category = "";
               categoryResp.error = error.toString();
            }
        return categoryResp
    }
}// end of module export