require('dotenv').config()
const { DB_CONNECTION_STRING, SERVER_PORT, SESSION_SECRET, DEV } = process.env;

const express = require('express')
	, session = require('express-session')
	, massive = require('massive')
	, pgSession = require('connect-pg-simple')


const app = express();
// *** TOPLEVEL MIDDLEWARE *** //

app.use(express.json());
app.use(session({
	store: new pgSession({
		conString: DB_CONNECTION_STRING,
		schemaName: 'user_session'
	}),
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
massive(DB_CONNECTION_STRING)
	.then(db => {
		app.set('db', db);
	});

// --- auth bypass for future use --- //
// app.use((req, res, next) => {
// 	if (DEV = 'true') {
// 		if (!req.session.user) {
// 			req.session.user = {};
// 			next();
// 		} else {
// 			next();
// 		}
// 	} else {
// 		next();
// 	}
// });
// *** ENDPOINTS *** //


// *** IM LISTENING! *** //

app.listen(SERVER_PORT, () => console.log(`Listening on PORT: ${SERVER_PORT}`));
