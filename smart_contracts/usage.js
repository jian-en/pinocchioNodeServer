const ballots = require('./ballots');

organizer = "0xA3d3dC9071E84A7D02DAab1d40c6BeA30554bCba"; // replace this with one in your local blockchain
// Examples to use those interfaces
// 1. Add the organizer
ballots.addOrganizer(organizer)
    .then(tx => {
        console.log("Organizer is added successfully!");
    })
    .catch(err => {
        console.log(err);
    });

// comment this out if you have run the first
// 2. Approve an event
/*
approveEvent(organizer, "1234")
    .then(tx => {
        console.log("Event is approved successfully!");
    })
    .catch(err => console.log(err));
 */
