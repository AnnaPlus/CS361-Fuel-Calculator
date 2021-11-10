import {vehicles} from "./carData.js"


var data = [['Acura'], ['Alfa Romeo'], ['Aston Martin'], ['Audi'], ['Bentley'], ['BMW'], ['Bugatti'], ['Buick'], ['Cadillac'], ['Chevrolet'], ['Chrysler'], ['Dodge'], ['Ferrari'], ['Fiat'], ['Fisker'], ['Ford'], ['Genesis'], ['GMC'], ['Honda'], ['Hummer'], ['Hyundai'], ['Infiniti'], ['Jaguar'], ['Jeep'], ['Karma'], ['Kia'], ['Koenigsegg'], ['Lamborghini'], ['Land Rover'], ['Lexus'], ['Lincoln'], ['Lotus'], ['Maserati'], ['Maybach'], ['Mazda'], ['McLaren Automotive'], ['Mercedes-Benz'], ['Mercury'], ['MINI'], ['Mitsubishi'], ['Mobility Ventures LLC'], ['Nissan'], ['Pagani'], ['Polestar'], ['Pontiac'], ['Porsche'], ['Ram'], ['Rolls-Royce'], ['Roush Performance'], ['RUF Automobile'], ['Saab'], ['Saturn'], ['Scion'], ['smart'], ['Spyker'], ['SRT'], ['STI'], ['Subaru'], ['Suzuki'], ['Toyota'], ['Volkswagen'], ['Volvo'], ['VPG']]; 


document.getElementById('carBrand').addEventListener('click', function(event){
    var select = document.getElementById('selectBrand')
    for(let i=0; i<data.length; i++ ) {
        var menuItem = document.createElement('option')
        menuItem.textContent = data[i];
        menuItem.value = data[i][0];
        select.appendChild(menuItem)
        }
    event.preventDefault();
    // while(select.firstChild){
    // select.removeChild(select.firstChild);
    // }
});



// let brandDropdown = document.getElementById('carBrand');        
// for(let i=0; i<data.length; i++ ) {    
//   let menuItem = document.createElement('option');          
//   menuItem.text = data[i];      
//   menuItem.value = data[i][0];     
//   brandDropdown.appendChild(menuItem);
  
//   console.log(document.getElementById('carBrand').value)         
// }


// console.log(document.getElementById('carBrand').value)
// console.log(vehicles[0]['make'])
// console.log(vehicles.length)


document.getElementById('carYear').addEventListener('click', function(event){
  var select = document.getElementById('selectYear')
  let yearList = [];
  for(let i=0; i<vehicles.length; i++ ) {
      var menuItem = document.createElement('option')
      if (document.getElementById('carBrand').value == vehicles[i]['make']){
        if (yearList.includes(vehicles[i]['year']) == false){
          yearList.push(vehicles[i]['year'])
          menuItem.text = vehicles[i]['year'];      
          menuItem.value = vehicles[i]['year'];    
          select.appendChild(menuItem)
        }
      }
   }
  // event.preventDefault();
  // while(select.firstChild){
  //   select.removeChild(select.firstChild);
// }
});


// Original dropdown menu
// let yearDropdown = document.getElementById('carYear');
// let yearList = [];
// for(let i=0; i<vehicles.length; i++ ) {    
//     let menuItem = document.createElement('option');
//     if (document.getElementById('carBrand').value == vehicles[i]['make']){
//         if (yearList.includes(vehicles[i]['year']) == false){
//           yearList.push(vehicles[i]['year'])
//           menuItem.text = vehicles[i]['year'];      
//           menuItem.value = vehicles[i]['year'];     
//           yearDropdown.add(menuItem); 
//         }
//     }                
//   }

document.getElementById('carModel').addEventListener('click', function(event){
  var select = document.getElementById('selectModel')
  for(let i=0; i<vehicles.length; i++ ) {
      var menuItem = document.createElement('option')
      if (document.getElementById('carBrand').value == vehicles[i]['make'] && document.getElementById('carYear').value == vehicles[i]['year']){
          menuItem.text = vehicles[i]['model'];      
          menuItem.value = vehicles[i]['model'];    
          select.appendChild(menuItem)
      }
   }
  event.preventDefault(); 
});

// deletes every child appended to the parent element. 
const deleteTable = (toDelete) => { 
  let parent =  document.getElementById(toDelete)
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }
}


function calculateCost(startMileage, endMileage, fuel_efficiency, fuelPrice, vehicleBrand, vehicleModel, vehicleYear){
  var req = new XMLHttpRequest();
  req.open('GET', 'https://distance-for-fuel-calc.herokuapp.com/?from=' + startMileage + '&to=' + endMileage + '&unit=mile', true);
  req.send(null);
  req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
          let response = JSON.parse(req.responseText);
          let mileage = response['distance']

          // calculates fuel cost and rounds it to the nearest hundredth(two decimal places)
          let calculation = (( mileage / fuel_efficiency) * fuelPrice).toFixed(2)
          
          let parent =  document.getElementById("results")
          if (parent.childElementCount != 0){
            deleteTable("results");
            deleteTable("results1");
          }
          let p3 = document.createElement("p");
          let p2 = document.createElement("p");
          let p1 = document.createElement("p");
          let header = document.createElement("h1");
          parent.appendChild(header);
          parent.appendChild(p1);
          parent.appendChild(p2);
          parent.appendChild(p3);
          header.textContent = vehicleBrand + "  " + vehicleModel + " - " + vehicleYear;
          header.classList.add("text-muted");
          p1.textContent = "Fuel efficiency: " + fuel_efficiency + " MPG combined city/hwy";
          p1.classList.add("text-muted")
          p2.textContent = "Desired mileage of " + mileage + " miles";
          p3.textContent = "Price of $" + fuelPrice + " per gallon";

          let header2 = document.createElement("p");
          document.getElementById("results1").appendChild(header2);
          header2.textContent = "Total Cost = $" + calculation;
                

      } else {
          console.log("Error in network request: " + req.statusText);
        }
  });
}



// ***** Calculates and displays fuel cost resuls ****
document.getElementById('calculate').addEventListener('click', function(event){
  let fuel_efficiency;
  let mileage;
  let fuelPrice;
  let vehicleBrand = document.getElementById('carBrand').value
  let vehicleModel = document.getElementById('carModel').value
  let vehicleYear = document.getElementById('carYear').value
  for(let i=0; i<vehicles.length; i++ ) {
    if (document.getElementById('carBrand').value == vehicles[i]['make'] && document.getElementById('carYear').value == vehicles[i]['year'] && document.getElementById('carModel').value == vehicles[i]['model']){
      fuel_efficiency = vehicles[i]['comb08']
    }
  }
  console.log(vehicleBrand, vehicleModel, vehicleYear, fuel_efficiency);

  if (document.getElementById('gasolineType').disabled == false){
    console.log(document.getElementById('gasolineType').value)
    fuelPrice = document.getElementById('gasolineType').value

  }if (document.getElementById('gasolineCustom').disabled == false){
    console.log(document.getElementById('gasolineCustom').value)
    fuelPrice = document.getElementById('gasolineCustom').value

  }if (document.getElementById('mileage').disabled == false){
    console.log(document.getElementById('mileage').value)
    mileage = document.getElementById('mileage').value
      // calculates fuel cost and rounds it to the nearest hundredth(two decimal places)
    let calculation = (( mileage / fuel_efficiency) * fuelPrice).toFixed(2)
    
    let parent =  document.getElementById("results")
    if (parent.childElementCount != 0){
      deleteTable("results");
      deleteTable("results1");
    }
    let p3 = document.createElement("p");
    let p2 = document.createElement("p");
    let p1 = document.createElement("p");
    let header = document.createElement("h1");
    parent.appendChild(header);
    parent.appendChild(p1);
    parent.appendChild(p2);
    parent.appendChild(p3);
    header.textContent = vehicleBrand + "  " + vehicleModel + " - " + vehicleYear;
    header.classList.add("text-muted");
    p1.textContent = "Fuel efficiency: " + fuel_efficiency + " MPG combined city/hwy";
    p1.classList.add("text-muted")
    p2.textContent = "Desired mileage of " + mileage + " miles";
    p3.textContent = "Price of $" + fuelPrice + " per gallon";

    let header2 = document.createElement("p");
    document.getElementById("results1").appendChild(header2);
    header2.textContent = "Total Cost = $" + calculation;

  }if (document.getElementById('mileageStart').disabled == false){
    console.log(document.getElementById('mileageStart').value)
    console.log(document.getElementById('mileageEnd').value)
    let startMileage = document.getElementById('mileageStart').value
    let endMileage = document.getElementById('mileageEnd').value
    mileage = calculateCost(startMileage, endMileage, fuel_efficiency, fuelPrice, vehicleBrand, vehicleModel, vehicleYear)

  }
  

  event.preventDefault(); 
});


// Fields disabled by default
document.getElementById('mileageStart').disabled  = true
document.getElementById('mileageEnd').disabled  = true
document.getElementById('gasolineCustom').disabled  = true

// Enable and disable Mileage Details field
document.getElementById('mileage1').addEventListener('click', function(event){
  document.getElementById('mileage').disabled = false
  document.getElementById('mileageStart').disabled  = true
  document.getElementById('mileageStart').value  = ''
  document.getElementById('mileageEnd').disabled  = true
  document.getElementById('mileageEnd').value  = ''
});

document.getElementById('DistanceMileage').addEventListener('click', function(event){
  document.getElementById('mileage').disabled = true
  document.getElementById('mileage').value = ''
  document.getElementById('mileageStart').disabled  = false
  document.getElementById('mileageEnd').disabled  = false  
});

// Enable and Disbale Fuel Details field. 
document.getElementById('gasType').addEventListener('click', function(event){
  document.getElementById('gasolineType').disabled = false
  document.getElementById('gasolineCustom').value = ''
  document.getElementById('gasolineCustom').disabled  = true
});

document.getElementById('gasCustom').addEventListener('click', function(event){
  document.getElementById('gasolineCustom').disabled  = false
  document.getElementById('gasolineType').disabled = true
  document.getElementById('gasolineType').value = ''
});

// Original Dropdown menu ---
// let modelDropdown = document.getElementById('carModel');
// for(let i=0; i<vehicles.length; i++ ) {    
//     let menuItem = document.createElement('option');
//     if (document.getElementById('carBrand').value == vehicles[i]['make'] && document.getElementById('carYear').value == vehicles[i]['year']){
//           menuItem.text = vehicles[i]['model'];      
//           menuItem.value = vehicles[i]['model'];     
//           modelDropdown.add(menuItem); 
//         // }
//     }                
//   }


