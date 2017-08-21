// $0 can check 

var app = {
	indexFromEl: function(eventElement) {//button.destroy
  	var id = eventElement.closest('li').data('id'); //every todos li has an id associated with it, you would want to grab it to get the associated index for deleting/updating/modifying
    var todos = this.todos;
    var i = todos.length;
    
    while (i--) {
    	if(todos[i].id === id) {
      	return i;
      }
    } 
  },
  
  create : function() {
  
  },
  
  edit : function() {
  
  },
  
  update : function() {
  
  },
  
  delete : function() {
  
  },
  
  destroy : function(e) {
  	// you want to delete that todo element from the todos array, so use splice and get the index from indexFromEl function
    // you get the element of an event from event.target
    var todos = this.todos; //todos array
    todos.splice(this.indexFromEl(e.target), 1);
    this.render();
  }
  
  create: function(e) {
  	//in order to create a todo object, what do you need?
    // you need to grab the element of event using event.target
    //you need to get the value from that event element using val()
    ////how would you manipulate keypress obj so that only when you press enter, your todo obj will be saved
    		//you'll need to check if the e.which is ENTER_KEY or if no values is there (!val). Return nothing in that case.
    
    //you'll need to set an id for the val (todo obj)
    // you need to push that todo obj in your todos array
    
    //render
    
    var $input = $(e.target); //the element where you type the todo
    var val = $input.val().trim(); //always trim the white spaces of user input
    
    if(e.which !== ENTER_KEY || !val) {
    	return; 
    }
    
    var todos = this.todos;
    todos.push({
    	id : util.uuid(),
      title: val,
      completed : false
    })
    
    $input.val(''); //clear the input field
    this.render;
  }, 

  toggle : function(e) {
    //you would want to change the status of completed property to true/false
    //find the element's id
      //this.indexFromEl
    //change completed
    //render
    var i = this.indexFromEl(e.target);
    this.todos[i].completed = !this.todos[i].completed;
    this.render();
  },

  bindEvents: function() {
    //there are several elements and events you need to bind for this app

  },

  getActiveTodos: function() {
    return this.todos.filter(function(todo) {
      return !todo.completed;
    });
  },

  getCompletedTodos: function() {
    return this.todos.filter(function(todo) {
      return todo.completed; 
    });
  },

  getFilteredTodos: function() {
    if (this.filter === 'active') {
      return this.getActiveTodos();
    }

    if(this.filter === 'completed') {
      return this.getCompletedTodos();
    }

    return this.todos;
  },

  toggleAll : function(e) {
    //change all the todos array's element's status of completed to be true
    var isChecked = $(e.target).prop('checked');

    this.todos.each(function(todo) {
      todo.completed = isChecked;
    });
  },

  destroyCompleted: function() {

  }
  
  

}