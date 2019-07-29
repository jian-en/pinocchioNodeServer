const ballots = require('./ballots');

organizer = "0xA3d3dC9071E84A7D02DAab1d40c6BeA30554bCba";
// Examples to use those interfaces
ballots.getBalance().then(value => console.log(value));

/*
transferEtherTo(organizer)
    .catch(err => console.log(err))
    .then(tx => {
        console.log("Success!");
    });
 */

/*
addOrganizer(organizer)
    .then(tx => {
        console.log("Success!");
    })
    .catch(err => {
        console.log(err);
    });
*/

/*
approveEvent(organizer, "1234")
    .then(tx => {
        console.log("Success!");
    })
    .catch(err => console.log(err));

 */
