// very chatGPT name for a function 
function observeDynamicContent() {

  // UGH.
  const rootNode = document.body; 

  const mutationCallback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
    
      /* 
      Okay so sometimes the SPA is adding new TR tags to the table.
      Other times it's targeting TD tags for updates.
      Further still, sometimes it's targeting SPAN tags inside of TD tags for updates.

      None of these, nor the table that contains them, exists on page load. 

      Therefore, we must target the BODY and just watch for ALL childList changes (add/remove nodes),
      and each time that happens, we have to look for ALL of the TR tags, pull the data, and update accordingly.

      I hate this, but it's the most straight forward way I can think to do this. Otherwise we miss critical updates
      to the table or have to get very specific (read: rigid and complicated) with our targeting of mutations 
      and that seems like a rabbit hole down which I have no interest going. (Is that proper grammar?)

      Note: Originally I tried only only looking at mutations that targeted tbody.tcg-table-body but this was not
      reliable for the aforementioned reasons.
      */

      
      if(mutation.type === 'childList'){  

        //console.log(mutation)

        var allTR = rootNode.querySelectorAll("tbody.tcg-table-body > tr");

        allTR.forEach(tr => {

          // variables for efficiency
          const parentnode  = tr.parentElement;
          const trclass     = tr.className;

          // get the row data
          const tdElements    = tr.querySelectorAll('td');
          const buyerName     = tdElements[2].innerText;
          const status        = tdElements[5].innerText;
          const shippingType  = tdElements[6].innerText;
          const orderTotal    = parseFloat(tdElements[9].innerText.replace('$', '')); 

          // remove the taco classes from all <tr> elements because the <tr>s get reused by the SPA code
          const tacoClasses = ["taco-expedited","taco-intl","taco-bmwt","taco-pickup","taco-presale"];  
          tacoClasses.forEach(
            (tacoClass) => {
              tr.classList.remove(tacoClass);
            }
          );

          if(orderTotal > 49.99 && shippingType === "Standard") { tr.classList.add("taco-bmwt"); }
          if(shippingType === "Expedited")                      { tr.classList.add("taco-expedited"); }
          if(shippingType === "International")                  { tr.classList.add("taco-intl"); }
          if(shippingType === "In-Store Pickup")                { tr.classList.add("taco-pickup"); }
          if(status === "Presale")                              { tr.classList.add("taco-presale"); }

          // we logged tr's and their contents here to compare against mutation events and their targets
          //console.log(buyerName, ' ' , shippingType, ' ', orderTotal);
          //console.log(tr)
          
        });
      } // if mutation.type
    } // end for
  }; // end mutationCallback

  // Create the observer with the callback
  const observer = new MutationObserver(mutationCallback);

  // Start observing the body for added elements, including deeper nodes
  observer.observe(rootNode, {
    childList: true,  // Watch for additions/removals of child elements
    subtree: true,    // Observe all descendant nodes, not just direct children
  });

} // end observeDynamicContent

// Start observing the dynamic content when the page loads

const UI_VER = window.location.host == "sellerportal.tcgplayer.com" ? "NEW" : "OLD";
console.log(UI_VER);
observeDynamicContent();

/*

// Select the table element you want to observe
const table = document.querySelector('table');

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {

      var allTR = table.querySelectorAll("tbody > tr");

      allTR.forEach(function(treno){
        var shipTypeTd    = treno.querySelector("td[data-label='Shipping Type']")
        var shipType      = shipTypeTd.firstChild.nodeValue.trim();  
        var orderTotalTd  = treno.querySelector("td[data-label='Total Amt']");
        var orderTotal    = Number(orderTotalTd.firstChild.nodeValue.trim().replace("$","").replace(",",""));
        var channelTd     = treno.querySelector("td[data-label='Channel']");
        var channel       = channelTd.firstChild.nodeValue.trim();  
        var statusTd      = treno.querySelector("td[data-label='Status']");
        var status        = statusTd.firstChild.nodeValue.trim();  

        // they reuse the <tr>s so we gotta remove all taco class on reload
        const tacoClasses = ["taco-expedited","taco-intl","taco-bmwt","taco-pickup","taco-presale"];

        tacoClasses.forEach(
          (tacoClass) => {
            treno.classList.remove(tacoClass);
          }
        );

        if (shipType == "Expedited") { treno.classList.add("taco-expedited"); }
        if (shipType == "International") { treno.classList.add("taco-intl"); }
        if (orderTotal > 49.99) { 
          // we want to keep Expedited orders red regardless of dollar amount
          if (shipType != "Expedited"){
            treno.classList.add("taco-bmwt"); 
          }
        }
        if (channel == "My Store" && status == "Order Received") { treno.classList.add("taco-pickup"); }
        if (status == "Presale") { treno.classList.add("taco-presale"); }

      });

      
      //  Uncomment for troubleshooting:
      //DEAR FIREFOX REVIEWERS. Please forgive me. I know this is gross, but this might be helpful for me in the future. 

      //console.log("------------------------------------------------");
      //console.log("Mutation type" , mutation.type); // Type of mutation (attributes, childList, etc.)
      //console.log("Mutation target", mutation.target); // Node that was mutated
      //console.log("Mutation old val", mutation.oldValue); // Previous value (for attributes)
      //console.log("Added nodes" , mutation.addedNodes); // List of added nodes (for childList)
      //console.log("The node", node);
      //console.log("Removed node" , mutation.removedNodes); // List of removed nodes (for childList)
      

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

*/