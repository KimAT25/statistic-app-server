import express from 'express';
import cors from 'cors';

import routers from './routers.js';
import { getPath } from './utils/path.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', routers);

app.use((
    error,
    req,
    res,
    next
) => {
    if (req.type) {
        res.status(500).json({ message: 'Opps error happen on server...!!'});
    }
});

// app.use(express.static(getPath('dist/statistic-app', null)));
//
// // Catch-all route to serve 'index.html' from the 'dist' directory
// app.get('*',
//     (
//         req,
//         res,
//         next
//     ) => {
//
//     ;
//     res.sendFile(getPath('dist/statistic-app', 'index.html'));
// });

export default app;
