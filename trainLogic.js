// 1. Initialize Firebase

var config = {
	apiKey: "AIzaSyAmUbYhuh0zYnuRqoYCxoMNMM1rMkYbFxA",
	authDomain: "train-scheduler-a9824.firebaseapp.com",
	databaseURL: "https://train-scheduler-a9824.firebaseio.com",
	projectId: "train-scheduler-a9824",
	storageBucket: "",
	messagingSenderId: "843018864586"
};
firebase.initializeApp(config);
var database = firebase.database();


// 2. Add a train action
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();
  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination= $("#destination-input").val().trim();
  var firstTrain = $('#first-train-input').val().trim();
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding Train data
  var newTrain = {
    trainName: trainName,
    destination: trainDestination,
    firstTrain: firstTrain,
    frequency: trainFrequency
  };
  // Insert train data to the database
  database.ref().push(newTrain);
  // Alert
  alert("Train successfully added");
  // Clear inputs
  $('input[type="text"]').val('');
});

// 3. Create Firebase event for adding Train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	var snapVal = childSnapshot.val();
	console.log(snapVal);

	// Calculate the next arrival time based on start time
	var firstArrival = moment(snapVal.firstTrain, "HH:mm");
	console.log("firstArrival: " + firstArrival);
	
	var frequency = snapVal.frequency;
	console.log("frequency: " + frequency);
	
	var timeBetween = moment().diff(moment.unix(firstArrival, "HH:mm"), "minutes");
	console.log("timeBetween: " + timeBetween);

	var minutesAway = frequency - (moment().diff(moment.unix(firstArrival, "HH:mm"), "minutes") % frequency);
	console.log("minutesAway: " + minutesAway);

	var nextTrain = parseInt((firstArrival) + ((timeBetween + minutesAway) * 60));
	console.log("nextTrain: "+ nextTrain);

	var trainDisplay = moment.unix(nextTrain).format("LT");
	console.log(trainDisplay);
	


	var trainName = snapVal.trainName;
	var destination = snapVal.destination;
	var frequency = snapVal.frequency;
	var firstTrain = moment(snapVal.firstTrain, "HH:mm");
	
	var minutesAway = frequency - (moment().diff(moment.unix(firstTrain, "HH:mm"), "minutes") % frequency);
	
	var timeBetween = moment().diff(moment.unix(firstTrain, "HH:mm"), "minutes");
	var nextTrain = parseInt((firstTrain) + ((timeBetween + minutesAway) * 60));
	var nextTrainTime = moment.unix(nextTrain).format("LT");
	console.log(trainName);
	console.log(frequency);
	console.log(firstTrain);
	console.log(minutesAway);
	



	// Add each train's data into the table
	$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td class='nextTrainFrequency'>" +
	frequency + "</td><td class='traintime'>" + nextTrainTime + "</td><td class='nextTrainMinutes'>" + minutesAway + "</td></tr>");
	
});
