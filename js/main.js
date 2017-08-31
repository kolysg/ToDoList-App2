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

    pluralize : function(count, word) {
      return count === 1? word : word + 's'; 
    },

    store: function(namespace, data) {
      if (arguments > 1) {
        return localStorage.setItem(namespace, JSON.stringify(data)); //(name, value)

      } else {
        var store = localStorage.getItem(namespace);
        return store && JSON.parse(store) || [];
      }
    }

  };



var ENTER_KEY = 13;
var ESCAPE_KEY = 17;

var App = { 
  //setup the data for the application, compile the template for main body & footer
  init: function() {
    this.todos = util.store('todos-jquery'); //get the data if there is already in the local storage.
    this.todoTemplate = Handlebars.compile($('#todo-template').html());
    this.footerTemplate = Handlebars.complie($('#footer-template').html());
    this.bindEvents();
    
    //Router uses director.js library.
    //assigns the appropriate filter, changes url and renders it. You have to bind 'this'. 
    //init creates a default case, if your filter is not assigned.

    new Router({
      '/:filter' : function(filter) {
        this.filter = filter;
        this.render();
      }.bind(this);
    }).init('/all');
  },


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

  render : function() {
    //elements: inputbox - new-todo- put back to focus once manipulation is done for the todo-list
              //section with id main
              //toggle
              //toggle-all- focus
              //being called when updating, creating, deleting
    //sets the filtered todolist in an object
    //puts todos objects inside todolist element
      // the html being a template
    var todos = this.getFilteredTodos(); //returns todo list with filters
    ('#todolist').html(this.todoTemplate(todos));
    ('#main').toggle(todos.length > 0); //hides/shows todos item
    ('#toggleAll').prop('checked', this.getActiveTodos().length === 0); //the status of the toggle-all button, greys out if theres an active todo item. otherwise it turns on.
    this.renderFooter();
    $("#new-todo").focus(); //puts back the cursor to the new-todo input box
    util.store('todos-jquery', this.todos);//storing of data in the local storage 
  },

  renderFooter : function() {
    //there are four elements
    //how many items left - need a active todo count 
    //filters- All, Active, Completed
    //if there is a completed item, 'clear completed' button shows up
    var todoCount = this.todos.length;
    var activeTodoCount = this.getActiveTodos().length;
    var tempalte = this.footerTemplate({
      activeTodoCount = activeTodoCount,
      activeTodoWord: utl.pluralize(activeTodoCount, 'item'),
      completedTodos: todoCount - activeTodoCount,
      filter: this.filter
    });

    //attach this object in the html footer obj
    $('#footer').toggle(todoCount > 0).html(template);
  },

  //todoTemplate, footerTemplate - handlebars.js templating library
  

}
  
  

}