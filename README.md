# Dynamic operations on Django Models

A set of algorithms, helpers, and code for rapid and easy work with Django models.

## What you can do ##

* Retrieve of records
  * Render an html table
  * Specify foreign keys
  * Specify methods

* Add record
  * Html form generation
  * Handler for submission to the backend

* Delete record

## Let's create a CRUD for the product model, to see what we can do in detail
 * Define a template with the following structure:
   * ### HTML
        ```html
            {% csrf_token %}
            <h1 class="text text-center text-decoration-underline">Products</h1>
            <div id="form_products"></div>
            <hr>
            <div id="grid_products"></div>
            <hr> 
        ```
     Defining {% csrf_token %} is crucial because the javascript library will use it to make the POST requests to the server

   * ### JAVASCRIPT
      * Define the context variables
            ```javascript
                // A key value object to hold the model information
                prd_ctx = { 
                    //The app where the model is defined
                    model_app_name: 's_manage', 
                    //The model
                    model_name: 'Product', 
                    //Get the attributes of the models and handle the creation of an individual record
                    d_url: '{% url "s_model" %}', 
                    //Get the json representation of the model records
                    g_url: '{% url "get_model" %}', 
                    //Query records
                    q_url: '{% url "q_model" %}', 
                    //Div container  for the form element
                    fcoint: 'form_products', 
                    //Id for the form element
                    fid: `F${this.model_name}`, 
                    //Div container for the table element
                    gcoint: '#grid_products', 
                    //Width for the table element
                    width: '100%', 
                    //Height for the table element
                    height: '600px', 
                    //Mininum length for starting search records
                    mlen: 3, 
                    //Attributes of the ForeignKeys of the model Product
                    //By specifying these attributes, the backend will give us
                    //these attributes as a part of the json representation of the records
                    ffor: [
                        'category__name',
                        'family__name',
                        'brand__name'
                    ],
                    //Columns we don't want to appear in the html table
                    hiddens: ['category', 'family', 'brand', 'pk'],
                    //Mapping to rename the columns in the html table
                    //(keys in the json representation of the model)
                    crname: {
                        name: 'Name',
                        code: 'Cod',
                        pack: 'Pack',
                        category__name: 'Cat',
                        family__name: 'Fam',
                        brand__name: 'Brand',
                        id: 'ID'
                    }
                }         
            ```
      * Call the method for render the html table
            ```javascript
                uiR.get_lmodel(
                    {
                    model_app_name: prd_ctx.model_app_name,
                    model_name: prd_ctx.model_name,
                    ffor: prd_ctx.ffor,
                    d_url: prd_ctx.d_url,
                    g_url: prd_ctx.g_url,
                    gcoint: prd_ctx.gcoint,
                    width: prd_ctx.width,
                    height: prd_ctx.height,
                    hiddens: prd_ctx.hiddens,
                    crname: prd_ctx.crname,
                    }
                )      
            ```
      * Call the method for render and handle the html form
            ```javascript
                uiR.formalize_model({
                    model_app_name: prd_ctx.model_app_name,
                    model_name: prd_ctx.model_name,
                    fid: prd_ctx.fid,
                    fcoint: prd_ctx.fcoint,
                    d_url: prd_ctx.d_url,
                    q_url: prd_ctx.q_url,
                    g_url: prd_ctx.g_url,
                    ffor: prd_ctx.ffor,
                    gcoint: prd_ctx.gcoint,
                    hiddens: prd_ctx.hiddens,
                    crname: prd_ctx.crname,
                })
            ```
 ## The final result is a CRUD SPA.


## Tech Stack

* [Python 3.10.6](https://www.python.org/)
    * [django 4.2.1](https://www.djangoproject.com/)

* [Bootstrap 5](https://getbootstrap.com/)

* [SweetAlert2](https://sweetalert2.github.io/#download)


Happy Coding!!!!

Created by pjmakey2@gmail.com

