
function observeOrderListPage() {

  
  // We can reuse the majority of this code for both the new and old UIs
  // The only main differences are the: 1) which root node we're targeting 2) 
  
  let UI_VER = window.location.host == "sellerportal.tcgplayer.com" ? "NEW" : "OLD";

  let rootNode, trTargetString;

  if (UI_VER === "NEW"){
    // On the new UI we need to target the body because the table doesn't exist at page load
    rootNode = document.body;  
    // The new UI shares a URI handle for both the Order List and Order Details page, 
    // so we use this selector only target TRs that appear in DOM generated for the Order List view
    trTargetString = ".sp-order-index-view tbody.tcg-table-body > tr";
  }  
  else {
    // Old UI is shockingly less complicated.
    rootNode = document.querySelector('table');
    trTargetString = "tbody > tr";
  }


  const mutationCallback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
    
      /* 
      Okay so sometimes the SPA is adding new TR tags to the table, but 
      other times it's targeting TD tags for updates. Further still, it's occassionally 
      targeting SPAN tags inside of TD tags for updates.

      None of these elements, nor the table that contains them, exist on page load. 

      Therefore, we must target the BODY and just watch for ALL childList changes (add/remove nodes),
      and each time that happens, we have to look for ALL of the TR tags, pull the data, and update accordingly.

      I hate this, but it's the most straight forward way I can see to do this, though I am a myopic individual.
      If we target TR mutations directly we miss critical updates to the table or have to get very specific 
      (read: rigid and complicated) with our mutation targeting and that seems like a rabbit hole down which 
      I have no interest going. (Is that proper grammar?)
      */

      
      if(mutation.type === 'childList'){  

        const allTR = rootNode.querySelectorAll(trTargetString);
        
        // sometimes there are 0 TRs in the SPA is injecting into the DOM
        // so we don't want to run this part  
        if (allTR.length > 0) { 
          allTR.forEach(tr => {

            // for a brief moment in time there will be 1 TR will precisely 1 TD called `td.tcg-table-body__loading-cell`
            // this indicates that the table contents are loading
            // and we don't want to run this code while that's happening

            if (tr.childElementCount > 1){
              // variables for efficiency
              const parentnode  = tr.parentElement;
              const trclass     = tr.className;

              // get the row data
              const tdElements    = tr.querySelectorAll('td');
              const status        = tdElements[5].innerText;
              const isDirect      = status.includes("Direct");
              const shippingType  = tdElements[6].innerText;
              const orderTotal    = parseFloat(tdElements[9].innerText.replace('$', '')); 

              // remove the taco classes from all <tr> elements because the <tr>s get reused by the SPA code
              const tacoClasses = ["taco-expedited","taco-intl","taco-bmwt","taco-pickup","taco-presale","taco-ready-for-pickup"];  
              tacoClasses.forEach(
                (tacoClass) => {
                  tr.classList.remove(tacoClass);
                }
              );

              // is the code more readable like this? i have no idea.
              if(orderTotal > 49.99 && shippingType === "Standard" && !isDirect)      { tr.classList.add("taco-bmwt"); }
              if(shippingType === "Expedited" && !isDirect)                           { tr.classList.add("taco-expedited"); }
              if(shippingType === "International" && !isDirect)                       { tr.classList.add("taco-intl"); }
              if(shippingType === "In-Store Pickup" && status !== "Ready for Pickup") { tr.classList.add("taco-pickup"); }
              if(shippingType === "In-Store Pickup" && status === "Ready for Pickup") { tr.classList.add("taco-ready-for-pickup"); }
              if(status === "Presale")                                                { tr.classList.add("taco-presale"); }

            } // end if tr.child > 1        
          }); // end foreach allTR
        } // end if allTR.length check
      } // if mutation.type == childlist
    } // end foreach mutation
  }; // end mutationCallback

  // Create the observer with the callback
  const observer = new MutationObserver(mutationCallback);

  // Start observing the body for added elements, including deeper nodes
  observer.observe(rootNode, {
    childList: true,  // Watch for additions/removals of child elements
    subtree: true,    // Observe all descendant nodes, not just direct children
  });

} // end observeOrderListPage



// Run all of this business
observeOrderListPage();
