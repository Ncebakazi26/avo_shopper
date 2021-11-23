const express = require('express');
const exphbs  = require('express-handlebars');
const avoshopper = require('./avo-shopper')
const pg = require("pg");
const Pool = pg.Pool;
const app = express();


// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

let counter = 0;
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/avoshopper';
const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const avo = avoshopper(pool);
app.get('/', async function(req, res) {
	const deals =  await avo.topFiveDeals()
	res.render('index', {
		deals
	});
});
app.get('/avo/Topdeals', async function (req,res){
	try {
		const deals = await avo.topFiveDeals()
		res.redirect('/')
	} catch (error) {
		console.log(error)
	}
    
  
});
app.get('/avo/deals', async function(req,res){
try {
	const allShops = await avo.listShops()
	res.render('avo/deals',{allShops} );
} catch (error) {
	
}


});
app.post('/avo/deals', async function(req,res){
	try {
		const shopId = req.body.avo_id
	const qty = req.body.qty
	const prc = req.body.prc
    await avo.createDeal(shopId,qty,prc)
	
	res.redirect('/')
	} catch (error) {
		
	}
})
app.get('/avo/allshop', async function(req,res){
	try {
		const allShops = await avo.listShops()
	res.render('avo/allshop',{
		allShops
	})
	} catch (error) {
		
	}
	
})
app.post('/avo/add', async function(req,res){
	try {
	const shopName = req.body.shop_name
	const newShop = await avo.createShop(shopName)

	res.redirect('/')

	} catch (error) {
		
	}
	
})
app.get('/avo/add', async function(req,res){
	try {
		res.render('avo/add');
	} catch (error) {
		
	}
	
	
	});


// start  the server and start listening for HTTP request on the PORT number specified...
const PORT =  process.env.PORT || 3019;
app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});