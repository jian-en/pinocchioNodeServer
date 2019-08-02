const ballots = require('./ballots');

organizer = "0xcd5dc1383304ab06bc5efec73db206a1175886a4"; // replace this with one in your local blockchain
// Examples to use those interfaces

// 1. Add the organizer

ballots.addOrganizer(organizer)
    .then(tx => {
        console.log("Organizer is added successfully!");
    })
    .catch(err => {
        console.log(err);
    });
 


// ballots.checkOrganizer(organizer)
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });
 

// comment this out if you have run the first
// 2. Approve an event
/*
ballots.approveEvent(organizer, "1234")
    .then(tx => {
        console.log("Event is approved successfully!");
    })
    .catch(err => console.log(err));

 */

/*
ballots.checkEventApproval(organizer, '1234')
  .then(console.log);
 */