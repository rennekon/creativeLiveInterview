creativeLiveInterview
=====================

Hey CreativeLive team!

Thanks for taking the time to check out this project.

tl;dr 'npm install' and start the server with 'node server.js'

=====================

I approached this project in a couple phases. 

Firstly I figured out all of the available user actions: 
  1.  Viewing a band for the base project [GET /{band?}]
  2.  Modifying a band for the extra credit [POST /{band}]
  
After parsing in the data, I setup a boilerplate ejs file for the information I wanted to display. [a list of bands, with the potential to show band details]

=====================

After organizing the static display view, I moved onto data modification. For this particular project I opted to use the standard POST method instead of using a hidden input or xhr for a PUT request. This was primarily to keep the template and server code as clean as possible and I recognize that POST is most often associated with object creation rather than modification.

=====================

The original POST /{band} route would overwrite the stored data for {band} with whatever had been posted up from the form. Since {band} was tied to the mutable 'band.name', the route fires back a redirect to the new 'band.name' url.  In reality this could all be handled without redirecting by adding in a framework like backbone, angular, etc. or doing the xhr requests ourselves.

=====================

Once that was all up and running, I added session support. When a user visits the site, they are assigned a unique identifier. If they make changes to a band, their changed band values are stored using that unique identifier, with the default values being cloned if it's their first modification. New browsers get new unique values, and the values persist for a month [the ttl of the cookie] or until the server restarts and the stored data is lost.

=====================

I used pure bootstrap for the UI, shortId for the unique ids, and lodash for some general nice js funcs.
