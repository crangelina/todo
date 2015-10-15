
var TodoApp = {
	
	//stores todo items (models/data/instances of todos constructor)
	todos: [],

	//top level jquery variables
	$todoList: null,
	$addButton: null,
	$input: null
};

//sets & binds jquery elements
TodoApp.init = function() {
	//set
	this.$todoList = $('#list');
	this.$addButton = $('#addButton');
	this.$input = $('#input');

	//bind
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
//reads input value, creates new instance, pushes to array, calls renderlist()
TodoApp.addTodo = function() {
	var inputValue = TodoApp.$input.val();
	var newItem = new TodoItem(inputValue);
	TodoApp.todos.push(newItem);
	TodoApp.$input.val(null);
	TodoApp.renderList();
	TodoApp.save();
}


//clears list, loops through array, builds list item, appends to list
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
	
	//strikethrough on checked

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

	//edit todo
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

	if (parsedTodos !== null) {
		TodoApp.todos = parsedTodos;
	} else {
		TodoApp.todos = [];
	}
}


TodoApp.init();






//---------------------------------------------
//			 PERSONAL NOTES
//---------------------------------------------


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
