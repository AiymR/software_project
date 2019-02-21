var mongoose = require("mongoose");
var Review = require("./models/review");
var Comment   = require("./models/comments");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1050&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "blah blah blah"
    },
    {
        name: "Sweather Weather",
        image: "https://images.unsplash.com/photo-1482463208666-6d9c3b6c30ab?auto=format&fit=crop&w=1050&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "blah blah blah blah"
    },
    {
        name: "Wow",
        image: "https://images.unsplash.com/photo-1422207134147-65fb81f59e38?auto=format&fit=crop&w=958&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "blah blah blah blah blah blah"
    }
]

function seedDB(){
   //Remove all campgrounds
   Review.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed reviews!");
         // add a few campgrounds
        data.forEach(function(seed){
            Review.create(seed, function(err, review){
                if(err){
                    console.log(err)
                 }
                 else {
                    console.log("added a review");
                    // create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish it was colder",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                review.comments.push(comment);
                                review.save();
                                console.log("Created new comment");
                            }
                        });
                 }
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;
