create table shop(
	id serial not null primary key unique,
	name text not null unique
);

create table avo_deal (
	id serial not null primary key,
	qty int,
	price decimal(10,2),
	shop_id int,
	foreign key (shop_id) references shop(id)
);
-- dbname= avoshopper
-- heroku name = avocados-app 

-- https://github.com/Ncebakazi26/avo_shopper
