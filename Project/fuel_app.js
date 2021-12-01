import {vehicles, brandData} from "./carData.js"


// class contains user's information about car, mileage and fuel price details.
class UserInfo {
  constructor(vehicleBrand, vehicleModel, vehicleYear){
    this.vehicleBrand = vehicleBrand
    this.vehicleModel = vehicleModel
    this.vehicleYear = vehicleYear
    this.fuel_efficiency = null
    this.mileage = null
    this.startMileage = null
    this.endMileage = null
    this.fuelPrice = null
    this.cost = null
  }
}


// function populates car brand menu selection.
document.getElementById('carBrand').addEventListener('click', function(event){
  deleteResults('selectBrand')  // removes duplicate menus
  var select = document.getElementById('selectBrand')
  for(let i=0; i<brandData.length; i++ ) {
      var menuItem = document.createElement('option')
      menuItem.textContent = brandData[i];
      menuItem.value = brandData[i][0];
      select.appendChild(menuItem)
      }
  event.preventDefault();
});


// function populates car year menu according to car brand selected
document.getElementById('carYear').addEventListener('click', function(event){
  deleteResults('selectYear')
  let select = document.getElementById('selectYear')
  let yearList = [];
  for(let i=0; i<vehicles.length; i++ ) {
      var menuItem = document.createElement('option')
      if (document.getElementById('carBrand').value == vehicles[i]['make']){
        if (yearList.includes(vehicles[i]['year']) == false){  // avoid duplicates
          yearList.push(vehicles[i]['year'])
          menuItem.textContent = vehicles[i]['year'];      
          menuItem.value = vehicles[i]['year'];    
          select.appendChild(menuItem);
        }}}
});


// function populates car model menu selection according to car brand and year selected. 
document.getElementById('carModel').addEventListener('click', function(event){
  deleteResults('selectModel')
  var select = document.getElementById('selectModel')
  for(let i=0; i<vehicles.length; i++ ) {
      var menuItem = document.createElement('option')
      if (document.getElementById('carBrand').value == vehicles[i]['make']){
        if (document.getElementById('carYear').value == vehicles[i]['year']){
          menuItem.textContent = vehicles[i]['model'];      
          menuItem.value = vehicles[i]['model'];    
          select.appendChild(menuItem);
      }}}
  event.preventDefault(); 
});


// function displays gasoline types and prices in the menu.
function displayFuelPrices(response){
  let regularFuel = document.getElementById('regular');
  let midgradeFuel = document.getElementById('midgrade');
  let premiumFuel = document.getElementById('premium');

  // access values from response in XML format.
  let regularPrice = response[0].getElementsByTagName("regular")[0].childNodes[0].nodeValue;
  let midgradePrice = response[0].getElementsByTagName("midgrade")[0].childNodes[0].nodeValue;
  let premiumPrice = response[0].getElementsByTagName("premium")[0].childNodes[0].nodeValue;
  regularFuel.value = regularPrice;
  midgradeFuel.value = midgradePrice;
  premiumFuel.value = premiumPrice;
}


// function populates gasoline type/price menu.
document.getElementById('gasolineType').addEventListener('click', function(event){
  var req = new XMLHttpRequest();
  req.open('GET', 'https://fueleconomy.gov/ws/rest/fuelprices', true);
  req.send(null);
  req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
          let response = req.responseXML.getElementsByTagName("fuelPrices");
          displayFuelPrices(response)
      } else {
          console.log("Error in network request: " + req.statusText);
        };
  });
  event.preventDefault(); 
});


// function deletes results content. 
// funtion deletes every child appended to the parent element. 
function deleteResults(toDelete){ 
  let parent = document.getElementById(toDelete)
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }}


// function calculates fuel cost and rounds it to the nearest hundredth(two decimal places).
function calculate_cost(User){
  return (( User.mileage / User.fuel_efficiency) * User.fuelPrice).toFixed(2)
}


// function displays user's chosen vechicle details.
function displayVehicleDetails(User, parent){
  let header = document.createElement("h1");
  let p1 = document.createElement("p");
  parent.appendChild(header);
  parent.appendChild(p1);
  header.textContent = User.vehicleBrand + "  " + User.vehicleModel + " - " + User.vehicleYear;
  header.classList.add("text-muted");
  p1.textContent = "Fuel efficiency: " + User.fuel_efficiency + " MPG combined city/hwy";
  p1.classList.add("text-muted");
}


// function displays user's chosen mileage details.
function displayMileage(User, parent){
  let p2 = document.createElement("p");
  parent.appendChild(p2);
  p2.textContent = "Desired mileage of " + User.mileage + " miles";
};


// function displays total fuel cost to the user. 
function displayFuelCost(User){
  let header2 = document.createElement("p");
  document.getElementById("results1").appendChild(header2);
  header2.textContent = "Total Cost = $" + User.cost;
};


// function prints the result of the calculation to the user.
function printResults(User){
  let parent =  document.getElementById("results");


  // deletes previous results.
  if (parent.childElementCount != 0){  
    deleteResults ("results");
    deleteResults ("results1");
  };
  // displays results to the user.
  displayVehicleDetails(User, parent);
  displayMileage(User, parent);
  displayFuelCost(User);
  };


// function requests distance in mileage between two locations, using teammate's service. 
function getMileage(User){
  var req = new XMLHttpRequest();
  req.open('GET', 'https://distance-for-fuel-calc.herokuapp.com/?from=' + User.startMileage + '&to=' + User.endMileage + '&unit=mile', true);
  req.send(null);
  req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
          let response = JSON.parse(req.responseText);
          User.mileage = response['distance'].toFixed(0);  // get mileage in order to calculate cost.
          User.cost = calculate_cost(User);
          printResults(User)  // once calculation is made, the results are printed to the user.
      } else {
          console.log("Error in network request: " + req.statusText);
        };
  });
}


// function gathers fuel information from user input.
function getFuelDetails(User){
  if (document.getElementById('gasolineType').disabled == false){
    User.fuelPrice = document.getElementById('gasolineType').value

  }if (document.getElementById('gasolineCustom').disabled == false){
    User.fuelPrice = document.getElementById('gasolineCustom').value
  }};


// function gathers mileage information from user input.
function getMileageDetails(User){
  // if user enters custom mileage.
  if (document.getElementById('mileage').disabled == false){
    User.mileage = document.getElementById('mileage').value;
    User.cost = calculate_cost(User);
    printResults(User) // once calculation is made, the results are printed to the user.

  // if user enters zip codes to get mileage.
  }if (document.getElementById('mileageStart').disabled == false){
    User.startMileage = document.getElementById('mileageStart').value
    User.endMileage = document.getElementById('mileageEnd').value
    getMileage(User)
  }};


  // function finds vehicle's fuel efficiency according to vehicle's brand, model and year.
  function getFuelEfficiency(User){
    for(let i=0; i<vehicles.length; i++ ) {
      if (User.vehicleBrand == vehicles[i]['make']){
        if (User.vehicleYear == vehicles[i]['year']){
          if (User.vehicleModel == vehicles[i]['model']){
            User.fuel_efficiency = vehicles[i]['comb08'];
      }}}}};


// function gathers user's input and procceeds to make fuel cost calculation. 
document.getElementById('calculate').addEventListener('click', function(event){
  let vehicleBrand = document.getElementById('carBrand').value;
  let vehicleModel = document.getElementById('carModel').value;
  let vehicleYear = document.getElementById('carYear').value;

  // User instance is created and initialized with vehicles's details.
  const User = new UserInfo(vehicleBrand, vehicleModel, vehicleYear)

  // gets remaining information to make fuel cost calculation. 
  getFuelEfficiency(User);
  getFuelDetails(User);
  getMileageDetails(User);
  event.preventDefault(); 
});


// Folowing input fields are disabled by default.
document.getElementById('mileageStart').disabled  = true
document.getElementById('mileageEnd').disabled  = true
document.getElementById('gasolineCustom').disabled  = true


// Function enables and disables mileage details fields according to user selection.
document.getElementById('mileage1').addEventListener('click', function(){
  document.getElementById('mileage').disabled = false
  document.getElementById('mileageStart').disabled  = true
  document.getElementById('mileageStart').value  = ''
  document.getElementById('mileageEnd').disabled  = true
  document.getElementById('mileageEnd').value  = ''
});


// Function enables and disables mileage details fields according to user selection.
document.getElementById('DistanceMileage').addEventListener('click', function(){
  document.getElementById('mileage').disabled = true
  document.getElementById('mileage').value = ''
  document.getElementById('mileageStart').disabled  = false
  document.getElementById('mileageEnd').disabled  = false  
});


// Function enables and disables fuel details fields according to user selection.
document.getElementById('gasType').addEventListener('click', function(){
  document.getElementById('gasolineType').disabled = false
  document.getElementById('gasolineCustom').value = ''
  document.getElementById('gasolineCustom').disabled  = true
});


// Function enables and disables fuel details fields according to user selection.
document.getElementById('gasCustom').addEventListener('click', function(){
  document.getElementById('gasolineCustom').disabled  = false
  document.getElementById('gasolineType').disabled = true
  document.getElementById('gasolineType').value = ''
});


