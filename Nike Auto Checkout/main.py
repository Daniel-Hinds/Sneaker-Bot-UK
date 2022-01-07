#Nike Auto Checkout

from selenium import webdriver
import time

link = ""   #link for trainers, drops 15 mins early on twitter
email = ""  #nike login email
password = "" #nike login password

browser = webdriver.Chrome(executable_path='D:\Programming\Python\chromedriver_win32/chromedriver')
browser.maximize_window() # For maximizing window

browser.get(link)
time.sleep(5)


browser.find_element_by_xpath("/html/body/div[2]/div/div/div[2]/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div[3]/div[1]/button").click()  #Accept cookies


#    LOGIN     #
browser.find_element_by_id("aedfd9e0-2d97-48de-a434-c06f83e3e97f").send_keys("")  #Enter email
browser.find_element_by_id("7dfe57e6-8770-40cf-8ddb-da975ae7d113").send_keys("")  #Enter password
