from selenium import webdriver
from selenium.webdriver.common.by import By
import time

shoe_keyword = ""   #enter keyword of shoe you are trying to get
email = ""  #nike login email
password = "" #nike login password
browser = webdriver.Chrome(executable_path='') #enter chrome webdriver path here



link = "https://twitter.com/nikestore"   #Twitter link
browser.maximize_window() # For maximizing window
browser.get(link)


#####SNIPES LINK FROM TWITTER######
while True:
    time.sleep(15) #refreshes every 15 seconds
    source = browser.page_source #downloads page source
    shoe_live = shoe_keyword in source  #checks page source for shoe using keywords

    if shoe_live == True:
        print("Found shoes")  #exits loop continues on to fetch link
        break
    else:
      browser.refresh()   #refresh browser
    

while True: #press on tweet
    try:
        tweet = browser.find_element(By.XPATH, '/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/div[2]/div/div/div[2]/section/div/div/div[1]').click()
        break
    except:
        pass
while True:
    try:  #searches for link in element 
        find_href = browser.find_element(By.CSS_SELECTOR, '.css-4rbku5.css-18t94o4.css-901oao.css-16my406.r-1cvl2hr.r-1loqt21.r-poiln3.r-bcqeeo.r-qvutc0')
        href = find_href.get_attribute("href") #find link inside element
        break
    except:
        pass

######CHECKOUTS ON NIKE WEBSITE#######
browser.get(href)
browser.find_element_by_xpath("/html/body/div[2]/div/div/div[2]/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div[3]/div[1]/button").click()  #Accept cookies


#    LOGIN     #
browser.find_element_by_id("aedfd9e0-2d97-48de-a434-c06f83e3e97f").send_keys("")  #Enter email
browser.find_element_by_id("7dfe57e6-8770-40cf-8ddb-da975ae7d113").send_keys("")  #Enter password      
