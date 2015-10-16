
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

	//<button> - edit
	var $editButton = $("<button>");
	$editButton.attr("type", "button");
	$editButton.addClass("btn btn-link btn-xs");
	$editButton.text("Edit");

	//edit todo
	$editButton.on("click", function() {
		$listItemSpan.hide();
		$edit.show();
		$edit.focus();
		$edit.val($listItemSpan.text());
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

	//<input> - comment
	var $comment = $("<div>");
	$comment.addClass("comment");
	var $commentTextArea = $("<textarea>");
	$commentTextArea.addClass("form-control");

	//<button> - comment
	var $commentButton = $("<button>");
	$commentButton.attr("type", "button");
	$commentButton.addClass("btn btn-link btn-xs");
	$commentButton.text("Comment");

	//<button> - save
	var $saveButton = $("<button>");
	$saveButton.attr("type", "button");
	$saveButton.addClass("btn btn-info btn-xs commentButton");
	$saveButton.text("Save");

	//<button> - close
	var $closeButton = $("<button>");
	$closeButton.attr("type", "button");
	$closeButton.addClass("btn btn-danger btn-xs commentButton");
	$closeButton.text("Close");

	//close comments
	$closeButton.on ("click", function() {
		$comment.hide();
	})

	//add comment
	$commentButton.on("click", function() {
		renderCommentList();
		$comment.slideDown();
	});
		
	$saveButton.on("click", function() {
		addComment();
		$commentTextArea.val(null);
	});

	
	
	var $commentList = $("<ul>");
	$comment.append($commentList);



	function addComment() {
		var commentInput = $commentTextArea.val();
		var newComment = new Comment(commentInput);
		todoItem.comments.push(newComment);
		renderCommentList();
		TodoApp.save();
	}

	//clears list, loops through array, builds list item, appends to list
	function renderCommentList() {
		$commentList.empty();
		for (var j = 0; j < todoItem.comments.length; j++) {
			var eachItem = todoItem.comments[j].body;
			var $item = $("<li>");
			$item.addClass("commentListItem");
			$item.text(eachItem);
			$commentList.append($item);
		}
	}
	
	
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
	$deleteButton.addClass("btn btn-link btn-xs");
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
	//wrap buttons for styling purposes
	var $buttonWrapper = $("<div>");
	$buttonWrapper
		.addClass("button-wrapper")
		.append($editButton)
		.append($commentButton)
		.append($deleteButton);

	//append
	$listItem
		.append($listItemSpan)
		.append($edit)
		.prepend($checkbox)
		.append($buttonWrapper);

	$comment
		.append($commentTextArea)
		.append($saveButton)
		.append($closeButton);
	
	
	$listItem.append($comment);
	


	return $listItem;
}


function TodoItem(name) {
	this.name = name;
	this.completed = false;	
	this.comments = [];
}

function Comment(body) {
	this.from = "Angelina";
	this.body = body;
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

//comments
	//add comment button
		//when clicked inside of the li you will side down (maybe in a div) a text area and a save button
			//built into the li. hidden with display none
		//when hit save it will hide section and create comment on todo
			//still be an embedded list inside of li
		//see below for details - just not in a model yet
		//when you build the area that slides down wrap in div
		//just like todo list - build it and loop through and render

		//1 build div that has text area and button and append to li
		//2 when hit add comment it slides it down
		//3 when type in text area and hit button it creates new instance of comment consturctor
			//push to comments array for that todo item
			//console log to see if it works
		//contact jono for further instructions

	// create add comment button next to edit button
	// inside of that pop open a model (bootstrap)
	// once inside of the popup it will have a text area (body) and save button
	// when you click save you are going to close the model and create a new comment instance 
	// comment instance will be pushed into the array
	//what you see now is under the li there is another ul inside of each li
	//in each li there is a ul thats appended at the bottom with a list of all the comments
	//when you loop through and build each li you are now appending a ul as well.

	//very last thing -- accordian the comments so they aren't always visible

	//play with bootstrap model first
		//can either do no javascript and just attr on html element
		//or progromatically 
		//shared model
		//when click you show - already there but display none
			//find a way to pass an item to the model

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
