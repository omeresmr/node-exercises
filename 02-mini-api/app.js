// Routing
// GET /products -> Gibt alle Produkte zurück
// POST /products -> Fügt ein neues Produkt in die JSON Datei ein. Req-body: {"title", "price"}
// GET /products/:id
// DELETE /products/:id

// Middlewares
// Eine Logging Middleware die so loggt: [2025-11-25 15:33:02] GET /products
// Timestamp Middleware -> Jede request kriegt req.requestTime = newDate().toISOString() und wird im Controller an den Client zurückgegeben.
// Body-Parser Middleware -> app.use(express.json())

// Globales Error Handling

// public -> static

// Custom 404 Page

// Post darf nur weitergehen, wenn -> title existiert und rice eine number ist.

//
