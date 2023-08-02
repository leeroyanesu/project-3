import * as fs from 'fs';

function calculatePercentileValue(percentile: number, len: number, sortedScores: number[]): number {
    const index = (percentile / 100) * (len - 1);
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);

    if (lowerIndex === upperIndex) {
        return sortedScores[lowerIndex];
    }

    const lowerValue = sortedScores[lowerIndex];
    const upperValue = sortedScores[upperIndex];
    const interpolationFactor = index - lowerIndex;

    return lowerValue + (upperValue - lowerValue) * interpolationFactor;
}

function Data(data: { teamName: string, score: number }[]) {
    const scores = data.map(obj => obj.score);
    const sortedScores = scores.sort((a, b) => a - b);
    const len = sortedScores.length;

    const percentile10 = calculatePercentileValue(10, len, sortedScores);
    const percentile50 = calculatePercentileValue(50, len, sortedScores);
    const percentile90 = calculatePercentileValue(90, len, sortedScores);

    var result: {teamName:string,score:number}[] = [];
    data.map((item)=>{
        if(item.score == percentile10 || item.score == percentile50 || item.score == percentile90){
            result.push(item)
        }
    });
    fs.writeFile("result.json",JSON.stringify(result),"utf8",()=>{})
    
}

try {
    const data = fs.readFileSync('score.json', 'utf-8');
    const json = JSON.parse(data);
    Data(json);
} catch (err) {
    console.error(err)
}