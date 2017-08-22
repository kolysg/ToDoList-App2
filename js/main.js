// $0 can check 


var util = {
    uuid: function () {
      /*jshint bitwise:false */
      //bitwise operator - way to manipulate bits in computer memory - bit manipulation (1 & 0)
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
      }

      return uuid;
    },

    pluralize : funcrion(count, word) {
      return count === 1? word : word + 's'; 
    }

  };



  var ENTER_KEY = 13;
  var ESCAPE_KEY = 17;



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

  bindEvents: function() {
    //there are several elements and events you need to bind for this app
    $('#new-todo').on('keyup', this.create.bind(this));
    $('#toggle-all').on('change', this.toggleAll.bind(this));
    $('#footer').on('click', '#clearCompleted', this.destroyCompleted.bind(this));
    $('#todo-list')
      .on('change', '.toggle', this.toggle.bind(this))//changes the completed prop
      .on('click', 'destroy', this.destroy.bind(this))//which clicked, removes the item
      .on('focusout', '.destroy', this.destroy.bind(this))//when completed, the elem gets focused out and removed
      .on('dbclick', 'label', this.edit.bind(this)) //editor
      .on('keyup', '.edit', this.editKeyup.bind(this)); //unknown yet

  },

  //The most complicated part of the app is creating and updating data
  //edit, editKeyup, update
  create : function(e) {
   //if a user doesn't hit enter, no data is saved
    //using e.target, and e.which
    //enter_key is defined earlier for 13
    var $input = $(e.target);
    var val = $input.val().trim();

    if(e.which !== ENTER_KEY || !val) {
      return;
    }

    //push new todo to todos array (this.todos)
    this.todos.push( {
      id : util.uuid(),
      title: val,
      completed: false
    });

    //empty the input
    $input.val('');

    this.render();
  },
  
  edit : function(e) {
  //double clicking an li activates edit mode
    //go to the closest li and add an 'editing' class from e.target obj
    //find the input box with edit selector
    //get the value and put it to focus 
       //focus() brings the cursor to the input box
  var $input = $(e.target).closest('li').addClass('editing').find('edit');
  $input.val($input.val()).focus();
  },

  editKeyup : function(e) {
    //when you are done editing, and press enter key, the li should blur
      //blur() takes you out of the input box
      //data() - u can add any arbitrary data (key, value) on a jquery element using data method
    //if you click escape key, you are aborting your changes

    if(e.which === ENTER_KEY) {
      e.target.blur();
    }

    if(e.which === ESCAPE_KEY) {
      e.target.data('abort', true).blur();
    }
  },
  
  update : function() {
   //linked to focusout- when you loose focus
   var el = e.target; //because we need js el later.
   var $el = $(el);
   var val = $el.val().trim(); //not $val because we need it as js val later.

   if(!val) {
    this.destroy(e);
    return;
   }

   if($el.data('abort')) {
    $el.data('abort', false);
   } else {
    this.todos[this.indexFromEl(el).title] = val;
   }

   this.render();

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
    //when 'clearCompleted' filter is turned on, it removes the 
    //item from the todos array. Instead of manually deleting, you 
    //can use the methods for filters.
    this.todos = this.getActiveTodos(); //filters the array with only the things that are checked off/
    this.filter = 'all'; //set filter to all for the filtered todos array items
    this.render();
  },
  
  

}