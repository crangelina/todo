//goal: basic todo list that adds items & is able to toggle completed and incomplete through checkbox
//build li as sep. obj
//build input type checkbox as sep. obj
//append input to li



//where most variables/states will go
//prop on top, func underneath
var TodoApp = {
	
	//this is the array that keeps all todo items (models/data)
	//will house all the instances of the todos constructor
	//anytime new todo is made it will be stored here
	todos: [],

	//set top level jquery variables
	$todoList: null,
	$addButton: null,
	$input: null
};

//this func sets all jquery variables
TodoApp.init = function() {
	// set necessary jquery elements
	this.$todoList = $('#list');
	this.$addButton = $('#addButton');
	this.$input = $('#input');


	// bind jquery elements
	this.$addButton.on('click', this.addTodo);

	this.$input.on('keydown', function(e){
        if(e.which == 13){
            TodoApp.$addButton.click();
        }
    });

    TodoApp.load();
    TodoApp.renderList();

};

//doesn't add to html
//reads the value from the input
//creates a new  instance of a todo item
//pushes it into todo array on todo app
//calls renderlist func
TodoApp.addTodo = function() {
	var inputValue = TodoApp.$input.val();
	var newItem = new TodoItem(inputValue);
	TodoApp.todos.push(newItem);
	TodoApp.$input.val(null);
	TodoApp.renderList();
	TodoApp.save();
}


//clears $todoList
//loops through array
//builds li
//appends to $todoList
TodoApp.renderList = function() {
	TodoApp.$todoList.empty();
	for (var i = 0; i < TodoApp.todos.length; i++) {
		var todoItem = TodoApp.todos[i];
		var $listItem = TodoApp.renderListItem(todoItem);
		TodoApp.$todoList.append($listItem);
	}
}

TodoApp.renderListItem = function(todoItem) {

	//<li>
	var $listItem = $("<li>");
	var $listItemSpan = $("<span>");
	$listItemSpan.text(todoItem.name);

//---------------------------------------------

	//<input> - edit
	var $edit = $("<input>");
	$edit.attr("type", "text");
	$edit.addClass("edit");

	
//---------------------------------------------

	//<input> - checkbox
	var $checkbox = $("<input>");
	$checkbox.attr("type", "checkbox");

	//toggle checkbox
	$checkbox.on('change', function(){ 	
    	if (this.checked) {
    		todoItem.completed = true;
    	} else {
    		todoItem.completed = false;
    	}
    	TodoApp.renderList();
    	TodoApp.save();
	});
	
	//apply strikethrough to checked $listItem

    if(todoItem.completed === true) {
        $listItem.addClass("striked");
        $checkbox.attr('checked', true);
    }

//---------------------------------------------

	//<button> - delete
	var $deleteButton = $("<button>");
	$deleteButton.attr("type", "button");
	$deleteButton.addClass("btn btn-default btn-xs");
	$deleteButton.text("Delete");

	//delete $listItem
	$deleteButton.on("click", function() {
		
		var confirmation = confirm("Are you sure you would like to delete this item?");
			if (confirmation == true) {
				var indexNum = $listItem.index();
				TodoApp.todos.splice(indexNum, 1);
				TodoApp.renderList();
				TodoApp.save();
			} 

	})

//---------------------------------------------

	//<button> - edit
	var $editButton = $("<button>");
	$editButton.attr("type", "button");
	$editButton.addClass("btn btn-link btn-xs");
	$editButton.text("Edit");

	$editButton.on("click", function() {
		$listItemSpan.hide();
		$edit.show();
		$edit.on ("blur", function() {
			todoItem.name = $edit.val();
			$edit.hide();
			TodoApp.renderList();
			TodoApp.save();
		});
		$edit.on('keydown', function(e){
        	if(e.which == 13){
            	this.blur();
			}
		});
	});

//---------------------------------------------

	//append
	$listItem.append($listItemSpan);
	$listItem.append($edit);
	$listItem.prepend($checkbox);
	$listItem.append($deleteButton);
	$listItem.append($editButton);

	return $listItem;
}



function TodoItem(name) {
	this.name = name;
	this.completed = false;	
}




TodoApp.save = function() {
	var json = JSON.stringify(TodoApp.todos);
	localStorage.setItem("todos", json);
	
}

TodoApp.load = function() {
	var parsedTodos = JSON.parse( localStorage.getItem("todos") );
	TodoApp.todos = parsedTodos;
}

TodoApp.init();

//create edit button inside of <li>
	//create input inside of <li> that is display none
//when edit button clicked
	//hide text and show input
	//***wrap text in span or div so you can hide it
//on blur change back so input is hidden
	//update item name and render list
	//***don't need to "reshow" the text because of render list

//add delete button in renderListItem
	//when delete button clicked
		//show confirmation
			//if successful V
			//find index of li in ul > .index()
				//use that index to delete that item in the array
					//call renderlist() to update list
//add class when checked for strikethrough
	//use css

//1 after user hits addButton it creates new instance of TodoItem. 
	//2 pushes that new TodoItem into the todos array
	//3 renderList func loops through the array, empties existing list, and rebuilds list 
			//creates li for each todo and appends to list
