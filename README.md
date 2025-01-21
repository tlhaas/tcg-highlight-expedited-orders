# tcg-highlight-expedited-orders

This is the common codebase for the Google Extension and Firefox Add-on named "TCG Highlight Expedited Orders."

Originally it was created to only highlight expedited orders, but more colors added over time. 

This is the current list of highlight colors:

* Expedited Orders (Red)
* Order Total over $49.99 (Yellow and bold)
* International Orders (Lime Green)
* In-Store Pickup Orders: Pull for Pickup (Lilac)
* In-Store Pickup Order: Ready for Pickup (Cornflower Blue)
* Presale Orders (Orange)

This code will work with both the old and new Order UIs (as of Dec 10, 2024).

## Notes

`zip -vr filename.zip css js icons manifest.json` for CLI zipping. Yes I am this lazy.