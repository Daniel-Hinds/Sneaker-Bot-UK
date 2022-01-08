# Sneaker-Bot-UK
A python bot using the Selenium library to auto-buy specified sneakers on the nike.com website.

#How To Use
Run `pip install -r requirements.txt`

Download the Chrome webdriver from here https://chromedriver.chromium.org/downloads

Open the main.py file using IDLE

Change the keywords to that of the trainers you want to buy (keep it to 1 or 2)

Fill in your details where instructed

To auto-buy the item enter 1 | To stop the script before buying the item (for testing purposes) enter 2

Enter the FULL path of the chromedriver where instructed

Save the file and execute it



# Twitter Link Sniper
This uses keywords of shoes to check the latest tweet from Nike, ensure it is the correct shoe then fetch the link. This is useful for completely automating the process of buying exclusive trainers from the Nike website.

# Nike Autocheckout
This part of the bot takes an input of a link, refreshes the nike website until it comes in stock and then will autocheckout with the details provided to it.

# How It Works

Selenium is a library which allows you to control the chrome (and firefox) web browser using python. Due to this the bot can navigate webpages by making use of classes, IDs or xpaths of the HTML. 

The bot checks if a shoe is in stock by refreshing the Nike webpage (every 10 seconds) until it detects the add to cart button appear by checking for its HTML class. When it appears it clicks the button and initiates the rest of the program which executes the checkout process.

# Credits 

Daniel Hinds
