
var express 		= require('express');
var app 			= express();
var jade 			= require('jade');
var bodyParser     	= require('body-parser');
var methodOverride 	= require('method-override');
var phantom 		= require('phantom');

var util 			= require('util');

var mongoose 		= require('mongoose');
var connection 		= mongoose.connect('mongodb://localhost/invoicer');
var db				= mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', console.log.bind(console, 'Db connected in: ' + __dirname));

app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 								//Simulate DELETE/PUT requests
app.use(express.static('./app'));

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

app.listen(3000);

var InvoiceSchema 	= new mongoose.Schema({
	client_name:    {
		type: String,
		required: true
	},
	client_address: {
		type: String,
		required: true
	},
	sq_foot: 		{
		type: Number
	},
	num_rooms: 		{
		type: Number
	}
}, { strict: false });

//Attatch the model to the package db resource
var invoiceModel  	= mongoose.model('Invoice', InvoiceSchema);

function createInvoice(res, invoice){
	
}


app.route('/')
.get(function(req, res){
	res.render('index');
});

app.route('/api/clients')
.post(function(req, res){
	var inv 			= {};
	inv.client_name 	= req.body.client_name;
	inv.client_address	= req.body.client_address;
	inv.sq_foot 		= Number.parseInt(req.body.sq_foot);
	inv.num_rooms 		= Number.parseInt(req.body.num_rooms);

	var invoice 		= new invoiceModel(inv);


	//Save it to the db ( mongo )
	invoice.save(function (err, invoice) {
		if (err) return console.error(err);
	  	var html, page, templatePath, file = '/tmp/paulisawesome.pdf';

	  	console.log('Creating Invoice');
		phantom.create(function (ph){
			ph.createPage(function(_page){
				page = _page;
				app.render('pdf', {'data': invoice }, function(err, html){
					page.set('content', html);
					page.set('paperSize', { format: 'A4' });

					page.render(file, function(){
						console.log('rending page');

						console.log('donwloading file');
					  	res.download('/tmp/paulisawesome.pdf', '/tmp/paulisawesome.pdf', function(err){
						  if (err) {
						    console.log('error');
						    console.log(err);
						  } else {
						    console.log('invoice downloading');
						  }
						});

						ph.exit();
					});
				});
			});
		});
	});
});

