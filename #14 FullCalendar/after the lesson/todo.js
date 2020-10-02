/* To-do List 14 Full Calendar Video Tutorial https://youtu.be/hyVzloriEfo */

todoMain();

function todoMain() {
  const DEFAULT_OPTION = "Choose category";

  let inputElem,
    inputElem2,
    dateInput,
    timeInput,
    addButton,
    sortButton,
    selectElem,
    todoList = [];

  getElements();
  addListeners();
  load();
  renderRows();
  updateSelectOptions();

  function getElements() {
    inputElem = document.getElementsByTagName("input")[0];
    inputElem2 = document.getElementsByTagName("input")[1];
    dateInput = document.getElementById("dateInput");
    timeInput = document.getElementById("timeInput");
    addButton = document.getElementById("addBtn");
    sortButton = document.getElementById("sortBtn");
    selectElem = document.getElementById("categoryFilter");
  }

  function addListeners() {
    addButton.addEventListener("click", addEntry, false);
    sortButton.addEventListener("click", sortEntry, false);
    selectElem.addEventListener("change", filterEntries, false);
  }

  function addEntry(event) {

    let inputValue = inputElem.value;
    inputElem.value = "";

    let inputValue2 = inputElem2.value;
    inputElem2.value = "";

    let dateValue = dateInput.value;
    dateInput.value = "";

    let timeValue = timeInput.value;
    timeInput.value = "";

    let obj = {
      id: _uuid(),
      todo: inputValue,
      category: inputValue2,
      date: dateValue,
      time: timeValue,
      done: false,
    };

    rendowRow(obj);

    todoList.push(obj);

    save();

    updateSelectOptions();



  }

  function filterEntries() {
    let selection = selectElem.value;

    // Empty the table, keeping the first row
    let trElems = document.getElementsByTagName("tr");
    for(let i = trElems.length - 1; i > 0; i--){
      trElems[i].remove();
    }

    if (selection == DEFAULT_OPTION) {
      todoList.forEach( obj => rendowRow(obj) );
    } else {
      todoList.forEach( obj => {
        if( obj.category == selection ){
          rendowRow(obj);
        }
      });
    }
  }

  function updateSelectOptions() {
    let options = [];

    todoList.forEach((obj)=>{
      options.push(obj.category);
    });

    let optionsSet = new Set(options);

    // empty the select options
    selectElem.innerHTML = "";

    let newOptionElem = document.createElement('option');
    newOptionElem.value = DEFAULT_OPTION;
    newOptionElem.innerText = DEFAULT_OPTION;
    selectElem.appendChild(newOptionElem);

    for (let option of optionsSet) {
      let newOptionElem = document.createElement('option');
      newOptionElem.value = option;
      newOptionElem.innerText = option;
      selectElem.appendChild(newOptionElem);
    }


  }

  function save() {
    let stringified = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringified);
  }

  function load() {
    let retrieved = localStorage.getItem("todoList");
    todoList = JSON.parse(retrieved);
    //console.log(typeof todoList)
    if (todoList == null)
      todoList = [];
  }

  function renderRows() {
    todoList.forEach(todoObj => {


      // let todoEntry = todoObj["todo"];
      // let key = "category";
      // let todoCategory = todoObj[key];
      rendowRow(todoObj);
    })
  }

  function rendowRow({ todo: inputValue, category: inputValue2, id, date, time, done }) {
    // add a new row

    let table = document.getElementById("todoTable");

    let trElem = document.createElement("tr");
    table.appendChild(trElem);

    // checkbox cell
    let checkboxElem = document.createElement("input");
    checkboxElem.type = "checkbox";
    checkboxElem.addEventListener("click", checkboxClickCallback, false);
    checkboxElem.dataset.id = id;
    let tdElem1 = document.createElement("td");
    tdElem1.appendChild(checkboxElem);
    trElem.appendChild(tdElem1);

    // date cell
    let dateElem = document.createElement("td");
    let dateObj = new Date(date);
    let formattedDate = dateObj.toLocaleString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    dateElem.innerText = formattedDate;
    trElem.appendChild(dateElem);

    // time cell
    let timeElem = document.createElement("td");
    timeElem.innerText = time;
    trElem.appendChild(timeElem);

    // to-do cell
    let tdElem2 = document.createElement("td");
    tdElem2.innerText = inputValue;
    trElem.appendChild(tdElem2);

    // category cell
    let tdElem3 = document.createElement("td");
    tdElem3.innerText = inputValue2;
    tdElem3.className = "categoryCell";
    trElem.appendChild(tdElem3);

    // delete cell
    let spanElem = document.createElement("span");
    spanElem.innerText = "delete";
    spanElem.className = "material-icons";
    spanElem.addEventListener("click", deleteItem, false);
    spanElem.dataset.id = id;
    let tdElem4 = document.createElement("td");
    tdElem4.appendChild(spanElem);
    trElem.appendChild(tdElem4);

    checkboxElem.type = "checkbox";
    checkboxElem.checked = done;
    if (done) {
      trElem.classList.add("strike");
    } else {
      trElem.classList.remove("strike");
    }


    function deleteItem() {
      trElem.remove();
      updateSelectOptions();

      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id)
          todoList.splice(i, 1);
      }
      save();
    }

    function checkboxClickCallback() {
      trElem.classList.toggle("strike");
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id)
          todoList[i]["done"] = this.checked;
      }
      save();
    }
  }

  function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function sortEntry() {
    todoList.sort((a, b) => {
      let aDate = Date.parse(a.date);
      let bDate = Date.parse(b.date);
      return aDate - bDate;
    });

    save();

    let trElems = document.getElementsByTagName("tr");
    for(let i = trElems.length - 1; i > 0; i--){
      trElems[i].remove();
    }

    renderRows();
  }

}
