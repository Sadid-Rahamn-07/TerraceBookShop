all:
	sudo service mysql start
	
start:
	sudo mysql -u root -p

dump:
	sudo mysqldump -u root -p bookstore > bookstore.sql

import:
	sudo mysql -u root -p bookstore < bookstore.sql
