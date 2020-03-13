const addForm = document.querySelector('.add');			//ref to form
const list = document.querySelector('.todos');			//ref to UL
const search = document.querySelector('.search input');
const clock = document.querySelector('.clock');

const generateTemplate = todo => {

	const html = `
		<li class="list-group-item d-flex justify-content-between align-items-center">
	        <span>${todo}</span>
	        <i class="far fa-trash-alt delete"></i>  <!-- Font awesome icon -->
	    </li>
	`;

	list.innerHTML += html;			//append the text into the UL
};

addForm.addEventListener('submit', e => {

	e.preventDefault();							//prevent reloading of page.
	todoItem = addForm.add.value.trim();            //formClass.inputName.value //trim to remove whitespace
	//console.log(todoItem);						//show submitted value
	if(todoItem.length)
	{
		//if there is text content in submit box
		generateTemplate(todoItem);
		addForm.reset();			//reset form input fields
	}
	else
	{
		alert('kindly write an activity in the text box')
	}

});

//Trash Can functionality - we cant attach the event to EVery trash can as this 
//slows down the site and gives JS alot of work to do.
//instead, we attach the event to the list item and use event delegation.
//Delete List Items code
list.addEventListener('click', e => {
//remove e is the event parameter and e.target is the actual event that occured.
	if(e.target.classList.contains('delete'))
	{
		e.target.parentElement.remove();  //bubbles up to the LI and removes it
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