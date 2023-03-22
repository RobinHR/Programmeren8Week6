import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "data/airline-customer-satisfaction/customersatisfaction.csv"
const trainingLabel = "satisfaction"
const ignored = []

//globale variablen
let actualSatisfied = 0;
let actualNeutralorDissatisfied = 0;
let predictedSatisfied = 0;
let predictedNeutralorDissatisfied = 0;


//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })

    console.log(loadData);
}


//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)


    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ["","id"],
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })

    // model opslaan als JSON, vervolgens kopieren vanuit console.log
    let json = decisionTree.toJSON()
    let jsonString = JSON.stringify(json)
    console.log(jsonString)

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())


    // todo : maak een prediction met een sample uit de testdata
    let customer = testData[0]
    let customerPrediction = decisionTree.predict(customer)
    console.log(`Aantal tevreden klanten : ${customerPrediction}`)

    // todo : bereken de accuracy met behulp van alle test data

    function accuracy(data, tree, label) {
        let correct = 0;
        for (let row of data) {
            if (row.satisfaction === tree.predict(row)) {
                correct++;
            }
        }
        console.log(`Accuracy: ${label}: ${correct / data.length}`)

    }

    accuracy(trainData, decisionTree, "Train Data");
    accuracy(testData, decisionTree, "Test Data");

    // Confusion Matrix
    for(const row of data){
        if(row.satisfaction === "satisfied" && decisionTree.predict(row) === "satisfied") {
            actualSatisfied++
        }
        else if (row.satisfaction === "satisfied" && decisionTree.predict(row) === "neutral or dissatisfied") {
            predictedSatisfied++
        }
        else if (row.satisfaction === "neutral or dissatisfied" && decisionTree.predict(row) === "satisfied"){
            predictedNeutralorDissatisfied++
        }
        else if (row.satisfaction === "neutral or dissatisfied" && decisionTree.predict(row) === "neutral or dissatisfied"){
            actualNeutralorDissatisfied++
        }
    }

    let tableActualSatisfied = document.getElementById('actualSatisfied');
    tableActualSatisfied.innerText = actualSatisfied.toString();

    let tablePredictedNeutralorDissatisfied = document.getElementById('predictedNeutralorDissatisfied');
    tablePredictedNeutralorDissatisfied.innerText = predictedNeutralorDissatisfied.toString();

    let tablePredictedSatisfied = document.getElementById('predictedSatisfied');
    tablePredictedSatisfied.innerText = predictedSatisfied.toString();

    let tableActualNeutralorDissatisfied = document.getElementById('actualNeutralorDissatisfied');
    tableActualNeutralorDissatisfied.innerText = actualNeutralorDissatisfied.toString();

}


loadData()