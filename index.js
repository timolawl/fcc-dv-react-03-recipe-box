
//cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react.min.js
//cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.min.js
// + babel

// FCC: Build a Recipe Box
// User Story: I can create recipes that have names and ingredients.
// User Story: I can see an index view where the names of all the recipes are visible.
// User Story: I can click into any of those recipes to view it.
// User Story: I can edit these recipes.
// User Story: I can delete these recipes.
// User Story: All new recipes I add are saved in my browser's local storage. If I refresh the page, these recipes will still be there.

/*********************************************
 * For some reason, browsing Codepen messes  *
 * up the localStorage for this page.        *
 * Therefore, this is set to clear until a   *
 * solution can be found:                    */

localStorage.clear();

/********************************************/

var recipes = [
{name: 'Success', ingredients: ['Lifelong Ambition', 'Iron Will Discipline', 'Focused Persistence', 'Transcendent Vision']}, 
{name: 'Americano', ingredients: ['Hot Water', 'Brewed Espresso']}, 
{name: 'Codepen', ingredients: ['Recipe: Americano']},
{name: 'Virtuoso Status', ingredients: ['10,000 Hours']},
{name: 'Codepen Virtuoso', ingredients: ['Recipe: Codepen', 'Recipe: Virtuoso Status', 'Recipe: Success']}
];

var myStorage = localStorage;
var storedRecipes = [];

updateStorage('add', recipes, true);

function updateStorage(operation, recipeItem, initializeArray) {

  if(operation === 'add') { // if add operation
    if(!myStorage.length) { // if storage is not empty
      recipeItem.forEach(function(recipe) { // populate local storage with initial
        myStorage.setItem(recipe.name, JSON.stringify(recipe));
      });
    }
    if(initializeArray) { // initialize storedRecipes array
      //for (var key in myStorage) {
      for (var i = 0; i < myStorage.length; i++) {  
      //  var parsedRecipe = myStorage[key];
        var parsedRecipe = JSON.parse(myStorage.getItem(myStorage.key(i))); // this method works for Firefox.
        
        storedRecipes.push(
          {name: parsedRecipe.name, 
           ingredients: parsedRecipe.ingredients
          }
        );
      }
    }
    else { // if not initializing, add new item to storage and aray.
      myStorage.setItem(recipeItem.name, JSON.stringify(recipeItem));
      storedRecipes.push(recipeItem);
    }
  }  
  else if(operation === 'remove') { // if remove/delete operation
    myStorage.removeItem(recipeItem.name);
  }
  else if (operation === 'update') {
    myStorage.removeItem(recipeItem.name);
    myStorage.setItem(recipeItem.name, JSON.stringify(recipeItem));
  }
  
 // console.log(myStorage);
 // console.log(storedRecipes);
}


function arrayObjectIndexOf(myArray, searchTerm, property) {
  for(var i = 0, len = myArray.length; i < len; i++) {
    if(myArray[i][property] === searchTerm) return i;
  }
  return -1;
}


var Recipe = React.createClass({
  
  getInitialState: function() {
    return { checked: false }
  },  
  
  componentDidMount: function() {
    if(this.props.name === 'Codepen Virtuoso')
      this.refs.CodepenVirtuoso.getDOMNode().checked = true;
    //  ReactDOM.findDOMNode(this.refs.check).checked = true;  
  },
  
  render: function() {
    var clickHandler = this.props.onClick;    
    var recipe = this.props.recipe;
    var recipeName = this.props.name.replace(/ /g, '');
     return (
      <div>
        <input type='radio' name='accordion' id={recipeName} ref={recipeName} />
        <label htmlFor={recipeName} className='recipe__name recipe__name--box'>{this.props.name}</label>
        <div className='recipe__contents card'>
          <div className='recipe__header recipe__header--card'>Recipe Card</div>
          <h3 className='recipe__name recipe__name--card'>{this.props.name}</h3>
          <div className='recipe__ingredients'>
            {this.props.ingredients.map(function(ingredient) {
              return (<div className='recipe__ingredient'>{ingredient}</div>);
            })}
          </div>
          <button id='edit' className='recipe__edit' onClick={clickHandler.bind(this, recipe, 'edit')}>Edit</button>
          <button id='delete' className='recipe__delete' onClick={clickHandler.bind(this, recipe, 'delete')}>Delete</button>
        </div>
      </div>
    );
  }
});

var Recipes = React.createClass({  
  render: function() {
    var clickHandler = this.props.onClick;
    var recipes = this.props.recipes;
   
    var recipeNodes = this.props.recipes.map(function(recipe) {
    //  key has special meaning in React. Not just a simple prop.
      return (
          <div>
            <Recipe name={recipe.name} ingredients={recipe.ingredients} onClick={clickHandler} recipe={recipe} recipes={recipes} />
          </div>
      );
    });
    
    return (
      <div>
        <div className='recipe__header recipe__header--box'>Recipe Box</div>
        <div className='recipe__boxwrap'>
          {recipeNodes}
        </div>
      </div>
    );
  }
});


var RecipeForm = React.createClass({
  getInitialState: function() {
     return {recipe: '', ingredients: ''};
  },
 
  handleRecipeChange: function(e) {
    this.setState({recipe: e.target.value});
  },
  
  handleIngredientChange: function(e) {
    var parsedIngredients = e.target.value.split(/,/g); 
    this.setState({ingredients: parsedIngredients});
  },
  
  handleSubmit: function(e) {
    e.preventDefault();
    var recipe = this.state.recipe.trim();
    var ingredients = this.state.ingredients;
    if(!ingredients || !recipe) {
      return;
    }
    this.props.onRecipeSubmit({name: recipe, ingredients: ingredients});
    this.setState({recipe: '', ingredients: ''});
  },
  
  componentWillReceiveProps: function(props) { // this is for when props have changed and after initial rendering.
    var recipe = props.prefilled;
    if(recipe) {
      this.setState({recipe: recipe.name, ingredients: recipe.ingredients});
    }
  },
  
  render: function() {
    if(this.props.prefilled) {
      return (
        <form className='recipe__form' onSubmit={this.handleSubmit}>
          <input 
            className='recipe__input--name'
            type='text' 
            placeholder='Recipe name' 
            value={this.state.recipe} 
            onChange={this.handleRecipeChange} 
          />
          <input 
            className='recipe__input--ingredients'
            type='text' 
            placeholder='Ingredients, comma-separated' 
            value={this.state.ingredients}
            onChange={this.handleIngredientChange}
          />
          <input className='recipe__input--submit' type='submit' value='Edit Recipe' />
        </form>
      );
    }
    else {
      return (
        <form className='recipe__form' onSubmit={this.handleSubmit}>
          <input 
            className='recipe__input--name'
            type='text' 
            placeholder='RECIPE NAME' 
            value={this.state.recipe} 
            onChange={this.handleRecipeChange} 
          />
          <input 
            className='recipe__input--ingredients'
            type='text' 
            placeholder='INGREDIENTS (COMMA SEPARATED)' 
            value={this.state.ingredients}
            onChange={this.handleIngredientChange}
          />
          <input className='recipe__input--submit' type='submit' value='Add Recipe' />
        </form>
      );
    }  
  }
});


var RecipeBox = React.createClass({
  handleRecipeSubmit: function(recipe) {
    var recipes = this.state.recipes;
    var targetRecipe = arrayObjectIndexOf(recipes, recipe.name, 'name');
    if(targetRecipe === -1) {
      var newRecipes = recipes.concat([recipe]);
      this.setState({recipes: newRecipes});
      updateStorage('add', recipe);
    }
    else {
      recipes.splice(targetRecipe, 1, recipe);
      this.setState({recipes: recipes});
      updateStorage('update', recipe);
    }
    this.setState({edit: '', index: null}); // reset input fields after submission.
  },

  handleClick: function(recipe, operation) {   
    var recipes = this.state.recipes;
    var targetRecipe = arrayObjectIndexOf(recipes, recipe.name, 'name');
    
    if(operation === 'edit') {
      console.log('You want to edit: ' + recipe.name);
      this.setState({edit: recipe.name,
                    index: targetRecipe });
    }
      
    else if(operation === 'delete') {
      console.log('You want to delete: ' + recipe.name);
      recipes.splice(targetRecipe, 1);
      this.setState({recipes: recipes}); // this also sets storedRecipes, because they're linked.
      updateStorage('remove', recipe); // this is for updating the actual local storage.
    }
  },
  
  getInitialState: function() {
    return {recipes: storedRecipes,
           edit: '',
           index: null };
  },
  
  render: function() {
    var editStatus = this.state.edit;
    var index = this.state.index;
    var recipeToEdit = this.state.recipes[index];

    if(editStatus) {
      return (
        <div>
          <Recipes recipes={this.state.recipes} onClick={this.handleClick} />
          <RecipeForm onRecipeSubmit={this.handleRecipeSubmit} prefilled={recipeToEdit}/>
        </div>
      );
    }
    else return (
      <div>
        <Recipes recipes={this.state.recipes} onClick={this.handleClick} />
        <RecipeForm onRecipeSubmit={this.handleRecipeSubmit} />
      </div>
    );
  }
});

ReactDOM.render(<RecipeBox recipes={storedRecipes} />, document.getElementById('box'));

