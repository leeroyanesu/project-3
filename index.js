"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function calculatePercentileValue(percentile, len, sortedScores) {
    var index = (percentile / 100) * (len - 1);
    var lowerIndex = Math.floor(index);
    var upperIndex = Math.ceil(index);
    if (lowerIndex === upperIndex) {
        return sortedScores[lowerIndex];
    }
    var lowerValue = sortedScores[lowerIndex];
    var upperValue = sortedScores[upperIndex];
    var interpolationFactor = index - lowerIndex;
    return lowerValue + (upperValue - lowerValue) * interpolationFactor;
}
function Data(data) {
    var scores = data.map(function (obj) { return obj.score; });
    var sortedScores = scores.sort(function (a, b) { return a - b; });
    var len = sortedScores.length;
    var percentile10 = calculatePercentileValue(10, len, sortedScores);
    var percentile50 = calculatePercentileValue(50, len, sortedScores);
    var percentile90 = calculatePercentileValue(90, len, sortedScores);
    var result = [];
    data.map(function (item) {
        if (item.score == percentile10 || item.score == percentile50 || item.score == percentile90) {
            result.push(item);
        }
    });
    fs.writeFile("result.json", JSON.stringify(result), "utf8", function () { });
}
try {
    var data = fs.readFileSync('score.json', 'utf-8');
    var json = JSON.parse(data);
    Data(json);
}
catch (err) {
    console.error(err);
}
