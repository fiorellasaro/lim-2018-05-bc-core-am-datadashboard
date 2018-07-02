$(document).ready(function(){
  debugger
  $(".userInfo").click(function(){
      $("div ul").toggleClass("show");
  });
});

let  createCard = (users) => {    
  let row = document.createElement('TR');
  row.setAttribute('class', 'search');
  document.getElementById('studentTable').appendChild(row);

  let cellName = document.createElement('TD');
  cellName.setAttribute('class', 'nameStudent')
  let txtName = document.createTextNode(users.name);
  cellName.appendChild(txtName);
  row.appendChild(cellName);

/*first row*/
cell = createCardCell(users.stats.percent + '%');
row.appendChild(cell);

/*second row*/
cell = createCardCell(users.stats.exercises.percent + '%');
row.appendChild(cell);

/*third row*/
cell = createCardCell(users.stats.quizzes.percent + '%');
row.appendChild(cell);

/*fourth row*/
cell = createCardCell(users.stats.quizzes.scoreSum);
row.appendChild(cell);
 
/*fith row*/
cell = createCardCell(users.stats.reads.percent + '%');
row.appendChild(cell);

/*button*/

  let button = document.createElement('BUTTON');
  let txtButton = document.createTextNode('Ver +');
  button.appendChild(txtButton);
  row.appendChild(button);

};

const createCardCell = (value) => {
let cell = document.createElement('TD');
let txt = document.createTextNode(value);
cell.appendChild(txt);

return cell; 
};

let deleteUsers = () => {
    let listOfStudents = document.getElementsByClassName('search');
    let numberOfStudents = listOfStudents.length;
    for (i=0;numberOfStudents>i; i++){
      document.getElementById('studentTable').deleteRow(1);
    }
};


const requestURLCohorts = '../data/cohorts.json';
const cohortsRequest = new XMLHttpRequest();
const requestURLUsers = '../data/cohorts/lim-2018-03-pre-core-pw/users.json';
const usersRequest = new XMLHttpRequest();
const requestURLProgress = '../data/cohorts/lim-2018-03-pre-core-pw/progress.json';
const progressRequest = new XMLHttpRequest();

handleError = () => {
  console.log( 'Ha ocurrido un error.' );
};

getCohorts = () => {
  const cohorts = JSON.parse(cohortsRequest.responseText);
  let cohort;
  let listOptions = (id) => {
    let cohortOption = document.createElement('OPTION');
    cohortOption.setAttribute('class', 'sedeCohorts')
    let txtCohort = document.createTextNode(id);
    cohortOption.appendChild(txtCohort);
    document.getElementById('cohorts').appendChild(cohortOption);
  
    return cohortOption;
  };

  let deleteCohorts = () => {
    let listOfCohorts = document.getElementById('cohorts');
    let numberOfCohorts = listOfCohorts.length;
    for (i=0;numberOfCohorts>i; i++){
      listOfCohorts.remove(0);
    }

};
  let selectSede = () => {
    deleteCohorts();
    for (const cohort of cohorts ){
    if (document.getElementById('sede').value === 'LIM') {
        if(cohort.id.includes('lim-')){
          listOptions(cohort.id);
        }
    }
    if (document.getElementById('sede').value === 'AQP'){
      if(cohort.id.includes('aqp-')){
        listOptions(cohort.id);
      }
    } else if (document.getElementById('sede').value === 'CDMX'){
      if(cohort.id.includes('cdmx-')){
        listOptions(cohort.id);
      }
    }
    else if (document.getElementById('sede').value === 'GUADALAJARA') {
      if(cohort.id.includes('gdl-')){
        listOptions(cohort.id);
      }
    }
    else if (document.getElementById('sede').value === 'SANTIAGO'){
      if(cohort.id.includes('scl-')){
        listOptions(cohorts.id);
      }
    }
  }}; 

  for (const cohort of cohorts ){
        if(cohort.id.includes('lim-')){
          listOptions(cohort.id);
        }
    };

  document.getElementById('sede').addEventListener('change', selectSede);
  document.getElementById('cohorts').addEventListener('change', selectCohort = () => {
    let cohortSelected= document.querySelector('#cohorts').value;
      
      for (const cohor of cohorts){
        if (cohor.id == cohortSelected){
          cohort= cohor;
          getUsers(cohort);
        }
      }
    });
};

getUsers = (cohort) => {
  usersRequest.open('GET', requestURLUsers);
  usersRequest.onload =() =>{
  let users = JSON.parse(usersRequest.responseText);
  const usersCohort = users.filter(userFilter => userFilter.signupCohort === cohort.id); //filtrado usuarios por cohort
  getProgress(cohort, usersCohort);   //pasa el cohort y los usuarios del cohort
  };
  usersRequest.onerror = handleError;
  usersRequest.send();

};  

getProgress = (cohort, usersCohort) =>{
  progressRequest.open('GET', requestURLProgress);
  progressRequest.onload = () =>{
    const progress = JSON.parse(progressRequest.responseText);
    let keyProgress = Object.keys(progress);  //ckeck
    let usersProgress = {};
    let totalUsers=0;
      for (const user of usersCohort){
        for(const key of keyProgress){
           if(user.id===key){
             usersProgress[key] = progress[key]; //obteniendo nuevo arreglo de progress
           }
        }
        totalUsers++;
      }

    const options = { //este objeto es el que piden para la funcion que engloba las 3 funciones en el data.js
      cohort: cohort,
      cohortData: {
      users: usersCohort, 
      progress: usersProgress
      },
      orderBy: '', //String con criterio de ordenado (ver sortUsers).
      orderDirection: '', //String con dirección de ordenado (ver sortUsers).
      search: '' //String de búsqueda (ver filterUsers)
   };


        let users , sort, newFilter;
        document.getElementById('enter').addEventListener('click', buttonEnter = () => {
          cohortName.innerHTML = document.querySelector('#cohorts').value;
          totalA.innerHTML = totalUsers;
          document.getElementById('main').style.display = 'none'; 
          document.getElementsByClassName('data')[0].style.display = 'initial';
          options.orderBy = document.getElementById('orderBy').value;
          options.orderDirection = document.getElementById('arregement').value;
          users = processCohortData(options);

          for (const user of users){
            createCard(user);
          } 

        });
       
     
        document.getElementById('orderBy').addEventListener('change', orderByCohort = () => {
        
          options.orderBy = document.getElementById('orderBy').value;
          options.orderDirection = document.getElementById('arregement').value;
          sort= processCohortData(options);
            deleteUsers ();
          
          for (const sor of sort){
            createCard(sor);
          };
        });
        
        document.getElementById('arregement').addEventListener('change', orderCohort = () => {
          
          options.orderBy = document.getElementById('orderBy').value;
          options.orderDirection = document.getElementById('arregement').value;
          sort = processCohortData(options);
            deleteUsers ();

          for (const sor of sort){
            createCard(sor);
          };
        
        });
   

    document.getElementById('myInput').addEventListener('keyup', filterCohort = () =>{ 
      options.search = document.getElementById('myInput').value;
      newFilter = processCohortData(options);
    
      deleteUsers();
       for (const newfil of newFilter){
            createCard(newfil);
       };
       
    }); 
  
  };
  progressRequest.onerror = handleError;
  progressRequest.send(); 
};


cohortsRequest.open('GET', requestURLCohorts);
cohortsRequest.onload = getCohorts;
cohortsRequest.onerror = handleError;
cohortsRequest.send();
