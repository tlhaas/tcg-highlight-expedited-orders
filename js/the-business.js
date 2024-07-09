// Select the table element you want to observe
const table = document.querySelector('table');

// Create a mutation observer instance
// 
// !!! EXPLANATION !!!
// 
// We're watching the table for _any_ changes to the child nodes (aka `childList` mutation).
// Why? It seems like they're using Vue and all XHR things happen after `document.ready`.
// If something happens to the <table>, we're gonna check ALL the <tr> in <tbody>
// This is pretty inefficient, but it's hard to pin down exactly what's being updated based on your position in the Pages of orders.
// For example, Page 1 of the Orders list is all new <tr>'s inserted into the <tbody>, which is cool and awesome.
// But when you page over to Page 2 the <tr>'s seem to be reused and updated with new <td>'s or <div>'s or some shit.
// This is not cool and awesome.
// You might be thinking... so just watch for <td> or <div> updates in the <table> right?
// WRONG. Sometimes rows just seemingly appear from nowhere and don't register as a mutation. 
// I know this seems impossible, but I was watching for <div> updates on Page 2 using CSS to 
// color it's grandparent (should have been a <tr>) and 4 rows in the middle of 25 just weren't being recognized.
// I don't fucking know. I'm also an idiot.
// This shit seems to work now and I love it just like it is.
// I'd say we could narrow the mutation focus to `table > tbody` but, frankly, I don't give a fuck.
// Also, regarding the inefficiency... there isn't any noticable lag on my old-as-fuck MacBookPro so that's cool.
//
// !!! MOST IMPORTANT !!! 
// This add-on should not have to exist. 
// This is a problem that could be solved with like one line of CSS and a class, but I don't work for TCGPlayer so this is our only option.

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {

      var allTR = table.querySelectorAll("tbody > tr");

      allTR.forEach(function(treno){
        var shipTypeTd    = treno.querySelector("td[data-label='Shipping Type']")
        var shipType      = shipTypeTd.firstChild.nodeValue.trim();  
        var orderTotalTd  = treno.querySelector("td[data-label='Total Amt']");
        var orderTotal    = Number(orderTotalTd.firstChild.nodeValue.trim().replace("$",""));
        var channelTd     = treno.querySelector("td[data-label='Channel']");
        var channel       = channelTd.firstChild.nodeValue.trim();  
        var statusTd      = treno.querySelector("td[data-label='Status']");
        var status        = statusTd.firstChild.nodeValue.trim();  

        console.log("asdf:" + channel + " " + status);

        if (shipType == "Expedited") { treno.classList.add("taco-expedited"); }
        if (orderTotal > 49.99) { treno.classList.add("taco-bmwt"); }
        if (channel == "My Store" && status == "Order Received") { treno.classList.add("taco-pickup"); }
        if (status == "Presale") { treno.classList.add("taco-presale"); }

      });

      /*
        Uncomment for troubleshooting:
        DEAR FIREFOX REVIEWERS. Please forgive me. I know this is gross, but this might be helpful for me in the future. 

        console.log("------------------------------------------------");
        console.log("Mutation type" , mutation.type); // Type of mutation (attributes, childList, etc.)
        console.log("Mutation target", mutation.target); // Node that was mutated
        console.log("Mutation old val", mutation.oldValue); // Previous value (for attributes)
        console.log("Added nodes" , mutation.addedNodes); // List of added nodes (for childList)
        console.log("The node", node);
        console.log("Removed node" , mutation.removedNodes); // List of removed nodes (for childList)
      */

    }
  });
});

// Configuration of the observer:
// We want to observe mutations to attributes, character data, and child elements of the table
const config = { attributes: true, childList: true, subtree: true };

// Start observing the target table for configured mutations
observer.observe(table, config);

// To stop observing later:
// observer.disconnect();