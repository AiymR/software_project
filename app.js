var express = require('express'),
 							app = express(),
						 	bodyParser = require("body-parser"),
							mongoose = require("mongoose"),
              Review = require("./models/review"),
              seedDB = require("./seed");
              Comment = require("./models/comments"),
              // User = require("./models/user")
seedDB();
mongoose.connect("mongodb://localhost/MyPlanet");
app.use(bodyParser.urlencoded({extend: true}));

// app.get('/myplanet', function(req, res) {
//     res.sendFile('public/myplanet.html', {root: __dirname })
// });
// app.get('/js/myplanet.js', function(req, res) {
//     res.render('myscript');
// });

// app.use("/static", express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");




//
// Review.create({
//     name: "Patrick Star",
//     image: "https://media.giphy.com/media/2APfUfaZLtppC/giphy-facebook_s.jpg",
//     description: "Amazing lorem  indksandh bfjdfbkjxzbcmxzbcmjxc hfgsdjcbcnzxjgckjbkcjzxvhcxbnmcbzxjcbkj"
// }, function(err, review){
//     if(err){
//         console.log(err);
//     } else{
//         console.log("Newly Created review:");
//         console.log(review);
//     }
// });
// var reviews = [
// 	{name: "Patrick Star", image: "https://media.giphy.com/media/2APfUfaZLtppC/giphy-facebook_s.jpg"},
// 	{name: "Danny Phantom", image: "http://surpriselists.com/wp-content/uploads/2015/11/Iceland.jpg"},
// 	{name: "Elvis Presley", image: "http://www.chymfm.com/files/The-Martian-637x339.jpg"},
// 	{name: "Patrick Star", image: "https://media.giphy.com/media/2APfUfaZLtppC/giphy-facebook_s.jpg"},
// 	{name: "Danny Phantom", image: "http://surpriselists.com/wp-content/uploads/2015/11/Iceland.jpg"},
// 	{name: "Elvis Presley", image: "http://www.chymfm.com/files/The-Martian-637x339.jpg"}
// ];

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/reviews", function(req, res){
	Review.find({}, function(err, allReviews){
		if(err){
			console.log(err);
		} else{
			res.render("reviews/index", {reviews:allReviews});
		}
	});
		// res.render("reviews", {reviews:reviews});
});
app.post("/reviews", function(req, res) {
			var name = req.body.name;
			var image = req.body.image;
			var desc = req.body.description;
			var newReview = {name: name, image: image, description: desc};
			//reviews.push(newReview);
			Review.create(newReview, function(err, newlyCreated){
				if(err){
					console.log(err);
				}else{
					res.redirect("/reviews");
				}
			});
			//res.redirect("/reviews");
});

app.get("/reviews/new", function(req, res){
	res.render("reviews/new.ejs");
});
app.get("/reviews/:id", function(req, res){
    Review.findById(req.params.id).populate("comments").exec(function(err, foundReview){
       if(err){
           console.log(err);
       } else {
         console.log(foundReview)

            res.render("reviews/show", {review: foundReview});
       }
    });
});

app.get("/reviews/:id/comments/new", function(req, res){

  Review.findById(req.params.id, function(err, review){
      if(err){
          console.log(err);
      } else {
           res.render("comments/new", {review: review});
      }
  })
});
app.post("/reviews/:id/comments", function(req, res){
   //lookup campground using ID
   Review.findById(req.params.id, function(err, review){
       if(err){
           console.log(err);
           res.redirect("/reviews");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               review.comments.push(comment);
               review.save();
               res.redirect('/reviews/' + review._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});
app.delete("/reviews/:id/comments/:comment_id", function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/reviews/" + req.params.id);
       }
    });
});

app.listen(3000, () => {
  console.log("server started");
});
