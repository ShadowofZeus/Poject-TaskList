const addForm = document.querySelector('.add');			//ref to form
const list = document.querySelector('.todos');			//ref to UL
const search = document.querySelector('.search input');
const clock = document.querySelector('.clock');


//Function to populate the DOM with task items
const generateTemplate = (taskitem,id)=> {

	const html = `
		<li data-id="${id}" class="list-group-item d-flex justify-content-between align-items-center">
	        <span>${taskitem.taskname}</span>
	        <i class="far fa-trash-alt delete"></i>  <!-- Font awesome icon -->
	    </li>
	`;
		//console.log(html);      //check to see the content on console
	list.innerHTML += html;			//append the text into the UL
};

//Function to delete items from the DOM when deleted from DB

const deleteTaskItem = (id) => {
	const taskitems = document.querySelectorAll('li');
	taskitems.forEach(taskitem => {
		if(taskitem.getAttribute('data-id') === id)
		taskitem.remove();
	})
}

//********** READING FROM DB in REALTIME -- WORKING!! ***************************
//Function to dynamically populate the website

db.collection('taskitems').onSnapshot(snapshot => {
	// console.log(snapshot.docChanges());
	snapshot.docChanges().forEach((changeInDB) => {
		const doc = changeInDB.doc;
		if(changeInDB.type === 'added')
		{
			generateTemplate(doc.data(),doc.id);
		}
		else if(changeInDB.type === 'removed')
		{
			deleteTaskItem(doc.id);
		}
	})
});

// ********************END OF READING FROM DB CODE  **********************

// Starting the Adding of Data(Documents) to DB **************************
addForm.addEventListener('submit', e => {

	e.preventDefault();							//prevent reloading of page.

	const taskitem = {
		taskname: addForm.add.value.trim(),
		priority: 'low',
	}
// this is the code that actually adds the content to the DB
	db.collection('taskitems').add(taskitem).then(() => {
		console.log('Task added to the task list')
	}).catch((err) => {
		console.log(err);
	})

	addForm.reset();
});

//Trash Can functionality - we cant attach the event to EVery trash can as this 
//slows down the site and gives JS alot of work to do.
//instead, we attach the event to the list item and use event delegation.
//Delete List Items code
list.addEventListener('click', e => {
//remove e is the event parameter and e.target is the actual event that occured.
	if(e.target.classList.contains('delete'))
	{
		const id = e.target.parentElement.getAttribute('data-id');
		//console.log(id);			//ids being shown
		// e.target.parentElement.remove();  //bubbles up to the LI and removes it

		//** Code to actually remove the entry from the DB
		db.collection('taskitems').doc(id).delete().then(() => {
			console.log('recipe deleted')
		});
	}
});

const filterTodos = (term) => {    //CB function to output term being searched.
	Array.from(list.children)
		.filter((todo) =>  !todo.textContent.toLowerCase().includes(term))
		.forEach((todo) => todo.classList.add('filtered'));

	Array.from(list.children)
		.filter((todo) =>  !todo.textContent.toLowerCase().includes(term))
		.forEach((todo) => todo.classList.remove('filtered'));
};

//keyup event 
search.addEventListener('keyup', () => {
	const term = search.value.trim().toLowerCase();
	filterTodos(term);
});


// Code for the Realtime CLOCK
const tick = () => {

	
	const now = new Date();
	
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();
  
	const html = `
	  <span>${hours}</span> :
	  <span>${minutes}</span> :
	  <span>${seconds}</span>
	`;
  
	clock.innerHTML = html;
  
  };

  setInterval(tick,1000);   //tick is a callback function

  // Realtime CLock code ends here