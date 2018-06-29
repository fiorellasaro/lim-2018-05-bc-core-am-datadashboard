function createCard(users) {    
  let row = document.createElement('TR');
  row.setAttribute('class', 'search');
  document.getElementById('studentTable').appendChild(row);

  let cellName = document.createElement('TD');
  cellName.setAttribute('class', 'nameStudent')
  let txtName = document.createTextNode(users.name);
  cellName.appendChild(txtName);
  row.appendChild(cellName);

/*first row*/
cell = createCardCell(users.stats.percent);
row.appendChild(cell);

/*second row*/
cell = createCardCell(users.stats.exercises.completed);
row.appendChild(cell);

/*third row*/
cell = createCardCell(users.stats.quizzes.completed);
row.appendChild(cell);

/*fourth row*/
cell = createCardCell(users.stats.quizzes.scoreSum);
row.appendChild(cell);
 
/*fith row*/
cell = createCardCell(users.stats.reads.completed);
row.appendChild(cell);

/*button*/

  let button = document.createElement('BUTTON');
  let txtButton = document.createTextNode('Ver +');
  button.appendChild(txtButton);
  row.appendChild(button);

}

const createCardCell = (value) => {
let cell = document.createElement('TD');
let txt = document.createTextNode(value);
cell.appendChild(txt);

return cell; 
}
  
handleError = (xhr,status,error) => {
    console.log( 'Ha ocurrido un error.' );
};

$.ajax({
  type: "GET",
  url:'../data/cohorts.json',
  success: function passingCohort (data){
    let cohorts = data;
    let cohort;

    let listOptions = (id) => {
      let cohortOption = document.createElement('OPTION');
      cohortOption.setAttribute('class', 'sedeCohorts')
      let txtCohort = document.createTextNode(id);
      cohortOption.appendChild(txtCohort);
      document.getElementById('cohorts').appendChild(cohortOption);
    
      return cohortOption;
    };
    let selectSede = () => {
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
  },
  error: handleError
});

function getUsers(cohort)  {
      $.ajax({
        type: "GET",
        url:'../data/cohorts/lim-2018-03-pre-core-pw/users.json',
        success: function passingUsers (data){
          let users = data;
          const usersCohort = users.filter(userFilter => userFilter.signupCohort === cohort.id); //filtrado usuarios por cohort
          getProcess(cohort, usersCohort);
        }, 
        error: handleError
      });
          
};

function getProcess (cohort, usersCohort) {
    
    $.ajax({
      type: "GET",
      url:'../data/cohorts/lim-2018-03-pre-core-pw/progress.json',
      success: function(data){debugger
        let progress = data; // check
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
        console.log(options.cohortData.users);
        let users, sort;
        document.getElementById('enter').addEventListener('click', buttonEnter = () => {
        cohortName.innerHTML = document.querySelector('#cohorts').value;
        totalA.innerHTML = totalUsers;
        document.getElementById('main').style.display = 'none'; 
        document.getElementsByClassName('data')[0].style.display = 'initial';
        users = processCohortData(options);
        options.cohortData.users = users;
        for (const user of users){
          createCard(user);
        }
      });
        document.getElementById('myInput').addEventListener('keyup', filterCohort = () =>{ 
          options.search = document.getElementById('myInput').value.toUpperCase();
          processCohortData(options);
        });
        document.getElementById('orderBy').addEventListener('change', orderByCohort = () => {
          debugger
          options.orderBy = document.getElementById('orderBy').value;
          options.orderDirection = document.getElementById('arregement').value;
          sort = processCohortData(options);
          sort = sortUsers(users, options.orderBy, options.orderDirection);
          console.log(sort);
        })
        
        document.getElementById('arregement').addEventListener('change', orderCohort = () => {
          debugger
          options.orderBy = document.getElementById('orderBy').value;
          options.orderDirection = document.getElementById('arregement').value;
          sort = processCohortData(options);
          sort = sortUsers(users, options.orderBy, options.orderDirection);
         console.log(sort);
        });
      },
      error: handleError
    });
};